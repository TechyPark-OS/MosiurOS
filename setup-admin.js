/**
 * One-time setup script to create super admin account
 * Run this after first deployment: node setup-admin.js
 */

import Database from 'better-sqlite3';
import crypto from 'crypto';

const dbPath = './data/techypark.db';
const adminEmail = 'mosiur@beverlyhillspublishing.com';

console.log('\n🚀 TechyPark Engine - Super Admin Setup\n');

try {
  const db = new Database(dbPath);
  
  // Check if admin exists
  const existing = db.prepare('SELECT id, email, role FROM users WHERE email = ?').get(adminEmail);
  
  if (existing) {
    console.log('✅ Super admin already exists!');
    console.log('   Email:', existing.email);
    console.log('   Role:', existing.role);
    
    // Ensure role is Admin
    if (existing.role !== 'Admin') {
      db.prepare('UPDATE users SET role = ? WHERE email = ?').run('Admin', adminEmail);
      console.log('✅ Updated role to Admin');
    }
    
    db.close();
    process.exit(0);
  }
  
  // Create super admin
  const adminId = crypto.randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO users (id, email, name, role, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(adminId, adminEmail, 'Mosiur Rahman', 'Admin', 'active', now, now);
  
  console.log('✅ Super admin created successfully!');
  console.log('   Email:', adminEmail);
  console.log('   Name: Mosiur Rahman');
  console.log('   Role: Admin');
  console.log('   ID:', adminId);
  console.log('\n🎉 Setup complete! You can now login with:', adminEmail);
  console.log('   Use magic link or OAuth to sign in.\n');
  
  db.close();
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.error('\nMake sure:');
  console.error('1. The database file exists at', dbPath);
  console.error('2. The users table has been created');
  console.error('3. You have write permissions\n');
  process.exit(1);
}
