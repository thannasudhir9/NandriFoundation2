import { useMemo, useState } from 'react';
import { Program, Sponsor, Sponsorship, Student } from '../types';

interface SponsorshipsViewProps {
  sponsorships: Sponsorship[];
  sponsors: Sponsor[];
  students: Student[];
  programs: Program[];
}

export function SponsorshipsView({ sponsorships, sponsors, students, programs }: SponsorshipsViewProps) {
  const [search, setSearch] = useState('');

  const sponsorMap = useMemo(() => new Map(sponsors.map((s) => [s.id, s])), [sponsors]);
  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);
  const programMap = useMemo(() => new Map(programs.map((p) => [p.id, p])), [programs]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sponsorships;
    return sponsorships.filter((item) => {
      const sponsorName = sponsorMap.get(item.sponsorId)?.name.toLowerCase() || '';
      const studentName = studentMap.get(item.studentId)?.name.toLowerCase() || '';
      const programName = programMap.get(item.programId)?.name.toLowerCase() || '';
      return sponsorName.includes(query) || studentName.includes(query) || programName.includes(query);
    });
  }, [programMap, search, sponsorMap, sponsorships, studentMap]);

  const activeCount = filtered.filter((item) => item.status === 'active').length;
  const totalMonthly = filtered.reduce((sum, item) => sum + item.monthlyAmount, 0);

  return (
    <div className="pb-24 pt-4 px-4 w-full max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sponsorships</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Sponsor-child program links from hackathon model</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Links</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filtered.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{activeCount}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Monthly Commitment</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">EUR {totalMonthly.toLocaleString()}</div>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sponsor, student, program..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Sponsor</th>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Student</th>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Program</th>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Start Date</th>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
              <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3 text-gray-800 dark:text-gray-200">{sponsorMap.get(item.sponsorId)?.name || item.sponsorId}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{studentMap.get(item.studentId)?.name || item.studentId}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{programMap.get(item.programId)?.name || item.programId}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(item.startDate).toISOString().slice(0, 10)}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">EUR {item.monthlyAmount}</td>
                <td className="p-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No sponsorship links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
