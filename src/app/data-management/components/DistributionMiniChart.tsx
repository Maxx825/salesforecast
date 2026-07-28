'use client';

import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export default function DistributionMiniChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ bucket: `B${i + 1}`, count: v }));
  const max = Math.max(...data);

  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={2}>
        <Tooltip
          formatter={(v: number) => [`${v.toFixed(1)}%`, 'Frequency']}
          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelStyle={{ display: 'none' }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={24}>
          {chartData.map((entry, index) => (
            <Cell
              key={`dist-cell-${index}`}
              fill="var(--primary)"
              fillOpacity={0.4 + (entry.count / max) * 0.6}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}