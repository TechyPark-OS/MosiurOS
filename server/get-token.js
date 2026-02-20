import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'techypark.db');
const db = new Database(dbPath);

const email = process.argv[2] || 'test@techypark.com';
const stmt = db.prepare('SELECT token FROM magic_links WHERE email = ? AND used = 0 ORDER BY created_at DESC LIMIT 1');
const result = stmt.get(email);

if (result) {
  console.log('Token:', result.token);
  console.log('Verify URL: https://5173-ira245erppsrdirm200d8-23969b88.us1.manus.computer/verify?token=' + result.token);
} else {
  console.log('No unused magic link found for', email);
}

db.close();
