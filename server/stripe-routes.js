import express from 'express';
import stripeService from './stripe-service.js';
import db from './database-expanded.js';

const router = express.Router();

// Middleware to verify authentication
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const session = db.sessionDb.getByToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  req.userId = session.user_id;
  next();
}

/**
 * GET /api/stripe/pricing
 * Get pricing tiers configuration
 */
router.get('/pricing', (req, res) => {
  try {
    const pricing = stripeService.getPricingTiers();
    res.json({ pricing });
  } catch (error) {
    console.error('Error getting pricing:', error);
    res.status(500).json({ error: 'Failed to get pricing' });
  }
});

/**
 * POST /api/stripe/checkout
 * Create checkout session for subscription
 */
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { tier } = req.body;
    const user = db.userDb.getById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const session = await stripeService.createCheckoutSession(
      req.userId,
      tier,
      user.email
    );
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/stripe/portal
 * Create customer portal session
 */
router.post('/portal', authenticate, async (req, res) => {
  try {
    const subscription = db.subscriptionDb.getByUserId(req.userId);
    
    if (!subscription || !subscription.stripe_customer_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    const session = await stripeService.createPortalSession(
      subscription.stripe_customer_id
    );
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stripe/subscription
 * Get current subscription details
 */
router.get('/subscription', authenticate, async (req, res) => {
  try {
    const subscription = db.subscriptionDb.getByUserId(req.userId);
    
    if (!subscription) {
      return res.json({ subscription: null });
    }
    
    // Get fresh data from Stripe if we have a subscription ID
    if (subscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripeService.getSubscription(
          subscription.stripe_subscription_id
        );
        
        // Update local database with latest info
        db.subscriptionDb.update(subscription.id, {
          status: stripeSubscription.status,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString()
        });
        
        subscription.status = stripeSubscription.status;
        subscription.current_period_end = new Date(stripeSubscription.current_period_end * 1000).toISOString();
      } catch (stripeError) {
        console.error('Error fetching from Stripe:', stripeError);
      }
    }
    
    res.json({ subscription });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

/**
 * POST /api/stripe/cancel
 * Cancel subscription
 */
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const subscription = db.subscriptionDb.getByUserId(req.userId);
    
    if (!subscription || !subscription.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    await stripeService.cancelSubscription(subscription.stripe_subscription_id);
    
    // Update local database
    db.subscriptionDb.update(subscription.id, {
      status: 'canceled',
      canceled_at: new Date().toISOString()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/stripe/update
 * Update subscription (upgrade/downgrade)
 */
router.post('/update', authenticate, async (req, res) => {
  try {
    const { tier } = req.body;
    const subscription = db.subscriptionDb.getByUserId(req.userId);
    
    if (!subscription || !subscription.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    const updatedSubscription = await stripeService.updateSubscription(
      subscription.stripe_subscription_id,
      tier
    );
    
    // Update local database
    db.subscriptionDb.update(subscription.id, {
      plan_id: tier,
      status: updatedSubscription.status
    });
    
    res.json({ success: true, subscription: updatedSubscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    const event = stripeService.verifyWebhookSignature(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const tier = session.metadata.tier;
        
        // Create subscription record
        db.subscriptionDb.create({
          user_id: userId,
          plan_id: tier,
          status: 'trialing',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const dbSubscription = db.subscriptionDb.getByStripeId(subscription.id);
        
        if (dbSubscription) {
          db.subscriptionDb.update(dbSubscription.id, {
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const dbSubscription = db.subscriptionDb.getByStripeId(subscription.id);
        
        if (dbSubscription) {
          db.subscriptionDb.update(dbSubscription.id, {
            status: 'canceled',
            canceled_at: new Date().toISOString()
          });
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const dbSubscription = db.subscriptionDb.getByStripeId(invoice.subscription);
        
        if (dbSubscription) {
          db.subscriptionDb.update(dbSubscription.id, {
            status: 'past_due'
          });
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const dbSubscription = db.subscriptionDb.getByStripeId(invoice.subscription);
        
        if (dbSubscription) {
          // Create invoice record
          db.invoiceDb.create({
            user_id: dbSubscription.user_id,
            subscription_id: dbSubscription.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid / 100,
            status: 'paid',
            paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          });
          
          // Update subscription status
          db.subscriptionDb.update(dbSubscription.id, {
            status: 'active'
          });
        }
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
