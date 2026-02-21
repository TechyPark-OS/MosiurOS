import Stripe from 'stripe';

// Initialize Stripe with live key
const stripe = new Stripe(process.env.STRIPE_LIVE_KEY);

// Pricing tiers configuration with Stripe price IDs
const PRICING_TIERS = {
  starter: {
    name: 'Starter',
    price: 9700, // $97.00 in cents
    priceId: process.env.STRIPE_PRICE_STARTER,
    interval: 'month',
    features: [
      '3 Funnels',
      '10 Landing Pages',
      '1,000 Contacts',
      'Email Marketing',
      'Basic Analytics',
      'Community Support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 99700, // $997.00 in cents
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL,
    interval: 'month',
    features: [
      'Unlimited Funnels',
      'Unlimited Landing Pages',
      '25,000 Contacts',
      'Advanced Email Automation',
      'A/B Testing',
      'CRM & Pipeline',
      'Courses & Memberships',
      'Priority Support',
      'Custom Integrations'
    ]
  },
  premium_pro: {
    name: 'Premium Pro',
    price: 499700, // $4,997.00 in cents
    priceId: process.env.STRIPE_PRICE_PREMIUM_PRO,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited Contacts',
      'Dedicated Account Manager',
      'Done-For-You Funnel Setup',
      'Custom Development',
      'White-Label Options',
      'Advanced API Access',
      '24/7 Premium Support',
      'Monthly Strategy Calls'
    ]
  }
};

/**
 * Get pricing tiers (products already created in Stripe)
 */
async function initializeProducts() {
  // Products and prices are already created, just return the config
  return PRICING_TIERS;
}

/**
 * Create a checkout session for subscription with 14-day trial
 */
async function createCheckoutSession(userId, tier, email) {
  const tierConfig = PRICING_TIERS[tier];
  
  if (!tierConfig || !tierConfig.priceId) {
    throw new Error(`Invalid tier or missing price ID: ${tier}`);
  }
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: tierConfig.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId,
        tier
      }
    },
    metadata: {
      userId,
      tier
    }
  });
  
  return session;
}

/**
 * Create a customer portal session
 */
async function createPortalSession(customerId) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/settings/billing`,
  });
  
  return session;
}

/**
 * Get subscription details
 */
async function getSubscription(subscriptionId) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel subscription
 */
async function cancelSubscription(subscriptionId) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Update subscription (upgrade/downgrade)
 */
async function updateSubscription(subscriptionId, newTier) {
  const tierConfig = PRICING_TIERS[newTier];
  
  if (!tierConfig || !tierConfig.priceId) {
    throw new Error(`Invalid tier or missing price ID: ${newTier}`);
  }
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: tierConfig.priceId,
    }],
    proration_behavior: 'always_invoice',
    metadata: {
      ...subscription.metadata,
      tier: newTier
    }
  });
}

/**
 * Get customer by email
 */
async function getCustomerByEmail(email) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });
  
  return customers.data[0] || null;
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(payload, signature, secret) {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Get pricing tiers configuration
 */
function getPricingTiers() {
  return PRICING_TIERS;
}

export default {
  stripe,
  initializeProducts,
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  getCustomerByEmail,
  verifyWebhookSignature,
  getPricingTiers,
  PRICING_TIERS
};

export {
  stripe,
  initializeProducts,
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  getCustomerByEmail,
  verifyWebhookSignature,
  getPricingTiers,
  PRICING_TIERS
};
