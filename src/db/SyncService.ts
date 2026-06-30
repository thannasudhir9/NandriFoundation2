import Dexie, { Table } from 'dexie';
import { Student, Update } from '../types';

// Using Dexie as our "Local DB" since a physical .sqlite file 
// cannot be written to directly from a static GitHub Pages site.
// This provides a robust offline-first IndexedDB that acts as our local SQLite clone.

export class LocalDatabase extends Dexie {
  students!: Table<Student, string>;
  updates!: Table<Update, string>;
  syncState!: Table<{ id: string; lastSync: string }, string>;

  constructor() {
    super('NandriLocalDB');
    this.version(1).stores({
      students: 'id, name, sponsorId, village',
      updates: 'id, studentId, date',
      syncState: 'id'
    });
  }
}

export const localDb = new LocalDatabase();

// Mock Cloud Database (Firebase)
// In a real environment, this would be Firestore SDK calls.
// Since GCP Resource Manager is disabled in this workspace, we mock the cloud sync.
const MockCloudDB = {
  async fetchUpdates(): Promise<Update[]> {
    const data = localStorage.getItem('mock_firebase_updates');
    return data ? JSON.parse(data) : [];
  },
  async fetchStudents(): Promise<Student[]> {
    const data = localStorage.getItem('mock_firebase_students');
    return data ? JSON.parse(data) : [];
  },
  async pushUpdates(updates: Update[]) {
    localStorage.setItem('mock_firebase_updates', JSON.stringify(updates));
  },
  async pushStudents(students: Student[]) {
    localStorage.setItem('mock_firebase_students', JSON.stringify(students));
  }
};

export const SyncService = {
  // Sync in both ways: Local DB (IndexedDB) <--> Cloud DB (Mock Firebase)
  async syncBothWays() {
    console.log('Starting two-way sync between Local DB and Cloud DB...');
    
    // 1. Pull from Cloud to Local
    const cloudStudents = await MockCloudDB.fetchStudents();
    const cloudUpdates = await MockCloudDB.fetchUpdates();
    
    if (cloudStudents.length > 0) {
      await localDb.students.bulkPut(cloudStudents);
    }
    if (cloudUpdates.length > 0) {
      await localDb.updates.bulkPut(cloudUpdates);
    }

    // 2. Push from Local to Cloud
    const localStudents = await localDb.students.toArray();
    const localUpdates = await localDb.updates.toArray();
    
    await MockCloudDB.pushStudents(localStudents);
    await MockCloudDB.pushUpdates(localUpdates);
    
    await localDb.syncState.put({ id: 'lastSync', lastSync: new Date().toISOString() });
    
    // 3. Sync with local SQLite API (firebase mock <-> sqlite and local db)
    try {
      const sqlitePullResp = await fetch('/api/sqlite-sync', { method: 'GET' });
      if (sqlitePullResp.ok) {
        const sqliteData = await sqlitePullResp.json() as { students?: Student[]; updates?: Update[] };
        if (sqliteData.students?.length) {
          await localDb.students.bulkPut(sqliteData.students);
        }
        if (sqliteData.updates?.length) {
          await localDb.updates.bulkPut(sqliteData.updates);
        }
      }

      const mergedStudents = await localDb.students.toArray();
      const mergedUpdates = await localDb.updates.toArray();
      await fetch('/api/sqlite-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: mergedStudents, updates: mergedUpdates }),
      });
      await MockCloudDB.pushStudents(mergedStudents);
      await MockCloudDB.pushUpdates(mergedUpdates);
    } catch (err) {
      console.warn('SQLite sync skipped:', err);
    }

    console.log('Sync complete!');
    return { localStudents, localUpdates };
  },

  async getLocalStudents() {
    return await localDb.students.toArray();
  },

  async getLocalUpdates() {
    return await localDb.updates.toArray();
  },

  async saveStudentLocally(student: Student) {
    await localDb.students.put(student);
    this.syncBothWays(); // trigger background sync
  },

  async saveUpdateLocally(update: Update) {
    await localDb.updates.put(update);
    this.syncBothWays(); // trigger background sync
  }
};
