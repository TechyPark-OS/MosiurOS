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

// Create tables
db.exec(`
  -- Users table
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

  -- Sessions table
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

  -- Magic links table
  CREATE TABLE IF NOT EXISTS magic_links (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Invitations table
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

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
  CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
  CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
  CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
`);

// Helper function to generate UUID
function generateId() {
  return crypto.randomUUID();
}

// Helper function to generate secure token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// User operations
export const userDb = {
  // Create a new user
  create: (userData) => {
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, avatar, role, provider, provider_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      userData.email,
      userData.name || userData.email.split('@')[0],
      userData.avatar || null,
      userData.role || 'User',
      userData.provider || 'email',
      userData.providerId || null
    );
    return userDb.findById(id);
  },

  // Find user by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Find user by email
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  // Find or create user by email
  findOrCreate: (userData) => {
    let user = userDb.findByEmail(userData.email);
    if (!user) {
      user = userDb.create(userData);
    }
    return user;
  },

  // Update user
  update: (id, updates) => {
    const fields = [];
    const values = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.notification_preferences !== undefined) {
      fields.push('notification_preferences = ?');
      values.push(typeof updates.notification_preferences === 'string' 
        ? updates.notification_preferences 
        : JSON.stringify(updates.notification_preferences));
    }
    
    if (fields.length === 0) return userDb.findById(id);
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return userDb.findById(id);
  },

  // Update last login
  updateLastLogin: (id) => {
    const stmt = db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  },

  // Get all users
  findAll: (limit = 100, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset);
  },

  // Count users
  count: () => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
    return stmt.get().count;
  },

  // Delete user
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
};

// Session operations
export const sessionDb = {
  // Create a new session
  create: (userId, metadata = {}) => {
    const id = generateId();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    
    const stmt = db.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId, token, expiresAt, metadata.ipAddress || null, metadata.userAgent || null);
    
    return { id, token, expiresAt };
  },

  // Find session by token
  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT s.*, u.email, u.name, u.avatar, u.role, u.provider, u.status, u.notification_preferences
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `);
    return stmt.get(token);
  },

  // Delete session
  delete: (token) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    return stmt.run(token);
  },

  // Delete all sessions for a user
  deleteAllForUser: (userId) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
    return stmt.run(userId);
  },

  // Clean up expired sessions
  cleanupExpired: () => {
    const stmt = db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')");
    return stmt.run();
  }
};

// Magic link operations
export const magicLinkDb = {
  // Create a new magic link
  create: (email) => {
    const id = generateId();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
    
    const stmt = db.prepare(`
      INSERT INTO magic_links (id, email, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, email, token, expiresAt);
    
    return { id, token, expiresAt };
  },

  // Find magic link by token
  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT * FROM magic_links
      WHERE token = ? AND used = 0 AND expires_at > datetime('now')
    `);
    return stmt.get(token);
  },

  // Mark magic link as used
  markUsed: (token) => {
    const stmt = db.prepare('UPDATE magic_links SET used = 1 WHERE token = ?');
    return stmt.run(token);
  },

  // Clean up expired magic links
  cleanupExpired: () => {
    const stmt = db.prepare("DELETE FROM magic_links WHERE expires_at <= datetime('now') OR used = 1");
    return stmt.run();
  }
};

// Invitation operations
export const invitationDb = {
  // Create a new invitation
  create: (data) => {
    const id = generateId();
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    
    const stmt = db.prepare(`
      INSERT INTO invitations (id, email, role, token, invited_by, message, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.email, data.role || 'User', token, data.invitedBy, data.message || '', expiresAt);
    
    return { id, token, expiresAt };
  },

  // Find invitation by token
  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT i.*, u.name as inviter_name, u.email as inviter_email
      FROM invitations i
      LEFT JOIN users u ON i.invited_by = u.id
      WHERE i.token = ? AND i.status = 'pending' AND i.expires_at > datetime('now')
    `);
    return stmt.get(token);
  },

  // Find invitation by email
  findByEmail: (email) => {
    const stmt = db.prepare(`
      SELECT * FROM invitations WHERE email = ? AND status = 'pending' AND expires_at > datetime('now')
    `);
    return stmt.get(email);
  },

  // Find invitation by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM invitations WHERE id = ?');
    return stmt.get(id);
  },

  // Get all invitations
  findAll: () => {
    const stmt = db.prepare(`
      SELECT i.*, u.name as inviter_name, u.email as inviter_email
      FROM invitations i
      LEFT JOIN users u ON i.invited_by = u.id
      ORDER BY i.created_at DESC
    `);
    return stmt.all();
  },

  // Accept invitation
  accept: (token) => {
    const stmt = db.prepare(`
      UPDATE invitations SET status = 'accepted', accepted_at = CURRENT_TIMESTAMP WHERE token = ?
    `);
    return stmt.run(token);
  },

  // Delete invitation
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM invitations WHERE id = ?');
    return stmt.run(id);
  },

  // Count pending invitations
  countPending: () => {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM invitations WHERE status = 'pending' AND expires_at > datetime('now')");
    return stmt.get().count;
  }
};

// Run cleanup periodically (every hour)
setInterval(() => {
  sessionDb.cleanupExpired();
  magicLinkDb.cleanupExpired();
}, 60 * 60 * 1000);

export default db;
