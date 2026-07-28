'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Backend integration point: replace with seasonality decomposition from Prophet
const seasonality = [
  { week: 'W1', effect: 0.12 },
  { week: 'W2', effect: 0.08 },
  { week: 'W3', effect: -0.04 },
  { week: 'W4', effect: -0.11 },
  { week: 'W5', effect: 0.18 },
  { week: 'W6', effect: 0.22 },
  { week: 'W7', effect: 0.09 },
  { week: 'W8', effect: -0.06 },
  { week: 'W9', effect: -0.14 },
  { week: 'W10', effect: -0.08 },
  { week: 'W11', effect: 0.14 },
  { week: 'W12', effect: 0.31 },
  { week: 'W13', effect: 0.26 },
];

export default function SeasonalityChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={seasonality} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Seasonal Effect']}
          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: 'var(--foreground)' }}
        />
        <Line dataKey="effect" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} type="monotone" />
      </LineChart>
    </ResponsiveContainer>
  );
}