import express from 'express';
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
import { sessionDb } from './database.js';

const router = express.Router();

// ==================== MIDDLEWARE ====================

// Auth middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessionDb.findByToken(token);

  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = {
    id: session.user_id,
    email: session.email,
    name: session.name,
    role: session.role
  };

  next();
};

// ==================== FUNNELS API ====================

// Create funnel
router.post('/funnels', requireAuth, (req, res) => {
  try {
    const { name, description, type, template, settings } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Funnel name is required' });
    }

    const funnel = funnelDb.create(req.user.id, {
      name,
      description,
      type,
      template,
      settings
    });

    res.status(201).json({ success: true, funnel });
  } catch (error) {
    console.error('Error creating funnel:', error);
    res.status(500).json({ error: 'Failed to create funnel' });
  }
});

// Get user funnels
router.get('/funnels', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const funnels = funnelDb.findByUserId(req.user.id, limit, offset);
    const total = funnelDb.count(req.user.id);

    res.json({ funnels, total, limit, offset });
  } catch (error) {
    console.error('Error fetching funnels:', error);
    res.status(500).json({ error: 'Failed to fetch funnels' });
  }
});

// Get single funnel
router.get('/funnels/:id', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.id);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    res.json({ funnel });
  } catch (error) {
    console.error('Error fetching funnel:', error);
    res.status(500).json({ error: 'Failed to fetch funnel' });
  }
});

// Update funnel
router.patch('/funnels/:id', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.id);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    const updated = funnelDb.update(req.params.id, req.body);
    res.json({ success: true, funnel: updated });
  } catch (error) {
    console.error('Error updating funnel:', error);
    res.status(500).json({ error: 'Failed to update funnel' });
  }
});

// Delete funnel
router.delete('/funnels/:id', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.id);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    funnelDb.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    res.status(500).json({ error: 'Failed to delete funnel' });
  }
});

// ==================== PAGES API ====================

// Create page
router.post('/funnels/:funnelId/pages', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.funnelId);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    const { name, slug, type, content, settings } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Page name is required' });
    }

    const page = pageDb.create(req.params.funnelId, req.user.id, {
      name,
      slug,
      type,
      content,
      settings
    });

    res.status(201).json({ success: true, page });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Get funnel pages
router.get('/funnels/:funnelId/pages', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.funnelId);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    const pages = pageDb.findByFunnelId(req.params.funnelId);
    res.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Update page
