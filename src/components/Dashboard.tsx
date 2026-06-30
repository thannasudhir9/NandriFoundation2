import { useMemo, useState } from 'react';
import { Student } from '../types';
import { useLanguage } from '../LanguageContext';

interface DashboardProps {
  students: Student[];
}

type SponsorshipFilter = 'all' | 'sponsored' | 'unsponsored';

export function Dashboard({ students }: DashboardProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [sponsorshipFilter, setSponsorshipFilter] = useState<SponsorshipFilter>('all');
  const [minDonation, setMinDonation] = useState('');
  const [maxDonation, setMaxDonation] = useState('');

  const filteredStudents = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const min = minDonation === '' ? null : Number(minDonation);
    const max = maxDonation === '' ? null : Number(maxDonation);

    return students.filter((student) => {
      const hasSponsor = Boolean(student.sponsorName && student.sponsorName.trim() !== '');
      const donation = student.donationAmount ?? 0;

      if (sponsorshipFilter === 'sponsored' && !hasSponsor) return false;
      if (sponsorshipFilter === 'unsponsored' && hasSponsor) return false;
      if (min !== null && donation < min) return false;
      if (max !== null && donation > max) return false;

      if (!searchText) return true;

      return (
        student.name.toLowerCase().includes(searchText) ||
        student.village.toLowerCase().includes(searchText) ||
        student.school.toLowerCase().includes(searchText) ||
        (student.sponsorName || '').toLowerCase().includes(searchText)
      );
    });
  }, [students, search, sponsorshipFilter, minDonation, maxDonation]);

  const totalStudents = filteredStudents.length;
  const sponsoredStudents = filteredStudents.filter((student) => student.sponsorName && student.sponsorName.trim() !== '').length;
  const unsponsoredStudents = totalStudents - sponsoredStudents;
  const totalDonations = filteredStudents.reduce((sum, student) => sum + (student.donationAmount ?? 0), 0);
  const avgDonation = sponsoredStudents > 0 ? totalDonations / sponsoredStudents : 0;

  return (
    <div className="pb-24 pt-4 px-4 w-full max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('dashboardTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('totalStudents')}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('sponsored')}</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sponsoredStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('totalDonation')}</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">EUR {totalDonations.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('avgDonation')}</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">EUR {avgDonation.toFixed(0)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('dashboardSearchPlaceholder')}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <select
            value={sponsorshipFilter}
            onChange={(e) => setSponsorshipFilter(e.target.value as SponsorshipFilter)}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">{t('allSponsorships')}</option>
            <option value="sponsored">{t('sponsored')}</option>
            <option value="unsponsored">{t('unsponsored')}</option>
          </select>
          <input
            type="number"
            min="0"
            value={minDonation}
            onChange={(e) => setMinDonation(e.target.value)}
            placeholder={t('minDonation')}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            min="0"
            value={maxDonation}
            onChange={(e) => setMaxDonation(e.target.value)}
            placeholder={t('maxDonation')}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('child')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('locationEdu')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('sponsorInfo')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('donationAmount')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('age')}: {student.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{student.village}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.school}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.sponsorName ? (
                      <div className="text-sm text-gray-900 dark:text-gray-300">{student.sponsorName}</div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                        {t('unsponsored')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    EUR {(student.donationAmount ?? 0).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
              {t('noRecords')}
            </div>
          )}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {t('unsponsored')}: {unsponsoredStudents}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
