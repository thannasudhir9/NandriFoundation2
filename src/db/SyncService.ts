import { Program, Sponsor, Sponsorship, Student, Update } from '../types';

interface SqlitePayload {
  students?: Student[];
  updates?: Update[];
  sponsors?: Sponsor[];
  programs?: Program[];
  sponsorships?: Sponsorship[];
}

export const SyncService = {
  async readSqlite(): Promise<{
    localStudents: Student[];
    localUpdates: Update[];
    localSponsors: Sponsor[];
    localPrograms: Program[];
    localSponsorships: Sponsorship[];
  }> {
    console.debug('[DB] readSqlite:start', { endpoint: '/api/sqlite-sync', method: 'GET' });
    const response = await fetch('/api/sqlite-sync', { method: 'GET' });
    if (!response.ok) {
      console.error('[DB] readSqlite:error', { status: response.status, statusText: response.statusText });
      throw new Error('Failed to read SQLite data');
    }
    const data = (await response.json()) as SqlitePayload;
    const result = {
      localStudents: Array.isArray(data.students) ? data.students : [],
      localUpdates: Array.isArray(data.updates) ? data.updates : [],
      localSponsors: Array.isArray(data.sponsors) ? data.sponsors : [],
      localPrograms: Array.isArray(data.programs) ? data.programs : [],
      localSponsorships: Array.isArray(data.sponsorships) ? data.sponsorships : [],
    };
    console.info('[DB] readSqlite:ok', {
      students: result.localStudents.length,
      updates: result.localUpdates.length,
      sponsors: result.localSponsors.length,
      programs: result.localPrograms.length,
      sponsorships: result.localSponsorships.length,
    });
    return result;
  },

  async writeSqlite(
    students: Student[],
    updates: Update[],
    sponsors: Sponsor[],
    programs: Program[],
    sponsorships: Sponsorship[],
  ): Promise<void> {
    console.debug('[DB] writeSqlite:start', {
      endpoint: '/api/sqlite-sync',
      method: 'POST',
      students: students.length,
      updates: updates.length,
      sponsors: sponsors.length,
      programs: programs.length,
      sponsorships: sponsorships.length,
    });
    const response = await fetch('/api/sqlite-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students, updates, sponsors, programs, sponsorships }),
    });
    if (!response.ok) {
      console.error('[DB] writeSqlite:error', { status: response.status, statusText: response.statusText });
      throw new Error('Failed to write SQLite data');
    }
    console.info('[DB] writeSqlite:ok', {
      students: students.length,
      updates: updates.length,
      sponsors: sponsors.length,
      programs: programs.length,
      sponsorships: sponsorships.length,
    });
  },

  async ensureSeededFromCurrentAppData(
    fallbackStudents: Student[],
    fallbackUpdates: Update[],
    fallbackSponsors: Sponsor[],
    fallbackPrograms: Program[],
    fallbackSponsorships: Sponsorship[],
  ) {
    const { localStudents, localUpdates, localSponsors, localPrograms, localSponsorships } = await this.readSqlite();
    if (
      localStudents.length > 0 ||
      localUpdates.length > 0 ||
      localSponsors.length > 0 ||
      localPrograms.length > 0 ||
      localSponsorships.length > 0
    ) {
      console.debug('[DB] seed:skip', {
        reason: 'existing-data',
        students: localStudents.length,
        updates: localUpdates.length,
        sponsors: localSponsors.length,
        programs: localPrograms.length,
        sponsorships: localSponsorships.length,
      });
      return;
    }

    const mockStudentsRaw = typeof window !== 'undefined' ? localStorage.getItem('mock_firebase_students') : null;
    const mockUpdatesRaw = typeof window !== 'undefined' ? localStorage.getItem('mock_firebase_updates') : null;
    const mockStudents = mockStudentsRaw ? (JSON.parse(mockStudentsRaw) as Student[]) : [];
    const mockUpdates = mockUpdatesRaw ? (JSON.parse(mockUpdatesRaw) as Update[]) : [];

    const seedStudents = mockStudents.length > 0 ? mockStudents : fallbackStudents;
    const seedUpdates = mockUpdates.length > 0 ? mockUpdates : fallbackUpdates;
    console.info('[DB] seed:apply', {
      students: seedStudents.length,
      updates: seedUpdates.length,
      sponsors: fallbackSponsors.length,
      programs: fallbackPrograms.length,
      sponsorships: fallbackSponsorships.length,
      source: mockStudents.length > 0 || mockUpdates.length > 0 ? 'localStorage-mock' : 'fallback-seed',
    });
    await this.writeSqlite(seedStudents, seedUpdates, fallbackSponsors, fallbackPrograms, fallbackSponsorships);
  },

  async syncBothWays() {
    return this.readSqlite();
  },

  async getLocalStudents() {
    const { localStudents } = await this.readSqlite();
    return localStudents;
  },

  async getLocalUpdates() {
    const { localUpdates } = await this.readSqlite();
    return localUpdates;
  },

  async getLocalSponsors() {
    const { localSponsors } = await this.readSqlite();
    return localSponsors;
  },

  async getLocalPrograms() {
    const { localPrograms } = await this.readSqlite();
    return localPrograms;
  },

  async getLocalSponsorships() {
    const { localSponsorships } = await this.readSqlite();
    return localSponsorships;
  },

  async saveStudentLocally(student: Student) {
    const { localStudents, localUpdates, localSponsors, localPrograms, localSponsorships } = await this.readSqlite();
    const index = localStudents.findIndex((item) => item.id === student.id);
    const operation = index >= 0 ? 'update' : 'create';
    if (index >= 0) {
      localStudents[index] = student;
    } else {
      localStudents.unshift(student);
    }
    console.debug('[DB] saveStudentLocally', { operation, studentId: student.id, nextStudents: localStudents.length });
    await this.writeSqlite(localStudents, localUpdates, localSponsors, localPrograms, localSponsorships);
  },

  async saveUpdateLocally(update: Update) {
    const { localStudents, localUpdates, localSponsors, localPrograms, localSponsorships } = await this.readSqlite();
    const index = localUpdates.findIndex((item) => item.id === update.id);
    const operation = index >= 0 ? 'update' : 'create';
    if (index >= 0) {
      localUpdates[index] = update;
    } else {
      localUpdates.unshift(update);
    }
    console.debug('[DB] saveUpdateLocally', { operation, updateId: update.id, nextUpdates: localUpdates.length });
    await this.writeSqlite(localStudents, localUpdates, localSponsors, localPrograms, localSponsorships);
  },

  async deleteStudentLocally(id: string) {
    const { localStudents, localUpdates, localSponsors, localPrograms, localSponsorships } = await this.readSqlite();
    const nextStudents = localStudents.filter((student) => student.id !== id);
    const nextUpdates = localUpdates.filter((update) => update.studentId !== id);
    const nextSponsorships = localSponsorships.filter((sponsorship) => sponsorship.studentId !== id);
    console.debug('[DB] deleteStudentLocally', {
      studentId: id,
      nextStudents: nextStudents.length,
      nextUpdates: nextUpdates.length,
      nextSponsorships: nextSponsorships.length,
    });
    await this.writeSqlite(nextStudents, nextUpdates, localSponsors, localPrograms, nextSponsorships);
  },
};
