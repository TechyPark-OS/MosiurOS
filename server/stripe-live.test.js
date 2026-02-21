import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';

describe('Stripe Live API Key Validation', () => {
  it('should validate Stripe live API key', async () => {
    const stripeKey = process.env.STRIPE_LIVE_KEY;
    
    expect(stripeKey).toBeTruthy();
    expect(stripeKey).toMatch(/^sk_live_/);
    
    const stripe = new Stripe(stripeKey);
    
    // Test API key by retrieving account info
    const account = await stripe.account.retrieve();
    
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.charges_enabled).toBeDefined();
  }, 10000); // 10 second timeout for API call
});