router.patch('/pages/:id', requireAuth, (req, res) => {
  try {
    const page = pageDb.findById(req.params.id);

    if (!page || page.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const updated = pageDb.update(req.params.id, req.body);
    res.json({ success: true, page: updated });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// ==================== PRODUCTS API ====================

// Create product
router.post('/products', requireAuth, (req, res) => {
  try {
    const { name, description, price, cost, sku, image_url, category, inventory } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const product = productDb.create(req.user.id, {
      name,
      description,
      price,
      cost,
      sku,
      image_url,
      category,
      inventory
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get user products
router.get('/products', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const products = productDb.findByUserId(req.user.id, limit, offset);
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/products/:id', requireAuth, (req, res) => {
  try {
    const product = productDb.findById(req.params.id);

    if (!product || product.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product
router.patch('/products/:id', requireAuth, (req, res) => {
  try {
    const product = productDb.findById(req.params.id);

    if (!product || product.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated = productDb.update(req.params.id, req.body);
    res.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', requireAuth, (req, res) => {
  try {
    const product = productDb.findById(req.params.id);

    if (!product || product.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Product not found' });
    }

    productDb.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==================== ORDERS API ====================

// Create order
router.post('/orders', requireAuth, (req, res) => {
  try {
    const { customer_email, customer_name, total_amount, items } = req.body;

    if (!customer_email || !total_amount) {
      return res.status(400).json({ error: 'Customer email and total amount are required' });
    }

    const order = orderDb.create(req.user.id, {
      customer_email,
      customer_name,
      total_amount,
      status: 'pending'
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/orders', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const orders = orderDb.findByUserId(req.user.id, limit, offset);
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order
router.patch('/orders/:id', requireAuth, (req, res) => {
  try {
    const order = orderDb.findById(req.params.id);

    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updated = orderDb.update(req.params.id, req.body);
    res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ==================== EMAIL CAMPAIGNS API ====================

// Create email campaign
router.post('/email-campaigns', requireAuth, (req, res) => {
  try {
    const { name, subject, content, template_id } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ error: 'Campaign name and subject are required' });
    }

    const campaign = emailCampaignDb.create(req.user.id, {
      name,
      subject,
      content,
      template_id,
      status: 'draft'
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Get user campaigns
router.get('/email-campaigns', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const campaigns = emailCampaignDb.findByUserId(req.user.id, limit, offset);
    res.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Update campaign
router.patch('/email-campaigns/:id', requireAuth, (req, res) => {
  try {
    const campaign = emailCampaignDb.findById(req.params.id);

    if (!campaign || campaign.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const updated = emailCampaignDb.update(req.params.id, req.body);
    res.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// ==================== EMAIL SUBSCRIBERS API ====================

// Add subscriber
router.post('/email-subscribers', requireAuth, (req, res) => {
  try {
    const { email, name, tags } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if already exists
    const existing = emailSubscriberDb.findByEmail(req.user.id, email);
    if (existing) {
      return res.status(400).json({ error: 'Subscriber already exists' });
    }

    const subscriber = emailSubscriberDb.create(req.user.id, {
      email,
      name,
      tags,
      status: 'subscribed'
    });

    res.status(201).json({ success: true, subscriber });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ error: 'Failed to add subscriber' });
  }
});

// Get subscribers
router.get('/email-subscribers', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const subscribers = emailSubscriberDb.findByUserId(req.user.id, limit, offset);
    res.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// ==================== WORKFLOWS API ====================

// Create workflow
router.post('/workflows', requireAuth, (req, res) => {
  try {
    const { name, description, trigger_type, trigger_settings } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Workflow name is required' });
    }

    const workflow = workflowDb.create(req.user.id, {
      name,
      description,
      trigger_type,
      trigger_settings,
      status: 'inactive'
    });

    res.status(201).json({ success: true, workflow });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Get workflows
router.get('/workflows', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const workflows = workflowDb.findByUserId(req.user.id, limit, offset);
    res.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Update workflow
router.patch('/workflows/:id', requireAuth, (req, res) => {
  try {
    const workflow = workflowDb.findById(req.params.id);

    if (!workflow || workflow.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const updated = workflowDb.update(req.params.id, req.body);
    res.json({ success: true, workflow: updated });
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// ==================== COURSES API ====================

// Create course
router.post('/courses', requireAuth, (req, res) => {
  try {
    const { name, description, price, image_url, access_type } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const course = courseDb.create(req.user.id, {
      name,
      description,
      price,
      image_url,
      access_type,
      status: 'draft'
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get courses
router.get('/courses', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const courses = courseDb.findByUserId(req.user.id, limit, offset);
    res.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Update course
router.patch('/courses/:id', requireAuth, (req, res) => {
  try {
    const course = courseDb.findById(req.params.id);

    if (!course || course.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updated = courseDb.update(req.params.id, req.body);
    res.json({ success: true, course: updated });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// ==================== CONTACTS API ====================

// Create contact
router.post('/contacts', requireAuth, (req, res) => {
  try {
    const { email, name, phone, company, status, tags, notes } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const contact = contactDb.create(req.user.id, {
      email,
      name,
      phone,
      company,
      status,
      tags,
      notes
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Get contacts
router.get('/contacts', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const contacts = contactDb.findByUserId(req.user.id, limit, offset);
    res.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update contact
router.patch('/contacts/:id', requireAuth, (req, res) => {
  try {
    const contact = contactDb.findById(req.params.id);

    if (!contact || contact.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const updated = contactDb.update(req.params.id, req.body);
    res.json({ success: true, contact: updated });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// ==================== DEALS API ====================

// Create deal
router.post('/deals', requireAuth, (req, res) => {
  try {
    const { contact_id, name, value, stage, probability, expected_close_date } = req.body;

    if (!contact_id || !name || !value) {
      return res.status(400).json({ error: 'Contact ID, name, and value are required' });
    }

    const deal = dealDb.create(req.user.id, contact_id, {
      name,
      value,
      stage,
      probability,
      expected_close_date
    });

    res.status(201).json({ success: true, deal });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Get deals
router.get('/deals', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const deals = dealDb.findByUserId(req.user.id, limit, offset);
    res.json({ deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Update deal
router.patch('/deals/:id', requireAuth, (req, res) => {
  try {
    const deal = dealDb.findById(req.params.id);

    if (!deal || deal.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const updated = dealDb.update(req.params.id, req.body);
    res.json({ success: true, deal: updated });
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// ==================== SUBSCRIPTIONS API ====================

// Create subscription
router.post('/subscriptions', requireAuth, (req, res) => {
  try {
    const { customer_email, plan_id, amount, billing_cycle } = req.body;

    if (!customer_email || !amount) {
      return res.status(400).json({ error: 'Customer email and amount are required' });
    }

    const subscription = subscriptionDb.create(req.user.id, {
      customer_email,
      plan_id,
      amount,
      billing_cycle,
      status: 'active'
    });

    res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get subscriptions
router.get('/subscriptions', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const subscriptions = subscriptionDb.findByUserId(req.user.id, limit, offset);
    res.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Update subscription
router.patch('/subscriptions/:id', requireAuth, (req, res) => {
  try {
    const subscription = subscriptionDb.findById(req.params.id);

    if (!subscription || subscription.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updated = subscriptionDb.update(req.params.id, req.body);
    res.json({ success: true, subscription: updated });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// ==================== ANALYTICS API ====================

// Record page visit
router.post('/analytics/visits', (req, res) => {
  try {
    const { page_id, visitor_id, visitor_email, referrer, device_type, browser, country } = req.body;

    if (!page_id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    const visit = analyticsDb.recordPageVisit(page_id, {
      visitor_id,
      visitor_email,
      referrer,
      device_type,
      browser,
      country
    });

    res.status(201).json({ success: true, visit });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Record conversion
router.post('/analytics/conversions', (req, res) => {
  try {
    const { page_id, funnel_id, visitor_id, visitor_email, conversion_type, value } = req.body;

    if (!page_id || !funnel_id) {
      return res.status(400).json({ error: 'Page ID and Funnel ID are required' });
    }

    const conversion = analyticsDb.recordConversion(page_id, funnel_id, {
      visitor_id,
      visitor_email,
      conversion_type,
      value
    });

    res.status(201).json({ success: true, conversion });
  } catch (error) {
    console.error('Error recording conversion:', error);
    res.status(500).json({ error: 'Failed to record conversion' });
  }
});

// Get funnel stats
router.get('/analytics/funnels/:id/stats', requireAuth, (req, res) => {
  try {
    const funnel = funnelDb.findById(req.params.id);

    if (!funnel || funnel.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Funnel not found' });
    }

    const days = parseInt(req.query.days) || 30;
    const stats = analyticsDb.getFunnelStats(req.params.id, days);

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== AFFILIATES API ====================

// Create affiliate
router.post('/affiliates', requireAuth, (req, res) => {
  try {
    const { affiliate_email, commission_rate } = req.body;

    if (!affiliate_email) {
      return res.status(400).json({ error: 'Affiliate email is required' });
    }

    const affiliate = affiliateDb.create(req.user.id, {
      affiliate_email,
      commission_rate,
      status: 'active'
    });

    res.status(201).json({ success: true, affiliate });
  } catch (error) {
    console.error('Error creating affiliate:', error);
    res.status(500).json({ error: 'Failed to create affiliate' });
  }
});

// Get affiliates
router.get('/affiliates', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const affiliates = affiliateDb.findByUserId(req.user.id, limit, offset);
    res.json({ affiliates });
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    res.status(500).json({ error: 'Failed to fetch affiliates' });
  }
});

// ==================== API KEYS API ====================

// Create API key
router.post('/api-keys', requireAuth, (req, res) => {
  try {
    const { name } = req.body;

    const apiKey = apiKeyDb.create(req.user.id, name);

    res.status(201).json({ success: true, apiKey });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// Get API keys
router.get('/api-keys', requireAuth, (req, res) => {
  try {
    const apiKeys = apiKeyDb.findByUserId(req.user.id);
    res.json({ apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Delete API key
router.delete('/api-keys/:id', requireAuth, (req, res) => {
  try {
    apiKeyDb.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

export default router;
