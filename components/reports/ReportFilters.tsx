import { ReportFilters } from '../../lib/reporting/types';

interface ReportFiltersProps {
  filters: ReportFilters;
  villages: string[];
  schools: string[];
  onChange: (filters: ReportFilters) => void;
}

export function ReportFiltersPanel({ filters, villages, schools, onChange }: ReportFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search student/sponsor"
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <select
          value={filters.sponsorship}
          onChange={(e) => onChange({ ...filters, sponsorship: e.target.value as ReportFilters['sponsorship'] })}
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="all">All sponsorships</option>
          <option value="sponsored">Sponsored</option>
          <option value="unsponsored">Unsponsored</option>
        </select>
        <input
          type="number"
          min="0"
          value={filters.minDonation ?? ''}
          onChange={(e) => onChange({ ...filters, minDonation: e.target.value === '' ? null : Number(e.target.value) })}
          placeholder="Min donation"
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          type="number"
          min="0"
          value={filters.maxDonation ?? ''}
          onChange={(e) => onChange({ ...filters, maxDonation: e.target.value === '' ? null : Number(e.target.value) })}
          placeholder="Max donation"
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <select
          value={filters.village}
          onChange={(e) => onChange({ ...filters, village: e.target.value })}
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="All">All villages</option>
          {villages.map((village) => (
            <option key={village} value={village}>
              {village}
            </option>
          ))}
        </select>
        <select
          value={filters.school}
          onChange={(e) => onChange({ ...filters, school: e.target.value })}
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="All">All schools</option>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
