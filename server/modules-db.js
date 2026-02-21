import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'techypark.db'));

// Available modules in the platform
const AVAILABLE_MODULES = [
  { id: 'dashboard', name: 'Dashboard', description: 'Overview and analytics', icon: 'LayoutDashboard', category: 'core' },
  { id: 'funnels', name: 'Funnels', description: 'Sales funnel builder', icon: 'GitBranch', category: 'marketing' },
  { id: 'pages', name: 'Landing Pages', description: 'Page builder and templates', icon: 'FileText', category: 'marketing' },
  { id: 'email', name: 'Email Marketing', description: 'Campaigns and automation', icon: 'Mail', category: 'marketing' },
  { id: 'workflows', name: 'Workflows', description: 'Marketing automation', icon: 'Workflow', category: 'marketing' },
  { id: 'products', name: 'Products', description: 'Product catalog', icon: 'Package', category: 'ecommerce' },
  { id: 'orders', name: 'Orders', description: 'Order management', icon: 'ShoppingCart', category: 'ecommerce' },
  { id: 'checkout', name: 'Smart Checkout', description: 'Checkout pages', icon: 'CreditCard', category: 'ecommerce' },
  { id: 'courses', name: 'Courses', description: 'Online courses', icon: 'GraduationCap', category: 'education' },
  { id: 'memberships', name: 'Memberships', description: 'Membership sites', icon: 'Users', category: 'education' },
  { id: 'contacts', name: 'Contacts', description: 'Contact management', icon: 'UserCircle', category: 'crm' },
  { id: 'deals', name: 'Opportunities', description: 'Sales pipeline', icon: 'Target', category: 'crm' },
  { id: 'tickets', name: 'Support Tickets', description: 'Customer support', icon: 'MessageSquare', category: 'crm' },
  { id: 'appointments', name: 'Appointments', description: 'Booking and scheduling', icon: 'Calendar', category: 'crm' },
  { id: 'analytics', name: 'Analytics', description: 'Reports and insights', icon: 'BarChart3', category: 'analytics' },
  { id: 'surveys', name: 'Surveys', description: 'Survey builder', icon: 'ClipboardList', category: 'marketing' },
  { id: 'blog', name: 'Blog', description: 'Content management', icon: 'BookOpen', category: 'content' },
  { id: 'community', name: 'Community', description: 'Forums and discussions', icon: 'MessageCircle', category: 'content' },
  { id: 'affiliates', name: 'Affiliates', description: 'Affiliate program', icon: 'Users2', category: 'growth' },
  { id: 'links', name: 'Short Links', description: 'URL shortener', icon: 'Link', category: 'tools' },
  { id: 'abtesting', name: 'A/B Testing', description: 'Split testing', icon: 'TestTube', category: 'optimization' },
  { id: 'countdown', name: 'Countdown Funnels', description: 'Urgency timers', icon: 'Clock', category: 'marketing' },
];

// Default module sets by subscription tier
const TIER_MODULES = {
  starter: ['dashboard', 'funnels', 'pages', 'email', 'contacts', 'analytics'],
  professional: ['dashboard', 'funnels', 'pages', 'email', 'workflows', 'products', 'orders', 'checkout', 'courses', 'memberships', 'contacts', 'deals', 'appointments', 'analytics', 'surveys', 'blog', 'affiliates', 'links', 'abtesting'],
  premium: AVAILABLE_MODULES.map(m => m.id) // All modules
};

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS user_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    enabled BOOLEAN DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
  );

  CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_user_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS impersonation_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id TEXT NOT NULL,
    target_user_id TEXT NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    ended_at TEXT,
    FOREIGN KEY (admin_id) REFERENCES users(id),
    FOREIGN KEY (target_user_id) REFERENCES users(id)
  );
