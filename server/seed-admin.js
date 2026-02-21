import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Seed super admin account
 * Creates mosiur@beverlyhillspublishing.com as super admin if not exists
 */
export function seedSuperAdmin() {
  const dbPath = path.join(__dirname, '..', 'data', 'techypark.db');
  const db = new Database(dbPath);

  try {
    // Ensure user_modules table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        module_name TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, module_name)
      )
    `);

    // Check if super admin exists
    const adminEmail = 'mosiur@beverlyhillspublishing.com';
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

    if (existingAdmin) {
      console.log('✅ Super admin already exists:', adminEmail);
      
      // Ensure admin role is set
      db.prepare('UPDATE users SET role = ? WHERE email = ?').run('Admin', adminEmail);
      console.log('✅ Super admin role verified');
      
      db.close();
      return;
    }

    // Create super admin user
    const adminId = crypto.randomBytes(16).toString('hex');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, name, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      adminEmail,
      'Mosiur Rahman',
      'Admin',
      'active',
      now,
      now
    );

    console.log('✅ Super admin created successfully');
    console.log('   Email:', adminEmail);
    console.log('   Role: Admin');
    console.log('   ID:', adminId);

    // Enable all modules for super admin
    const modules = [
      'funnels', 'landing_pages', 'ecom_store', 'products', 'checkout',
      'courses', 'memberships', 'email_marketing', 'workflows',
      'opportunities', 'appointments', 'contacts', 'message_hub',
      'community', 'blog', 'customer_center', 'analytics', 'surveys',
      'countdown', 'affiliates', 'short_links', 'ab_testing'
    ];

    const insertModule = db.prepare(`
      INSERT OR IGNORE INTO user_modules (user_id, module_name, enabled, created_at)
      VALUES (?, ?, 1, ?)
    `);

    for (const module of modules) {
      insertModule.run(adminId, module, now);
    }

    console.log(`✅ Enabled ${modules.length} modules for super admin`);

    db.close();
    console.log('✅ Super admin seeding complete!\n');

  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
    db.close();
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSuperAdmin();
}
