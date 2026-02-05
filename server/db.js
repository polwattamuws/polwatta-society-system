import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../db/members.db');
const schemaPath = path.join(__dirname, '../db/init.sql');

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

// Initialize Schema
const migration = fs.readFileSync(schemaPath, 'utf8');
db.exec(migration);

console.log('Database initialized successfully at', dbPath);

export default db;
