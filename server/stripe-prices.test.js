import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';

describe('Stripe Price IDs Validation', () => {
  const stripe = new Stripe(process.env.STRIPE_LIVE_KEY);

  it('should validate all price IDs are set', () => {
    expect(process.env.STRIPE_PRICE_STARTER).toBeTruthy();
    expect(process.env.STRIPE_PRICE_PROFESSIONAL).toBeTruthy();
    expect(process.env.STRIPE_PRICE_PREMIUM_PRO).toBeTruthy();
  });

  it('should retrieve Starter price from Stripe', async () => {
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_STARTER);
    expect(price.id).toBe(process.env.STRIPE_PRICE_STARTER);
    expect(price.unit_amount).toBe(9700); // $97.00
    expect(price.recurring.interval).toBe('month');
    expect(price.recurring.trial_period_days).toBe(14);
  }, 10000);

  it('should retrieve Professional price from Stripe', async () => {
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_PROFESSIONAL);
    expect(price.id).toBe(process.env.STRIPE_PRICE_PROFESSIONAL);
    expect(price.unit_amount).toBe(99700); // $997.00
    expect(price.recurring.interval).toBe('month');
    expect(price.recurring.trial_period_days).toBe(14);
  }, 10000);

  it('should retrieve Premium Pro price from Stripe', async () => {
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_PREMIUM_PRO);
    expect(price.id).toBe(process.env.STRIPE_PRICE_PREMIUM_PRO);
    expect(price.unit_amount).toBe(499700); // $4,997.00
    expect(price.recurring.interval).toBe('month');
    expect(price.recurring.trial_period_days).toBe(14);
  }, 10000);
});
