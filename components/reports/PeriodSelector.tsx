import { ReportPeriod } from '../../lib/reporting/types';

interface PeriodSelectorProps {
  value: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods: { value: ReportPeriod; label: string }[] = [
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'halfYearly', label: 'Half-yearly' },
    { value: 'annually', label: 'Annually' },
  ];

  return (
    <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            value === period.value
              ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
