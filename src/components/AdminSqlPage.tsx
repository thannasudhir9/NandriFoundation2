import { useEffect, useMemo, useState } from 'react';
import { Program, Sponsor, Sponsorship, Student, Update } from '../types';
import { SyncService } from '../db/SyncService';
import { Database, Plus, Save, Trash2, RefreshCw } from 'lucide-react';

type TableName = 'students' | 'updates' | 'sponsors';

interface AdminSqlPageProps {
  onDataChanged: (payload: { students: Student[]; updates: Update[]; sponsors: Sponsor[] }) => void;
}

export function AdminSqlPage({ onDataChanged }: AdminSqlPageProps) {
  const [tableName, setTableName] = useState<TableName>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState('');
  const [newRecordJson, setNewRecordJson] = useState('');

  const rows = useMemo(() => {
    if (tableName === 'students') return students;
    if (tableName === 'updates') return updates;
    return sponsors;
  }, [tableName, students, updates, sponsors]);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { localStudents, localUpdates, localSponsors, localPrograms, localSponsorships } = await SyncService.readSqlite();
      setStudents(localStudents);
      setUpdates(localUpdates);
      setSponsors(localSponsors);
      setPrograms(localPrograms);
      setSponsorships(localSponsorships);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const persist = async (nextStudents: Student[], nextUpdates: Update[], nextSponsors: Sponsor[]) => {
    await SyncService.writeSqlite(nextStudents, nextUpdates, nextSponsors, programs, sponsorships);
    setStudents(nextStudents);
    setUpdates(nextUpdates);
    setSponsors(nextSponsors);
    onDataChanged({ students: nextStudents, updates: nextUpdates, sponsors: nextSponsors });
  };

  const startEdit = (row: Student | Update | Sponsor) => {
    setEditingId(row.id);
    setDraftJson(JSON.stringify(row, null, 2));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const parsed = JSON.parse(draftJson) as Student | Update | Sponsor;
      if (!parsed.id || parsed.id !== editingId) {
        throw new Error('Record id must be unchanged');
      }

      if (tableName === 'students') {
        const next = students.map((item) => (item.id === editingId ? (parsed as Student) : item));
        await persist(next, updates, sponsors);
      } else if (tableName === 'updates') {
        const next = updates.map((item) => (item.id === editingId ? (parsed as Update) : item));
        await persist(students, next, sponsors);
      } else {
        const next = sponsors.map((item) => (item.id === editingId ? (parsed as Sponsor) : item));
        await persist(students, updates, next);
      }
      setEditingId(null);
      setDraftJson('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const createRecord = async () => {
    try {
      const parsed = JSON.parse(newRecordJson) as Student | Update | Sponsor;
      if (!parsed.id) throw new Error('New record must include id');

      if (tableName === 'students') {
        if (students.some((item) => item.id === parsed.id)) throw new Error('Duplicate id');
        await persist([parsed as Student, ...students], updates, sponsors);
      } else if (tableName === 'updates') {
        if (updates.some((item) => item.id === parsed.id)) throw new Error('Duplicate id');
        await persist(students, [parsed as Update, ...updates], sponsors);
      } else {
        if (sponsors.some((item) => item.id === parsed.id)) throw new Error('Duplicate id');
        await persist(students, updates, [parsed as Sponsor, ...sponsors]);
      }
      setNewRecordJson('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const deleteRecord = async (id: string) => {
    if (tableName === 'students') {
      await persist(students.filter((item) => item.id !== id), updates, sponsors);
    } else if (tableName === 'updates') {
      await persist(students, updates.filter((item) => item.id !== id), sponsors);
    } else {
      await persist(students, updates, sponsors.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-5xl mx-auto transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin SQL Console</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Full DB tables with CRUD controls.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Database className="w-4 h-4 text-gray-500" />
        <select
          value={tableName}
          onChange={(e) => {
            setTableName(e.target.value as TableName);
            setEditingId(null);
            setDraftJson('');
            setNewRecordJson('');
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="students">students</option>
          <option value="updates">updates</option>
          <option value="sponsors">sponsors</option>
        </select>
      </div>

      {error && <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
        <div className="text-sm font-semibold mb-2">Create record ({tableName})</div>
        <textarea
          value={newRecordJson}
          onChange={(e) => setNewRecordJson(e.target.value)}
          className="w-full min-h-32 font-mono text-xs p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          placeholder='{"id":"new-id", "...":"..."}'
        />
        <button
          onClick={createRecord}
          className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
        <div className="text-sm font-semibold mb-2">
          Records ({tableName}): {rows.length}
        </div>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-mono text-gray-600 dark:text-gray-300">{row.id}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(row)}
                      className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRecord(row.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-600 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
                {editingId === row.id ? (
                  <div>
                    <textarea
                      value={draftJson}
                      onChange={(e) => setDraftJson(e.target.value)}
                      className="w-full min-h-40 font-mono text-xs p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                    <button
                      onClick={saveEdit}
                      className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                ) : (
                  <pre className="text-xs overflow-auto bg-gray-50 dark:bg-gray-900 p-2 rounded">{JSON.stringify(row, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
