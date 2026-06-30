import { INITIAL_STUDENTS, INITIAL_UPDATES } from '../../src/data';
import { localDb, SyncService } from '../../src/db/SyncService';
import { Student, Update } from '../../src/types';

export async function loadStudentsAndUpdates(): Promise<{ students: Student[]; updates: Update[] }> {
  const studentCount = await localDb.students.count();
  if (studentCount === 0) {
    await localDb.students.bulkPut(INITIAL_STUDENTS);
    await localDb.updates.bulkPut(INITIAL_UPDATES);
  }

  const { localStudents, localUpdates } = await SyncService.syncBothWays();
  return {
    students: localStudents.length ? localStudents : INITIAL_STUDENTS,
    updates: localUpdates.length ? localUpdates : INITIAL_UPDATES,
  };
}
