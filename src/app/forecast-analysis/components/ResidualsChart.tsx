'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

// Backend integration point: replace with residuals from forecast run series
const residuals = [
  { month: 'Jan 25', residual: 6000 },
  { month: 'Feb 25', residual: -8000 },
  { month: 'Mar 25', residual: -6000 },
  { month: 'Apr 25', residual: -10000 },
  { month: 'May 25', residual: -7000 },
  { month: 'Jun 25', residual: -7000 },
  { month: 'Jul 25', residual: -17000 },
  { month: 'Aug 25', residual: -10000 },
  { month: 'Sep 25', residual: 7000 },
  { month: 'Oct 25', residual: 9000 },
  { month: 'Nov 25', residual: 13000 },
  { month: 'Dec 25', residual: 14000 },
  { month: 'Jan 26', residual: -11000 },
  { month: 'Feb 26', residual: -17000 },
  { month: 'Mar 26', residual: -3000 },
  { month: 'Apr 26', residual: 4000 },
  { month: 'May 26', residual: 7000 },
];

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

export default function ResidualsChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={residuals} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={10}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} interval={2} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={44} />
        <Tooltip
          formatter={(v: number) => [fmt(v), 'Residual']}
          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: 'var(--foreground)' }}
        />
        <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
        <Bar dataKey="residual" radius={[2, 2, 0, 0]}>
          {residuals.map((entry, index) => (
            <Cell key={`resid-${index}`} fill={entry.residual >= 0 ? 'var(--positive)' : 'var(--negative)'} fillOpacity={0.75} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}