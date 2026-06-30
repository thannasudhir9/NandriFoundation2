import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';

interface Student {
  id: string;
  name: string;
  age: number;
  school: string;
  village: string;
  grade: string;
  photoUrl: string;
  sponsorName?: string;
  sponsorEmail?: string;
  donationAmount?: number;
  bio: string;
}

interface Update {
  id: string;
  studentId?: string;
  authorName: string;
  date: string;
  content: string;
  photoUrl?: string;
  type: 'general' | 'student';
}

function getDb() {
  const dbPath = join(process.cwd(), 'data', 'nandri.sqlite');
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.prepare('CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS updates (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS sync_meta (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  return db;
}

function writeAll(db: Database.Database, students: Student[], updates: Update[]) {
  const insertStudent = db.prepare('INSERT OR REPLACE INTO students (id, payload) VALUES (?, ?)');
  const insertUpdate = db.prepare('INSERT OR REPLACE INTO updates (id, payload) VALUES (?, ?)');
  const insertMeta = db.prepare('INSERT OR REPLACE INTO sync_meta (id, payload) VALUES (?, ?)');
  const removeStudents = db.prepare('DELETE FROM students');
  const removeUpdates = db.prepare('DELETE FROM updates');
  const transaction = db.transaction(() => {
    removeStudents.run();
    removeUpdates.run();
    for (const student of students) insertStudent.run(student.id, JSON.stringify(student));
    for (const update of updates) insertUpdate.run(update.id, JSON.stringify(update));
    insertMeta.run('lastSync', JSON.stringify({ lastSync: new Date().toISOString() }));
  });
  transaction();
}

function readAll(db: Database.Database) {
  const studentRows = db.prepare('SELECT payload FROM students').all() as Array<{ payload: string }>;
  const updateRows = db.prepare('SELECT payload FROM updates').all() as Array<{ payload: string }>;
  return {
    students: studentRows.map((row) => JSON.parse(row.payload) as Student),
    updates: updateRows.map((row) => JSON.parse(row.payload) as Update),
  };
}

export async function GET() {
  const db = getDb();
  const data = readAll(db);
  db.close();
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { students?: Student[]; updates?: Update[] };
  const students = Array.isArray(body.students) ? body.students : [];
  const updates = Array.isArray(body.updates) ? body.updates : [];
  const db = getDb();
  writeAll(db, students, updates);
  const data = readAll(db);
  db.close();
  return NextResponse.json({ ok: true, ...data, syncedAt: new Date().toISOString() });
}
