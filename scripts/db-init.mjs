#!/usr/bin/env node
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';

const dbPath = join(process.cwd(), 'data', 'nandri.sqlite');
mkdirSync(dirname(dbPath), { recursive: true });
console.info('[DB][Init] start', { dbPath });

const db = new Database(dbPath);
db.prepare('CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS updates (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS sponsors (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS programs (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS sponsorships (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.prepare('CREATE TABLE IF NOT EXISTS sync_meta (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
db.close();
console.info('[DB][Init] tables-ready', {
  tables: ['students', 'updates', 'sponsors', 'programs', 'sponsorships', 'sync_meta'],
});

if (existsSync(dbPath)) {
  console.log(`[DB][Init] success ${dbPath}`);
} else {
  console.error(`[DB][Init] failed ${dbPath}`);
  process.exit(1);
}
