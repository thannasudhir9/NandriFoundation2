import { INITIAL_PROGRAMS, INITIAL_SPONSORS, INITIAL_SPONSORSHIPS, INITIAL_STUDENTS, INITIAL_UPDATES } from '../../src/data';
import { SyncService } from '../../src/db/SyncService';
import { Student, Update } from '../../src/types';

export async function loadStudentsAndUpdates(): Promise<{ students: Student[]; updates: Update[] }> {
  await SyncService.ensureSeededFromCurrentAppData(
    INITIAL_STUDENTS,
    INITIAL_UPDATES,
    INITIAL_SPONSORS,
    INITIAL_PROGRAMS,
    INITIAL_SPONSORSHIPS,
  );
  const { localStudents, localUpdates } = await SyncService.syncBothWays();
  return {
    students: localStudents.length ? localStudents : INITIAL_STUDENTS,
    updates: localUpdates.length ? localUpdates : INITIAL_UPDATES,
  };
}
