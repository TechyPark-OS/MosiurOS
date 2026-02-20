import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  funnelDb,
  pageDb,
  productDb,
  orderDb,
  emailCampaignDb,
  emailSubscriberDb,
  workflowDb,
  courseDb,
  contactDb,
  dealDb,
  subscriptionDb,
  analyticsDb,
  affiliateDb,
  apiKeyDb
} from './database-expanded.js';
import { userDb } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test data
let testUserId = 'test-user-' + Math.random();
const testFunnelId = 'test-funnel-123';

// Create test user before running tests
beforeAll(() => {
  // Create a valid test user
  const testUser = userDb.findOrCreate({
    email: 'test-' + Math.random() + '@example.com',
    name: 'Test User',
    provider: 'test'
  });
  testUserId = testUser.id;
});

describe('Backend API Database Operations', () => {
  // Helper to create a valid user for tests
  const createTestUser = () => {
    return userDb.findOrCreate({
      email: 'test-' + Math.random() + '@example.com',
      name: 'Test User',
      provider: 'test'
    });
  };
  // ==================== FUNNEL TESTS ====================
  describe('Funnel Operations', () => {
    it('should create a funnel', () => {
      const funnel = funnelDb.create(testUserId, {
        name: 'Test Funnel',
        description: 'A test funnel',
        type: 'sales',
        template: 'standard'
      });

      expect(funnel).toBeDefined();
      expect(funnel.id).toBeDefined();
      expect(funnel.user_id).toBe(testUserId);
      expect(funnel.name).toBe('Test Funnel');
    });

    it('should find a funnel by ID', () => {
      const created = funnelDb.create(testUserId, {
        name: 'Find Test Funnel',
        type: 'sales'
      });

      const found = funnelDb.findById(created.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.name).toBe('Find Test Funnel');
    });

    it('should find funnels by user ID', () => {
      const user = createTestUser();
      funnelDb.create(user.id, { name: 'Funnel 1', type: 'sales' });
      funnelDb.create(user.id, { name: 'Funnel 2', type: 'webinar' });

      const funnels = funnelDb.findByUserId(user.id);
      expect(funnels.length).toBeGreaterThanOrEqual(2);
    });

    it('should update a funnel', () => {
      const created = funnelDb.create(testUserId, {
        name: 'Original Name',
        type: 'sales'
      });

      const updated = funnelDb.update(created.id, {
        name: 'Updated Name',
        status: 'published'
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.status).toBe('published');
    });

    it('should delete a funnel', () => {
      const created = funnelDb.create(testUserId, {
        name: 'To Delete',
        type: 'sales'
      });

      funnelDb.delete(created.id);
      const found = funnelDb.findById(created.id);
      expect(found).toBeUndefined();
    });
  });

  // ==================== PAGE TESTS ====================
  describe('Page Operations', () => {
    it('should create a page', () => {
      const funnel = funnelDb.create(testUserId, {
        name: 'Test Funnel',
        type: 'sales'
      });

      const page = pageDb.create(funnel.id, testUserId, {
        name: 'Landing Page',
        slug: 'landing-page',
        type: 'landing'
      });

      expect(page).toBeDefined();
      expect(page.id).toBeDefined();
      expect(page.funnel_id).toBe(funnel.id);
      expect(page.name).toBe('Landing Page');
    });

    it('should find pages by funnel ID', () => {
      const user = createTestUser();
      const funnel = funnelDb.create(user.id, {
        name: 'Test Funnel',
        type: 'sales'
      });

      pageDb.create(funnel.id, user.id, { name: 'Page 1' });
      pageDb.create(funnel.id, user.id, { name: 'Page 2' });

      const pages = pageDb.findByFunnelId(funnel.id);
      expect(pages.length).toBeGreaterThanOrEqual(2);
    });

    it('should update a page', () => {
      const funnel = funnelDb.create(testUserId, {
        name: 'Test Funnel',
        type: 'sales'
      });

      const page = pageDb.create(funnel.id, testUserId, {
        name: 'Original',
        type: 'landing'
      });

      const updated = pageDb.update(page.id, {
        name: 'Updated',
        status: 'published'
      });

      expect(updated.name).toBe('Updated');
      expect(updated.status).toBe('published');
    });
  });

  // ==================== PRODUCT TESTS ====================
  describe('Product Operations', () => {
    it('should create a product', () => {
      const product = productDb.create(testUserId, {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        cost: 50,
        sku: 'TEST-001',
        category: 'digital'
      });

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(99.99);
    });

    it('should find products by user ID', () => {
      const user = createTestUser();
      productDb.create(user.id, { name: 'Product 1', price: 10 });
      productDb.create(user.id, { name: 'Product 2', price: 20 });

      const products = productDb.findByUserId(user.id);
      expect(products.length).toBeGreaterThanOrEqual(2);
    });

    it('should update a product', () => {
      const product = productDb.create(testUserId, {
        name: 'Original',
        price: 100,
        inventory: 10
      });

      const updated = productDb.update(product.id, {
        name: 'Updated',
        price: 150,
        inventory: 5
      });

      expect(updated.name).toBe('Updated');
      expect(updated.price).toBe(150);
      expect(updated.inventory).toBe(5);
    });
  });

  // ==================== ORDER TESTS ====================
  describe('Order Operations', () => {
    it('should create an order', () => {
      const order = orderDb.create(testUserId, {
        customer_email: 'customer@example.com',
        customer_name: 'John Doe',
        total_amount: 299.99,
        payment_method: 'credit_card'
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.customer_email).toBe('customer@example.com');
      expect(order.total_amount).toBe(299.99);
    });

    it('should find orders by user ID', () => {
      const user = createTestUser();
      orderDb.create(user.id, {
        customer_email: 'test1@example.com',
        total_amount: 100
      });
      orderDb.create(user.id, {
        customer_email: 'test2@example.com',
        total_amount: 200
      });

      const orders = orderDb.findByUserId(user.id);
      expect(orders.length).toBeGreaterThanOrEqual(2);
    });

    it('should update order status', () => {
      const order = orderDb.create(testUserId, {
        customer_email: 'test@example.com',
        total_amount: 100,
        status: 'pending'
      });

      const updated = orderDb.update(order.id, {
        status: 'completed',
        payment_status: 'paid'
      });

      expect(updated.status).toBe('completed');
      expect(updated.payment_status).toBe('paid');
    });
  });

  // ==================== EMAIL CAMPAIGN TESTS ====================
  describe('Email Campaign Operations', () => {
    it('should create an email campaign', () => {
      const campaign = emailCampaignDb.create(testUserId, {
        name: 'Test Campaign',
        subject: 'Welcome to TechyPark',
        content: '<h1>Welcome</h1>',
        status: 'draft'
      });

      expect(campaign).toBeDefined();
      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBe('Test Campaign');
      expect(campaign.status).toBe('draft');
    });

    it('should find campaigns by user ID', () => {
      const user = createTestUser();
      emailCampaignDb.create(user.id, {
        name: 'Campaign 1',
        subject: 'Subject 1'
      });
      emailCampaignDb.create(user.id, {
        name: 'Campaign 2',
        subject: 'Subject 2'
      });

      const campaigns = emailCampaignDb.findByUserId(user.id);
      expect(campaigns.length).toBeGreaterThanOrEqual(2);
    });

    it('should update campaign status', () => {
      const campaign = emailCampaignDb.create(testUserId, {
        name: 'Test',
        subject: 'Test',
        status: 'draft'
      });

      const updated = emailCampaignDb.update(campaign.id, {
        status: 'sent'
      });

      expect(updated.status).toBe('sent');
    });
  });

  // ==================== EMAIL SUBSCRIBER TESTS ====================
  describe('Email Subscriber Operations', () => {
    it('should create an email subscriber', () => {
      const subscriber = emailSubscriberDb.create(testUserId, {
        email: 'subscriber@example.com',
        name: 'John Subscriber',
        tags: ['vip', 'early-adopter']
      });

      expect(subscriber).toBeDefined();
      expect(subscriber.id).toBeDefined();
      expect(subscriber.email).toBe('subscriber@example.com');
    });

    it('should find subscriber by email', () => {
      const user = createTestUser();
      const email = 'unique-' + Math.random() + '@example.com';

      emailSubscriberDb.create(user.id, { email, name: 'Test' });
      const found = emailSubscriberDb.findByEmail(user.id, email);

      expect(found).toBeDefined();
      expect(found.email).toBe(email);
    });

    it('should find subscribers by user ID', () => {
      const user = createTestUser();
      emailSubscriberDb.create(user.id, { email: 'sub1@example.com' });
      emailSubscriberDb.create(user.id, { email: 'sub2@example.com' });

      const subscribers = emailSubscriberDb.findByUserId(user.id);
      expect(subscribers.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== WORKFLOW TESTS ====================
  describe('Workflow Operations', () => {
    it('should create a workflow', () => {
      const workflow = workflowDb.create(testUserId, {
        name: 'Welcome Sequence',
        description: 'Send welcome emails',
        trigger_type: 'new_subscriber',
        status: 'inactive'
      });

      expect(workflow).toBeDefined();
      expect(workflow.id).toBeDefined();
      expect(workflow.name).toBe('Welcome Sequence');
    });

    it('should find workflows by user ID', () => {
      const user = createTestUser();
      workflowDb.create(user.id, { name: 'Workflow 1', trigger_type: 'new_subscriber' });
      workflowDb.create(user.id, { name: 'Workflow 2', trigger_type: 'purchase' });

      const workflows = workflowDb.findByUserId(user.id);
      expect(workflows.length).toBeGreaterThanOrEqual(2);
    });

    it('should update workflow status', () => {
      const workflow = workflowDb.create(testUserId, {
        name: 'Test',
        trigger_type: 'new_subscriber',
        status: 'inactive'
      });

      const updated = workflowDb.update(workflow.id, {
        status: 'active'
      });

      expect(updated.status).toBe('active');
    });
  });

  // ==================== COURSE TESTS ====================
  describe('Course Operations', () => {
    it('should create a course', () => {
      const course = courseDb.create(testUserId, {
        name: 'Advanced Marketing',
        description: 'Learn advanced marketing strategies',
        price: 199.99,
        access_type: 'one_time',
        status: 'draft'
      });

      expect(course).toBeDefined();
      expect(course.id).toBeDefined();
      expect(course.name).toBe('Advanced Marketing');
      expect(course.price).toBe(199.99);
    });

    it('should find courses by user ID', () => {
      const user = createTestUser();
      courseDb.create(user.id, { name: 'Course 1', price: 100 });
      courseDb.create(user.id, { name: 'Course 2', price: 200 });

      const courses = courseDb.findByUserId(user.id);
      expect(courses.length).toBeGreaterThanOrEqual(2);
    });

    it('should update course status', () => {
      const course = courseDb.create(testUserId, {
        name: 'Test Course',
        price: 100,
        status: 'draft'
      });

      const updated = courseDb.update(course.id, {
        status: 'published'
      });

      expect(updated.status).toBe('published');
    });
  });

  // ==================== CONTACT TESTS ====================
  describe('Contact Operations', () => {
    it('should create a contact', () => {
      const contact = contactDb.create(testUserId, {
        email: 'contact@example.com',
        name: 'Jane Contact',
        phone: '+1234567890',
        company: 'Acme Corp',
        status: 'lead'
      });

      expect(contact).toBeDefined();
      expect(contact.id).toBeDefined();
      expect(contact.email).toBe('contact@example.com');
      expect(contact.status).toBe('lead');
    });

    it('should find contacts by user ID', () => {
      const user = createTestUser();
      contactDb.create(user.id, { email: 'contact1@example.com' });
      contactDb.create(user.id, { email: 'contact2@example.com' });

      const contacts = contactDb.findByUserId(user.id);
      expect(contacts.length).toBeGreaterThanOrEqual(2);
    });

    it('should update contact status', () => {
      const contact = contactDb.create(testUserId, {
        email: 'test@example.com',
        status: 'lead'
      });

      const updated = contactDb.update(contact.id, {
        status: 'customer'
      });

      expect(updated.status).toBe('customer');
    });
  });

  // ==================== DEAL TESTS ====================
  describe('Deal Operations', () => {
    it('should create a deal', () => {
      const contact = contactDb.create(testUserId, {
        email: 'contact@example.com'
      });

      const deal = dealDb.create(testUserId, contact.id, {
        name: 'Enterprise Deal',
        value: 50000,
        stage: 'negotiation',
        probability: 75
      });

      expect(deal).toBeDefined();
      expect(deal.id).toBeDefined();
      expect(deal.name).toBe('Enterprise Deal');
      expect(deal.value).toBe(50000);
    });

    it('should find deals by user ID', () => {
      const user = createTestUser();
      const contact = contactDb.create(user.id, { email: 'test@example.com' });

      dealDb.create(user.id, contact.id, { name: 'Deal 1', value: 1000 });
      dealDb.create(user.id, contact.id, { name: 'Deal 2', value: 2000 });

      const deals = dealDb.findByUserId(user.id);
      expect(deals.length).toBeGreaterThanOrEqual(2);
    });

    it('should update deal stage', () => {
      const contact = contactDb.create(testUserId, { email: 'test@example.com' });
      const deal = dealDb.create(testUserId, contact.id, {
        name: 'Test Deal',
        value: 5000,
        stage: 'lead'
      });

      const updated = dealDb.update(deal.id, {
        stage: 'closed_won',
        probability: 100
      });

      expect(updated.stage).toBe('closed_won');
      expect(updated.probability).toBe(100);
    });
  });

  // ==================== SUBSCRIPTION TESTS ====================
  describe('Subscription Operations', () => {
    it('should create a subscription', () => {
      const subscription = subscriptionDb.create(testUserId, {
        customer_email: 'customer@example.com',
        plan_id: 'plan-pro',
        amount: 99,
        billing_cycle: 'monthly',
        status: 'active'
      });

      expect(subscription).toBeDefined();
      expect(subscription.id).toBeDefined();
      expect(subscription.customer_email).toBe('customer@example.com');
      expect(subscription.status).toBe('active');
    });

    it('should find subscriptions by user ID', () => {
      const user = createTestUser();
      subscriptionDb.create(user.id, {
        customer_email: 'sub1@example.com',
        amount: 100
      });
      subscriptionDb.create(user.id, {
        customer_email: 'sub2@example.com',
        amount: 200
      });

      const subscriptions = subscriptionDb.findByUserId(user.id);
      expect(subscriptions.length).toBeGreaterThanOrEqual(2);
    });

    it('should update subscription status', () => {
      const subscription = subscriptionDb.create(testUserId, {
        customer_email: 'test@example.com',
        amount: 100,
        status: 'active'
      });

      const updated = subscriptionDb.update(subscription.id, {
        status: 'canceled'
      });

      expect(updated.status).toBe('canceled');
    });
  });

  // ==================== ANALYTICS TESTS ====================
  describe('Analytics Operations', () => {
    it('should record a page visit', () => {
      const funnel = funnelDb.create(testUserId, { name: 'Test', type: 'sales' });
      const page = pageDb.create(funnel.id, testUserId, { name: 'Test Page' });

      const visit = analyticsDb.recordPageVisit(page.id, {
        visitor_id: 'visitor-123',
        visitor_email: 'visitor@example.com',
        device_type: 'desktop',
        browser: 'Chrome'
      });

      expect(visit).toBeDefined();
      expect(visit.id).toBeDefined();
      expect(visit.page_id).toBe(page.id);
    });

    it('should record a conversion', () => {
      const funnel = funnelDb.create(testUserId, { name: 'Test', type: 'sales' });
      const page = pageDb.create(funnel.id, testUserId, { name: 'Test Page' });

      const conversion = analyticsDb.recordConversion(page.id, funnel.id, {
        visitor_id: 'visitor-123',
        visitor_email: 'visitor@example.com',
        conversion_type: 'purchase',
        value: 99.99
      });

      expect(conversion).toBeDefined();
      expect(conversion.id).toBeDefined();
      expect(conversion.conversion_type).toBe('purchase');
      expect(conversion.value).toBe(99.99);
    });
  });

  // ==================== AFFILIATE TESTS ====================
  describe('Affiliate Operations', () => {
    it('should create an affiliate', () => {
      const affiliate = affiliateDb.create(testUserId, {
        affiliate_email: 'affiliate@example.com',
        commission_rate: 0.15,
        status: 'active'
      });

      expect(affiliate).toBeDefined();
      expect(affiliate.id).toBeDefined();
      expect(affiliate.affiliate_email).toBe('affiliate@example.com');
      expect(affiliate.commission_rate).toBe(0.15);
    });

    it('should find affiliates by user ID', () => {
      const user = createTestUser();
      affiliateDb.create(user.id, { affiliate_email: 'aff1@example.com' });
      affiliateDb.create(user.id, { affiliate_email: 'aff2@example.com' });

      const affiliates = affiliateDb.findByUserId(user.id);
      expect(affiliates.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== API KEY TESTS ====================
  describe('API Key Operations', () => {
    it('should create an API key', () => {
      const apiKey = apiKeyDb.create(testUserId, 'My API Key');

      expect(apiKey).toBeDefined();
      expect(apiKey.id).toBeDefined();
      expect(apiKey.key).toBeDefined();
      expect(apiKey.name).toBe('My API Key');
    });

    it('should find API key by key value', () => {
      const apiKey = apiKeyDb.create(testUserId, 'Test Key');
      const found = apiKeyDb.findByKey(apiKey.key);

      expect(found).toBeDefined();
      expect(found.key).toBe(apiKey.key);
    });

    it('should find API keys by user ID', () => {
      const user = createTestUser();
      apiKeyDb.create(user.id, 'Key 1');
      apiKeyDb.create(user.id, 'Key 2');

      const keys = apiKeyDb.findByUserId(user.id);
      expect(keys.length).toBeGreaterThanOrEqual(2);
    });

    it('should delete an API key', () => {
      const apiKey = apiKeyDb.create(testUserId, 'To Delete');
      apiKeyDb.delete(apiKey.id);

      const found = apiKeyDb.findByKey(apiKey.key);
      expect(found).toBeUndefined();
    });
  });
});
