import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'techypark.db');
const db = new Database(dbPath);

const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('mosiur@beverlyhillspublishing.com');

if (admin) {
  console.log('\n✅ Super Admin Account Found:\n');
  console.log('ID:', admin.id);
  console.log('Email:', admin.email);
  console.log('Name:', admin.name);
  console.log('Role:', admin.role);
  console.log('Status:', admin.status);
  console.log('Created:', admin.created_at);
  
  const modules = db.prepare('SELECT module_name FROM user_modules WHERE user_id = ? AND enabled = 1').all(admin.id);
  console.log(`\n✅ Enabled Modules (${modules.length}):`);
  modules.forEach(m => console.log('  -', m.module_name));
} else {
  console.log('❌ Super admin not found');
}

db.close();