`);

// Module Management
export const moduleDb = {
  // Get all available modules
  getAvailableModules() {
    return AVAILABLE_MODULES;
  },

  // Get modules for a user
  getUserModules(userId) {
    const modules = db.prepare(`
      SELECT module_id, enabled 
      FROM user_modules 
      WHERE user_id = ?
    `).all(userId);

    const moduleMap = {};
    modules.forEach(m => {
      moduleMap[m.module_id] = m.enabled === 1;
    });

    return AVAILABLE_MODULES.map(m => ({
      ...m,
      enabled: moduleMap[m.id] !== undefined ? moduleMap[m.id] : false
    }));
  },

  // Initialize default modules for a user based on tier
  initializeUserModules(userId, tier = 'starter') {
    const modules = TIER_MODULES[tier] || TIER_MODULES.starter;
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_modules (user_id, module_id, enabled)
      VALUES (?, ?, 1)
    `);

    modules.forEach(moduleId => {
      stmt.run(userId, moduleId);
    });
  },

  // Enable a module for a user
  enableModule(userId, moduleId) {
    db.prepare(`
      INSERT INTO user_modules (user_id, module_id, enabled)
      VALUES (?, ?, 1)
      ON CONFLICT(user_id, module_id) 
      DO UPDATE SET enabled = 1, updated_at = CURRENT_TIMESTAMP
    `).run(userId, moduleId);
  },

  // Disable a module for a user
  disableModule(userId, moduleId) {
    db.prepare(`
      UPDATE user_modules 
      SET enabled = 0, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND module_id = ?
    `).run(userId, moduleId);
  },

  // Toggle module status
  toggleModule(userId, moduleId) {
    const current = db.prepare(`
      SELECT enabled FROM user_modules 
      WHERE user_id = ? AND module_id = ?
    `).get(userId, moduleId);

    if (current) {
      this.disableModule(userId, moduleId);
      return false;
    } else {
      this.enableModule(userId, moduleId);
      return true;
    }
  },

  // Set multiple modules at once
  setUserModules(userId, moduleIds) {
    // Disable all first
    db.prepare(`
      UPDATE user_modules 
      SET enabled = 0, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(userId);

    // Enable specified modules
    const stmt = db.prepare(`
      INSERT INTO user_modules (user_id, module_id, enabled)
      VALUES (?, ?, 1)
      ON CONFLICT(user_id, module_id) 
      DO UPDATE SET enabled = 1, updated_at = CURRENT_TIMESTAMP
    `);

    moduleIds.forEach(moduleId => {
      stmt.run(userId, moduleId);
    });
  },

  // Check if user has access to a module
  hasAccess(userId, moduleId) {
    const result = db.prepare(`
      SELECT enabled FROM user_modules 
      WHERE user_id = ? AND module_id = ?
    `).get(userId, moduleId);

    return result ? result.enabled === 1 : false;
  }
};

// Admin Activity Logging
export const adminLogDb = {
  log(adminId, action, targetUserId = null, details = null, ipAddress = null) {
    db.prepare(`
      INSERT INTO admin_activity_logs (admin_id, action, target_user_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).run(adminId, action, targetUserId, JSON.stringify(details), ipAddress);
  },

  getLogs(limit = 100, offset = 0) {
    return db.prepare(`
      SELECT * FROM admin_activity_logs 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
  },

  getLogsByAdmin(adminId, limit = 100) {
    return db.prepare(`
      SELECT * FROM admin_activity_logs 
      WHERE admin_id = ?
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(adminId, limit);
  },

  getLogsByUser(targetUserId, limit = 100) {
    return db.prepare(`
      SELECT * FROM admin_activity_logs 
      WHERE target_user_id = ?
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(targetUserId, limit);
  }
};

// User Impersonation
export const impersonationDb = {
  start(adminId, targetUserId) {
    const token = `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    db.prepare(`
      INSERT INTO impersonation_sessions (admin_id, target_user_id, session_token)
      VALUES (?, ?, ?)
    `).run(adminId, targetUserId, token);

    return token;
  },

  end(token) {
    db.prepare(`
      UPDATE impersonation_sessions 
      SET ended_at = CURRENT_TIMESTAMP
      WHERE session_token = ? AND ended_at IS NULL
    `).run(token);
  },

  getSession(token) {
    return db.prepare(`
      SELECT * FROM impersonation_sessions 
      WHERE session_token = ? AND ended_at IS NULL
    `).get(token);
  },

  getActiveSessions(adminId) {
    return db.prepare(`
      SELECT * FROM impersonation_sessions 
      WHERE admin_id = ? AND ended_at IS NULL
      ORDER BY started_at DESC
    `).all(adminId);
  },

  getAllSessions(limit = 100) {
    return db.prepare(`
      SELECT * FROM impersonation_sessions 
      ORDER BY started_at DESC 
      LIMIT ?
    `).all(limit);
  }
};

export default { moduleDb, adminLogDb, impersonationDb, AVAILABLE_MODULES, TIER_MODULES };
