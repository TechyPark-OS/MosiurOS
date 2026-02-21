import { db } from './database.js';

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event) {
  console.log(`[Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[Webhook] Error handling ${event.type}:`, error);
    throw error;
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!userId) {
    console.error('[Webhook] No user ID in checkout session');
    return;
  }

  console.log(`[Webhook] Checkout completed for user ${userId}`);

  // Update user with Stripe customer ID
  db.prepare(`
    UPDATE users 
    SET stripe_customer_id = ?, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(customerId, userId);

  // Create subscription record
  if (subscriptionId) {
    const tier = session.metadata?.tier || 'starter';
    
    db.prepare(`
      INSERT INTO subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id, 
        tier, status, trial_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'trialing', datetime('now', '+14 days'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(userId, subscriptionId, customerId, tier);

    console.log(`[Webhook] Created subscription for user ${userId}, tier: ${tier}`);
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const tier = subscription.metadata?.tier || 'starter';
  const status = subscription.status;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

  // Find user by customer ID
  const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').get(customerId);

  if (!user) {
    console.error(`[Webhook] No user found for customer ${customerId}`);
    return;
  }

  console.log(`[Webhook] Subscription created for user ${user.id}`);

  // Check if subscription already exists
  const existing = db.prepare('SELECT id FROM subscriptions WHERE stripe_subscription_id = ?').get(subscriptionId);

  if (existing) {
    // Update existing
    db.prepare(`
      UPDATE subscriptions 
      SET status = ?, tier = ?, trial_end = ?, updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ?
    `).run(status, tier, trialEnd, subscriptionId);
  } else {
    // Create new
    db.prepare(`
      INSERT INTO subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id,
        tier, status, trial_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(user.id, subscriptionId, customerId, tier, status, trialEnd);
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const tier = subscription.metadata?.tier;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;

  console.log(`[Webhook] Subscription updated: ${subscriptionId}, status: ${status}`);

  const updates = [];
  const params = [];

  updates.push('status = ?');
  params.push(status);

  if (tier) {
    updates.push('tier = ?');
    params.push(tier);
  }

  if (trialEnd) {
    updates.push('trial_end = ?');
    params.push(trialEnd);
  }

  if (currentPeriodEnd) {
    updates.push('current_period_end = ?');
    params.push(currentPeriodEnd);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(subscriptionId);

  db.prepare(`
    UPDATE subscriptions 
    SET ${updates.join(', ')}
    WHERE stripe_subscription_id = ?
  `).run(...params);
}

/**
 * Handle subscription deleted/cancelled
 */
async function handleSubscriptionDeleted(subscription) {
  const subscriptionId = subscription.id;

  console.log(`[Webhook] Subscription cancelled: ${subscriptionId}`);

  db.prepare(`
    UPDATE subscriptions 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ?
  `).run(subscriptionId);
}

/**
 * Handle trial ending soon (3 days before)
 */
async function handleTrialWillEnd(subscription) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer;

  console.log(`[Webhook] Trial ending soon for subscription: ${subscriptionId}`);

  // Get user email
  const user = db.prepare(`
    SELECT u.email, u.name 
    FROM users u
    JOIN subscriptions s ON s.user_id = u.id
    WHERE s.stripe_subscription_id = ?
  `).get(subscriptionId);

  if (user) {
    // TODO: Send trial ending email notification
    console.log(`[Webhook] Should send trial ending email to: ${user.email}`);
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  const amountPaid = invoice.amount_paid;

  if (!subscriptionId) return;

  console.log(`[Webhook] Payment succeeded for subscription: ${subscriptionId}, amount: $${amountPaid / 100}`);

  // Update subscription status to active
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'active', updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ?
  `).run(subscriptionId);

  // Create payment record
  db.prepare(`
    INSERT INTO payments (
      subscription_id, stripe_invoice_id, amount, status, created_at
    ) 
    SELECT id, ?, ?, 'succeeded', CURRENT_TIMESTAMP
    FROM subscriptions 
    WHERE stripe_subscription_id = ?
  `).run(invoice.id, amountPaid, subscriptionId);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  const amountDue = invoice.amount_due;

  if (!subscriptionId) return;

  console.log(`[Webhook] Payment failed for subscription: ${subscriptionId}, amount: $${amountDue / 100}`);

  // Update subscription status
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'past_due', updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ?
  `).run(subscriptionId);

  // Get user email for notification
  const user = db.prepare(`
    SELECT u.email, u.name 
    FROM users u
    JOIN subscriptions s ON s.user_id = u.id
    WHERE s.stripe_subscription_id = ?
  `).get(subscriptionId);

  if (user) {
    // TODO: Send payment failed email notification
    console.log(`[Webhook] Should send payment failed email to: ${user.email}`);
  }
}

export default {
  handleStripeWebhook
};
