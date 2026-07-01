'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadStudentsAndUpdates } from '../../lib/data/clientStore';
import { buildReport, defaultReportFilters } from '../../lib/reporting/aggregate';
import { ReportFilters, ReportPeriod } from '../../lib/reporting/types';
import { DonationTrendChart } from '../../components/reports/DonationTrendChart';
import { KpiCards } from '../../components/reports/KpiCards';
import { PeriodSelector } from '../../components/reports/PeriodSelector';
import { ReportFiltersPanel } from '../../components/reports/ReportFilters';
import { SponsorshipBarChart } from '../../components/reports/SponsorshipBarChart';
import { Student, Update } from '../../src/types';

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [period, setPeriod] = useState<ReportPeriod>('quarterly');
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        const { students: loadedStudents, updates: loadedUpdates } = await loadStudentsAndUpdates();
        if (!active) return;
        setStudents(loadedStudents);
        setUpdates(loadedUpdates);
      } catch {
        if (active) setLoadError('Failed to load report data.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const report = useMemo(() => buildReport(students, updates, period, filters), [students, updates, period, filters]);
  const villages = useMemo(() => Array.from(new Set(students.map((s) => s.village))).sort(), [students]);
  const schools = useMemo(() => Array.from(new Set(students.map((s) => s.school))).sort(), [students]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporting Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quarterly, half-yearly and annual program insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              Back to App
            </Link>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
        </div>

        <ReportFiltersPanel filters={filters} villages={villages} schools={schools} onChange={setFilters} />
        {isLoading && <div className="text-sm text-gray-500 dark:text-gray-400">Loading report data...</div>}
        {loadError && <div className="text-sm text-red-600 dark:text-red-400">{loadError}</div>}
        <KpiCards kpis={report.kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DonationTrendChart data={report.donationTrend} />
          <SponsorshipBarChart data={report.sponsorshipByVillage} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Sponsor Cohorts</h3>
            <div className="space-y-2">
              {report.sponsorCohorts.map((cohort) => (
                <div key={cohort.name} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{cohort.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{cohort.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Filtered Students</h3>
            <div className="max-h-72 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
              {report.students.map((student) => (
                <div key={student.id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.village} • {student.school}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 dark:text-white">EUR {(student.donationAmount ?? 0).toFixed(0)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.sponsorName || 'Unsponsored'}</p>
                  </div>
                </div>
              ))}
              {report.students.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">No students match current filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
