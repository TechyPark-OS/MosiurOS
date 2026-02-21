import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_LIVE_KEY);

async function setupProducts() {
  console.log('Setting up Stripe products and prices...\n');

  const products = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with funnels and email marketing',
      price: 9700, // $97.00 in cents
      features: [
        '3 Funnels',
        '10 Landing Pages',
        '1,000 Contacts',
        'Email Marketing',
        'Basic Analytics',
        'Community Support'
      ]
    },
    {
      name: 'Professional',
      description: 'For growing businesses that need advanced automation and unlimited funnels',
      price: 99700, // $997.00 in cents
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
    {
      name: 'Premium Pro',
      description: 'Done-for-you managed service with dedicated account manager',
      price: 499700, // $4,997.00 in cents
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
  ];

  const createdProducts = [];

  for (const productData of products) {
    try {
      // Create product
      const product = await stripe.products.create({
        name: `TechyPark ${productData.name}`,
        description: productData.description,
        metadata: {
          tier: productData.name.toLowerCase().replace(' ', '_'),
          features: JSON.stringify(productData.features)
        }
      });

      console.log(`✓ Created product: ${product.name} (${product.id})`);

      // Create price with 14-day trial
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
          trial_period_days: 14
        },
        metadata: {
          tier: productData.name.toLowerCase().replace(' ', '_')
        }
      });

      console.log(`✓ Created price: $${(productData.price / 100).toFixed(2)}/month (${price.id})`);
      console.log(`  Trial: 14 days\n`);

      createdProducts.push({
        tier: productData.name,
        productId: product.id,
        priceId: price.id,
        amount: productData.price,
        features: productData.features
      });
    } catch (error) {
      console.error(`✗ Error creating ${productData.name}:`, error.message);
    }
  }

  console.log('\n=== Setup Complete ===\n');
  console.log('Add these Price IDs to your environment variables:\n');
  
  createdProducts.forEach(p => {
    const envName = `STRIPE_PRICE_${p.tier.toUpperCase().replace(' ', '_')}`;
    console.log(`${envName}=${p.priceId}`);
  });

  console.log('\n=== Product Summary ===\n');
  console.log(JSON.stringify(createdProducts, null, 2));

  return createdProducts;
}

// Run setup
setupProducts()
  .then(() => {
    console.log('\n✓ All products created successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Setup failed:', error);
    process.exit(1);
  });
