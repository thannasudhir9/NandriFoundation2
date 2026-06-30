'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SponsorshipBarChartProps {
  data: { village: string; sponsored: number; unsponsored: number }[];
}

export function SponsorshipBarChart({ data }: SponsorshipBarChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Sponsorship by Village</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="village" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sponsored" fill="#16a34a" />
          <Bar dataKey="unsponsored" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
