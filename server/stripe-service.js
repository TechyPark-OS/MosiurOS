import Stripe from 'stripe';

// Initialize Stripe with live key
const stripe = new Stripe(process.env.STRIPE_LIVE_KEY);

// Pricing tiers configuration
const PRICING_TIERS = {
  starter: {
    name: 'Starter',
    price: 9700, // $97.00 in cents
    interval: 'month',
    features: [
      'Up to 3 funnels',
      '10,000 contacts',
      'Email marketing',
      'Basic analytics',
      'Community support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 99700, // $997.00 in cents
    interval: 'month',
    features: [
      'Unlimited funnels',
      'Unlimited contacts',
      'Advanced email automation',
      'A/B testing',
      'Priority support',
      'Custom integrations',
      'Advanced analytics'
    ]
  },
  premium: {
    name: 'Premium Pro - Done For You',
    price: 499700, // $4997.00 in cents
    interval: 'month',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Done-for-you funnel setup',
      'Custom development',
      'White-glove onboarding',
      '24/7 priority support',
      'Strategic consulting'
    ]
  }
};

/**
 * Create or retrieve Stripe products and prices
 */
async function initializeProducts() {
  const products = {};
  
  for (const [tier, config] of Object.entries(PRICING_TIERS)) {
    try {
      // Search for existing product
      const existingProducts = await stripe.products.search({
        query: `name:'TechyPark ${config.name}'`,
      });
      
      let product;
      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
      } else {
        // Create new product
        product = await stripe.products.create({
          name: `TechyPark ${config.name}`,
          description: `${config.name} plan - ${config.features.join(', ')}`,
          metadata: { tier }
        });
      }
      
      // Get or create price
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });
      
      let price;
      if (prices.data.length > 0) {
        price = prices.data[0];
      } else {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: config.price,
          currency: 'usd',
          recurring: { interval: config.interval },
          metadata: { tier }
        });
      }
      
      products[tier] = {
        productId: product.id,
        priceId: price.id,
        ...config
      };
    } catch (error) {
      console.error(`Error initializing product ${tier}:`, error.message);
    }
  }
  
  return products;
}

/**
 * Create a checkout session for subscription
 */
async function createCheckoutSession(userId, tier, email) {
  const products = await initializeProducts();
  const tierConfig = products[tier];
  
  if (!tierConfig) {
    throw new Error(`Invalid tier: ${tier}`);
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
    success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
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
  const products = await initializeProducts();
  const tierConfig = products[newTier];
  
  if (!tierConfig) {
    throw new Error(`Invalid tier: ${newTier}`);
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
