import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '..', 'data', 'techypark.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  -- Users table (existing)
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'User',
    provider TEXT DEFAULT 'email',
    provider_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    status TEXT DEFAULT 'active',
    notification_preferences TEXT DEFAULT '{"email_alerts":true,"email_reports":true,"email_marketing":false,"push_alerts":true,"push_updates":false}'
  );

  -- Sessions table (existing)
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Magic links table (existing)
  CREATE TABLE IF NOT EXISTS magic_links (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Invitations table (existing)
  CREATE TABLE IF NOT EXISTS invitations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'User',
    token TEXT UNIQUE NOT NULL,
    invited_by TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE
  );

  -- ==================== FUNNELS & PAGES ====================
  CREATE TABLE IF NOT EXISTS funnels (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'sales',
    status TEXT DEFAULT 'draft',
    template TEXT,
    settings TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    funnel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'landing',
    content TEXT,
    settings TEXT DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    FOREIGN KEY (funnel_id) REFERENCES funnels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS page_elements (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    settings TEXT DEFAULT '{}',
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    width REAL DEFAULT 100,
    height REAL DEFAULT 100,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
  );

  -- ==================== PRODUCTS & ECOMMERCE ====================
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    cost REAL DEFAULT 0,
    sku TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    category TEXT,
    inventory INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  -- ==================== EMAIL MARKETING ====================
  CREATE TABLE IF NOT EXISTS email_campaigns (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT,
    template_id TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at DATETIME,
    sent_at DATETIME,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email_subscribers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'subscribed',
    tags TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, email)
  );

  CREATE TABLE IF NOT EXISTS email_campaign_stats (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    subscriber_id TEXT NOT NULL,
    opened INTEGER DEFAULT 0,
    clicked INTEGER DEFAULT 0,
    opened_at DATETIME,
    clicked_at DATETIME,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (subscriber_id) REFERENCES email_subscribers(id) ON DELETE CASCADE
  );

  -- ==================== WORKFLOWS & AUTOMATION ====================
  CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT,
    trigger_settings TEXT DEFAULT '{}',
    status TEXT DEFAULT 'inactive',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS workflow_steps (
    id TEXT PRIMARY KEY,
    workflow_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_settings TEXT DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    delay_seconds INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
  );

  -- ==================== COURSES & MEMBERSHIPS ====================
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'draft',
    access_type TEXT DEFAULT 'one_time',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    progress_percent INTEGER DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    enrollment_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS memberships (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS membership_subscriptions (
    id TEXT PRIMARY KEY,
    membership_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    next_billing_date DATETIME,
    canceled_at DATETIME,
    FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE
  );

  -- ==================== CRM ====================
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'lead',
    tags TEXT DEFAULT '[]',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    contact_id TEXT NOT NULL,
    name TEXT NOT NULL,
    value REAL NOT NULL,
    stage TEXT DEFAULT 'lead',
    probability INTEGER DEFAULT 0,
    expected_close_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    contact_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
  );

  -- ==================== ANALYTICS ====================
  CREATE TABLE IF NOT EXISTS page_visits (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    visitor_id TEXT,
    visitor_email TEXT,
    referrer TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS conversions (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    funnel_id TEXT NOT NULL,
    visitor_id TEXT,
    visitor_email TEXT,
    conversion_type TEXT,
    value REAL DEFAULT 0,
    converted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (funnel_id) REFERENCES funnels(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS funnel_analytics (
    id TEXT PRIMARY KEY,
    funnel_id TEXT NOT NULL,
    date DATE NOT NULL,
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue REAL DEFAULT 0,
    FOREIGN KEY (funnel_id) REFERENCES funnels(id) ON DELETE CASCADE,
    UNIQUE(funnel_id, date)
  );

  -- ==================== PAYMENTS & SUBSCRIPTIONS ====================
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    plan_id TEXT,
    status TEXT DEFAULT 'active',
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT DEFAULT 'monthly',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    next_billing_date DATETIME,
    canceled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subscription_id TEXT,
    customer_email TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    due_date DATETIME,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
  );

  -- ==================== SURVEYS ====================
  CREATE TABLE IF NOT EXISTS surveys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS survey_questions (
    id TEXT PRIMARY KEY,
    survey_id TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT DEFAULT 'text',
    options TEXT DEFAULT '[]',
    required INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS survey_responses (
    id TEXT PRIMARY KEY,
    survey_id TEXT NOT NULL,
    respondent_email TEXT,
    response_data TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
  );

  -- ==================== COMMUNITY & FORUMS ====================
  CREATE TABLE IF NOT EXISTS forums (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS forum_topics (
    id TEXT PRIMARY KEY,
    forum_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- ==================== AFFILIATES ====================
  CREATE TABLE IF NOT EXISTS affiliates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    affiliate_email TEXT NOT NULL,
    commission_rate REAL DEFAULT 0.1,
    status TEXT DEFAULT 'active',
    total_commissions REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id TEXT PRIMARY KEY,
    affiliate_id TEXT NOT NULL,
    product_id TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS affiliate_sales (
    id TEXT PRIMARY KEY,
    affiliate_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    commission_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    paid_at DATETIME,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  -- ==================== API KEYS ====================
  CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    name TEXT,
    last_used DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
  CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
  CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
  CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
  CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON funnels(user_id);
  CREATE INDEX IF NOT EXISTS idx_pages_funnel_id ON pages(funnel_id);
  CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id);
  CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON email_campaigns(user_id);
  CREATE INDEX IF NOT EXISTS idx_email_subscribers_user_id ON email_subscribers(user_id);
  CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
  CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
  CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
  CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
  CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
  CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
  CREATE INDEX IF NOT EXISTS idx_conversions_funnel_id ON conversions(funnel_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
  CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
  CREATE INDEX IF NOT EXISTS idx_forums_user_id ON forums(user_id);
  CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
  CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
`);

// Helper functions
function generateId() {
  return crypto.randomUUID();
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ==================== FUNNEL OPERATIONS ====================
export const funnelDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO funnels (id, user_id, name, description, type, template, settings)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.name, data.description || '', data.type || 'sales', data.template || '', JSON.stringify(data.settings || {}));
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM funnels WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM funnels WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE funnels SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return funnelDb.findById(id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM funnels WHERE id = ?');
    return stmt.run(id);
  },

  count: (userId) => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM funnels WHERE user_id = ?');
    return stmt.get(userId).count;
  }
};

// ==================== PAGE OPERATIONS ====================
export const pageDb = {
  create: (funnelId, userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO pages (id, funnel_id, user_id, name, slug, type, content, settings, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    stmt.run(id, funnelId, userId, data.name, slug, data.type || 'landing', data.content || '', JSON.stringify(data.settings || {}), data.order_index || 0);
    return { id, funnel_id: funnelId, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM pages WHERE id = ?');
    return stmt.get(id);
  },

  findByFunnelId: (funnelId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM pages WHERE funnel_id = ? ORDER BY order_index ASC LIMIT ? OFFSET ?');
    return stmt.all(funnelId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'funnel_id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE pages SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return pageDb.findById(id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM pages WHERE id = ?');
    return stmt.run(id);
  }
};

// ==================== PRODUCT OPERATIONS ====================
export const productDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO products (id, user_id, name, description, price, cost, sku, image_url, category, inventory)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.name, data.description || '', data.price, data.cost || 0, data.sku || '', data.image_url || '', data.category || '', data.inventory || 0);
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return productDb.findById(id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
  }
};

// ==================== ORDER OPERATIONS ====================
export const orderDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO orders (id, user_id, customer_email, customer_name, total_amount, status, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.customer_email, data.customer_name || '', data.total_amount, data.status || 'pending', data.payment_method || '');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return orderDb.findById(id);
  }
};

// ==================== EMAIL CAMPAIGN OPERATIONS ====================
export const emailCampaignDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO email_campaigns (id, user_id, name, subject, content, template_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.name, data.subject, data.content || '', data.template_id || '', data.status || 'draft');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM email_campaigns WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM email_campaigns WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE email_campaigns SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return emailCampaignDb.findById(id);
  }
};

// ==================== EMAIL SUBSCRIBER OPERATIONS ====================
export const emailSubscriberDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO email_subscribers (id, user_id, email, name, status, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.email, data.name || '', data.status || 'subscribed', JSON.stringify(data.tags || []));
    return { id, user_id: userId, ...data };
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM email_subscribers WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  findByEmail: (userId, email) => {
    const stmt = db.prepare('SELECT * FROM email_subscribers WHERE user_id = ? AND email = ?');
    return stmt.get(userId, email);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE email_subscribers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return stmt.get(id);
  }
};

// ==================== WORKFLOW OPERATIONS ====================
export const workflowDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO workflows (id, user_id, name, description, trigger_type, trigger_settings, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.name, data.description || '', data.trigger_type || '', JSON.stringify(data.trigger_settings || {}), data.status || 'inactive');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM workflows WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM workflows WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE workflows SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return workflowDb.findById(id);
  }
};

// ==================== COURSE OPERATIONS ====================
export const courseDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO courses (id, user_id, name, description, price, image_url, status, access_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.name, data.description || '', data.price || 0, data.image_url || '', data.status || 'draft', data.access_type || 'one_time');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM courses WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE courses SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return courseDb.findById(id);
  }
};

// ==================== CONTACT OPERATIONS ====================
export const contactDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO contacts (id, user_id, email, name, phone, company, status, tags, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.email, data.name || '', data.phone || '', data.company || '', data.status || 'lead', JSON.stringify(data.tags || []), data.notes || '');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM contacts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE contacts SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return contactDb.findById(id);
  }
};

// ==================== DEAL OPERATIONS ====================
export const dealDb = {
  create: (userId, contactId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO deals (id, user_id, contact_id, name, value, stage, probability, expected_close_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, contactId, data.name, data.value, data.stage || 'lead', data.probability || 0, data.expected_close_date || null);
    return { id, user_id: userId, contact_id: contactId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM deals WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM deals WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id' && key !== 'contact_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE deals SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values);
    return dealDb.findById(id);
  }
};

// ==================== SUBSCRIPTION OPERATIONS ====================
export const subscriptionDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO subscriptions (id, user_id, customer_email, plan_id, status, amount, currency, billing_cycle, next_billing_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.customer_email, data.plan_id || '', data.status || 'active', data.amount, data.currency || 'USD', data.billing_cycle || 'monthly', data.next_billing_date || null);
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  },

  update: (id, data) => {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && key !== 'user_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return subscriptionDb.findById(id);
  }
};

// ==================== ANALYTICS OPERATIONS ====================
export const analyticsDb = {
  recordPageVisit: (pageId, visitorData) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO page_visits (id, page_id, visitor_id, visitor_email, referrer, device_type, browser, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, pageId, visitorData.visitor_id || '', visitorData.visitor_email || '', visitorData.referrer || '', visitorData.device_type || '', visitorData.browser || '', visitorData.country || '');
    return { id, page_id: pageId, ...visitorData };
  },

  recordConversion: (pageId, funnelId, visitorData) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO conversions (id, page_id, funnel_id, visitor_id, visitor_email, conversion_type, value)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, pageId, funnelId, visitorData.visitor_id || '', visitorData.visitor_email || '', visitorData.conversion_type || 'purchase', visitorData.value || 0);
    return { id, page_id: pageId, funnel_id: funnelId, ...visitorData };
  },

  getFunnelStats: (funnelId, days = 30) => {
    const stmt = db.prepare(`
      SELECT 
        SUM(visitors) as total_visitors,
        SUM(conversions) as total_conversions,
        SUM(revenue) as total_revenue,
        AVG(CASE WHEN visitors > 0 THEN (conversions * 100.0 / visitors) ELSE 0 END) as avg_conversion_rate
      FROM funnel_analytics
      WHERE funnel_id = ? AND date >= date('now', '-' || ? || ' days')
    `);
    return stmt.get(funnelId, days);
  }
};

// ==================== AFFILIATE OPERATIONS ====================
export const affiliateDb = {
  create: (userId, data) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO affiliates (id, user_id, affiliate_email, commission_rate, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, data.affiliate_email, data.commission_rate || 0.1, data.status || 'active');
    return { id, user_id: userId, ...data };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM affiliates WHERE id = ?');
    return stmt.get(id);
  },

  findByUserId: (userId, limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM affiliates WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(userId, limit, offset);
  }
};

// ==================== API KEY OPERATIONS ====================
export const apiKeyDb = {
  create: (userId, name) => {
    const id = generateId();
    const key = generateToken();
    const stmt = db.prepare(`
      INSERT INTO api_keys (id, user_id, key, name)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, userId, key, name || 'API Key');
    return { id, user_id: userId, key, name };
  },

  findByKey: (key) => {
    const stmt = db.prepare('SELECT * FROM api_keys WHERE key = ?');
    return stmt.get(key);
  },

  findByUserId: (userId) => {
    const stmt = db.prepare('SELECT id, user_id, name, created_at, last_used FROM api_keys WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM api_keys WHERE id = ?');
    return stmt.run(id);
  }
};

export default db;
