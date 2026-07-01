import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

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

interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  donationTotal: number;
  sponsoredStudentCount: number;
}

function getDb() {
  const dbPath = join(process.cwd(), 'data', 'nandri.sqlite');
  mkdirSync(dirname(dbPath), { recursive: true });
  console.info('[DB][API] getDb', { dbPath });
  const db = new Database(dbPath);
  db.prepare('CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS updates (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS sponsors (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  db.prepare('CREATE TABLE IF NOT EXISTS sync_meta (id TEXT PRIMARY KEY, payload TEXT NOT NULL)').run();
  return db;
}

function writeAll(db: Database.Database, students: Student[], updates: Update[], sponsors: Sponsor[]) {
  const insertStudent = db.prepare('INSERT OR REPLACE INTO students (id, payload) VALUES (?, ?)');
  const insertUpdate = db.prepare('INSERT OR REPLACE INTO updates (id, payload) VALUES (?, ?)');
  const insertSponsor = db.prepare('INSERT OR REPLACE INTO sponsors (id, payload) VALUES (?, ?)');
  const insertMeta = db.prepare('INSERT OR REPLACE INTO sync_meta (id, payload) VALUES (?, ?)');
  const removeStudents = db.prepare('DELETE FROM students');
  const removeUpdates = db.prepare('DELETE FROM updates');
  const removeSponsors = db.prepare('DELETE FROM sponsors');
  const transaction = db.transaction(() => {
    removeStudents.run();
    removeUpdates.run();
    removeSponsors.run();
    for (const student of students) insertStudent.run(student.id, JSON.stringify(student));
    for (const update of updates) insertUpdate.run(update.id, JSON.stringify(update));
    for (const sponsor of sponsors) insertSponsor.run(sponsor.id, JSON.stringify(sponsor));
    insertMeta.run('lastSync', JSON.stringify({ lastSync: new Date().toISOString() }));
  });
  transaction();
}

function readAll(db: Database.Database) {
  const studentRows = db.prepare('SELECT payload FROM students').all() as Array<{ payload: string }>;
  const updateRows = db.prepare('SELECT payload FROM updates').all() as Array<{ payload: string }>;
  const sponsorRows = db.prepare('SELECT payload FROM sponsors').all() as Array<{ payload: string }>;
  return {
    students: studentRows.map((row) => JSON.parse(row.payload) as Student),
    updates: updateRows.map((row) => JSON.parse(row.payload) as Update),
    sponsors: sponsorRows.map((row) => JSON.parse(row.payload) as Sponsor),
  };
}

export async function GET() {
  console.info('[DB][API] GET /api/sqlite-sync:start');
  const db = getDb();
  const data = readAll(db);
  db.close();
  console.info('[DB][API] GET /api/sqlite-sync:done', {
    students: data.students.length,
    updates: data.updates.length,
    sponsors: data.sponsors.length,
  });
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(req: Request) {
  console.info('[DB][API] POST /api/sqlite-sync:start');
  const body = (await req.json()) as { students?: Student[]; updates?: Update[]; sponsors?: Sponsor[] };
  const students = Array.isArray(body.students) ? body.students : [];
  const updates = Array.isArray(body.updates) ? body.updates : [];
  const sponsors = Array.isArray(body.sponsors) ? body.sponsors : [];
  console.info('[DB][API] POST /api/sqlite-sync:payload', {
    students: students.length,
    updates: updates.length,
    sponsors: sponsors.length,
  });
  const db = getDb();
  writeAll(db, students, updates, sponsors);
  const data = readAll(db);
  db.close();
  console.info('[DB][API] POST /api/sqlite-sync:done', {
    students: data.students.length,
    updates: data.updates.length,
    sponsors: data.sponsors.length,
  });
  return NextResponse.json({ ok: true, ...data, syncedAt: new Date().toISOString() });
}
