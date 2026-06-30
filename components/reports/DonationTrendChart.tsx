'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DonationTrendPoint } from '../../lib/reporting/types';

interface DonationTrendChartProps {
  data: DonationTrendPoint[];
}

export function DonationTrendChart({ data }: DonationTrendChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Donation Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="donationTotal" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
