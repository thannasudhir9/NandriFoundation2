import { KpiSummary } from '../../lib/reporting/types';

interface KpiCardsProps {
  kpis: KpiSummary;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    { label: 'Students', value: kpis.totalStudents, color: 'text-gray-900 dark:text-white' },
    { label: 'Sponsored', value: kpis.sponsoredStudents, color: 'text-green-600 dark:text-green-400' },
    { label: 'Donations (EUR)', value: Math.round(kpis.donationTotal), color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg Donation', value: Math.round(kpis.donationAverage), color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Unsponsored', value: kpis.unsponsoredStudents, color: 'text-orange-500 dark:text-orange-400' },
    { label: 'Updates', value: kpis.updatesCount, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Villages', value: kpis.uniqueVillages, color: 'text-pink-600 dark:text-pink-400' },
    { label: 'Sponsors', value: kpis.uniqueSponsors, color: 'text-cyan-600 dark:text-cyan-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</div>
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
