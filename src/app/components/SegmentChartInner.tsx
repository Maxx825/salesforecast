'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,  } from 'recharts';

// Backend integration point: replace with segment forecast API call
const segmentData: Record<string, Array<{ name: string; forecast: number; target: number; variance: number }>> = {
  Region: [
    { name: 'North America', forecast: 1842000, target: 1700000, variance: 8.4 },
    { name: 'EMEA', forecast: 1124000, target: 1200000, variance: -6.3 },
    { name: 'APAC', forecast: 891000, target: 1050000, variance: -15.1 },
    { name: 'LATAM', forecast: 612000, target: 580000, variance: 5.5 },
    { name: 'India', forecast: 358000, target: 340000, variance: 5.3 },
  ],
  Channel: [
    { name: 'Direct Sales', forecast: 2180000, target: 2000000, variance: 9.0 },
    { name: 'Partner Network', forecast: 1340000, target: 1400000, variance: -4.3 },
    { name: 'E-Commerce', forecast: 782000, target: 750000, variance: 4.3 },
    { name: 'Resellers', forecast: 525000, target: 600000, variance: -12.5 },
  ],
  Category: [
    { name: 'Enterprise Suite', forecast: 1950000, target: 1800000, variance: 8.3 },
    { name: 'SMB Plans', forecast: 1120000, target: 1150000, variance: -2.6 },
    { name: 'Add-ons', forecast: 842000, target: 800000, variance: 5.3 },
    { name: 'Professional Svcs', forecast: 615000, target: 700000, variance: -12.1 },
    { name: 'Training', forecast: 300000, target: 280000, variance: 7.1 },
  ],
};

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-lg p-3 text-xs space-y-1 shadow-xl"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="font-semibold text-foreground">{label}</p>
      <div className="flex justify-between gap-4">
        <span style={{ color: 'var(--muted-foreground)' }}>Forecast</span>
        <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>{fmt(d?.forecast)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span style={{ color: 'var(--muted-foreground)' }}>Target</span>
        <span className="font-mono font-semibold" style={{ color: 'var(--muted-foreground)' }}>{fmt(d?.target)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span style={{ color: 'var(--muted-foreground)' }}>Variance</span>
        <span
          className="font-mono font-semibold"
          style={{ color: d?.variance >= 0 ? 'var(--positive)' : 'var(--negative)' }}
        >
          {d?.variance >= 0 ? '+' : ''}{d?.variance}%
        </span>
      </div>
    </div>
  );
};

export default function SegmentChartInner({ segment }: { segment: string }) {
  const data = segmentData[segment] || [];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={fmt}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="forecast" name="Forecast" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-seg-${index}`}
              fill={entry.variance >= 0 ? 'var(--primary)' : 'var(--negative)'}
              fillOpacity={entry.variance >= 0 ? 0.85 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}