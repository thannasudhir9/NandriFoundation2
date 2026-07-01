import { useMemo, useState } from 'react';
import { Sponsor } from '../types';
import { Search, Mail, HandCoins, Users } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SponsorsListProps {
  sponsors: Sponsor[];
}

export function SponsorsList({ sponsors }: SponsorsListProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredSponsors = useMemo(
    () =>
      sponsors.filter((sponsor) => {
        const q = search.toLowerCase();
        return (
          sponsor.name.toLowerCase().includes(q) ||
          sponsor.email.toLowerCase().includes(q) ||
          (sponsor.country || '').toLowerCase().includes(q)
        );
      }),
    [search, sponsors],
  );

  const totalDonation = filteredSponsors.reduce((sum, sponsor) => sum + sponsor.donationTotal, 0);
  const totalChildren = filteredSponsors.reduce((sum, sponsor) => sum + sponsor.sponsoredStudentCount, 0);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('sponsors')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('sponsorsSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('sponsors')}</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{filteredSponsors.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('totalDonation')}</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">EUR {totalDonation.toFixed(0)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 col-span-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('sponsoredChildren')}</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalChildren}</div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
          placeholder={t('sponsorSearchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{sponsor.name}</h3>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{sponsor.email}</span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {sponsor.sponsoredStudentCount} {t('students')}
              </span>
              <span className="inline-flex items-center gap-1">
                <HandCoins className="w-3.5 h-3.5 text-green-500" />
                EUR {sponsor.donationTotal.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
        {filteredSponsors.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>{t('noSponsors')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
