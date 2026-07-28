'use client';

import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Backend integration point: replace with GET /api/forecast-runs/run-2026-041/series
const data = [
  { month: 'Jan 25', actual: 312000, predicted: 318000, upper: 352000, lower: 284000, trend: 308000 },
  { month: 'Feb 25', actual: 287000, predicted: 295000, upper: 329000, lower: 261000, trend: 314000 },
  { month: 'Mar 25', actual: 341000, predicted: 335000, upper: 371000, lower: 299000, trend: 320000 },
  { month: 'Apr 25', actual: 368000, predicted: 358000, upper: 396000, lower: 320000, trend: 326000 },
  { month: 'May 25', actual: 392000, predicted: 385000, upper: 425000, lower: 345000, trend: 332000 },
  { month: 'Jun 25', actual: 415000, predicted: 408000, upper: 450000, lower: 366000, trend: 338000 },
  { month: 'Jul 25', actual: 378000, predicted: 395000, upper: 436000, lower: 354000, trend: 344000 },
  { month: 'Aug 25', actual: 402000, predicted: 412000, upper: 455000, lower: 369000, trend: 350000 },
  { month: 'Sep 25', actual: 445000, predicted: 438000, upper: 483000, lower: 393000, trend: 356000 },
  { month: 'Oct 25', actual: 471000, predicted: 462000, upper: 509000, lower: 415000, trend: 362000 },
  { month: 'Nov 25', actual: 518000, predicted: 505000, upper: 556000, lower: 454000, trend: 368000 },
  { month: 'Dec 25', actual: 562000, predicted: 548000, upper: 603000, lower: 493000, trend: 374000 },
  { month: 'Jan 26', actual: 421000, predicted: 432000, upper: 476000, lower: 388000, trend: 380000 },
  { month: 'Feb 26', actual: 398000, predicted: 415000, upper: 458000, lower: 372000, trend: 386000 },
  { month: 'Mar 26', actual: 448000, predicted: 451000, upper: 497000, lower: 405000, trend: 392000 },
  { month: 'Apr 26', actual: 472000, predicted: 468000, upper: 516000, lower: 420000, trend: 398000 },
  { month: 'May 26', actual: 495000, predicted: 488000, upper: 538000, lower: 438000, trend: 404000 },
  { month: 'Jun 26', actual: null, predicted: 512000, upper: 565000, lower: 459000, trend: 410000 },
  { month: 'Jul 26', actual: null, predicted: 534000, upper: 589000, lower: 479000, trend: 416000 },
  { month: 'Aug 26', actual: null, predicted: 558000, upper: 615000, lower: 501000, trend: 422000 },
];

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs space-y-1.5 shadow-xl"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: 180 }}>
      <p className="font-semibold text-foreground border-b pb-1.5 mb-1.5" style={{ borderColor: 'var(--border)' }}>{label}</p>
      {payload.filter((p: any) => p.value !== null && p.value !== undefined && p.name !== 'upper' && p.name !== 'lower').map((p: any) => (
        <div key={`tt-${p.name}`} className="flex justify-between gap-6">
          <span style={{ color: 'var(--muted-foreground)' }} className="capitalize">{p.name}</span>
          <span className="font-mono font-semibold tabular-nums" style={{ color: p.color }}>{fmt(p.value)}</span>
        </div>
      ))}
      {payload.find((p: any) => p.name === 'upper') && (
        <div className="flex justify-between gap-6 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted-foreground)' }}>CI Range</span>
          <span className="font-mono font-semibold tabular-nums" style={{ color: 'var(--primary)' }}>
            {fmt(payload.find((p: any) => p.name === 'lower')?.value)} – {fmt(payload.find((p: any) => p.name === 'upper')?.value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default function AnalysisChartInner() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ciAnalysisGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={fmt}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x="Jun 26" stroke="var(--border)" strokeDasharray="4 4"
          label={{ value: 'Forecast start', fill: 'var(--muted-foreground)', fontSize: 10, position: 'insideTopLeft' }} />
        <Area dataKey="upper" stroke="none" fill="url(#ciAnalysisGrad)" fillOpacity={1} name="upper" />
        <Area dataKey="lower" stroke="none" fill="var(--background)" fillOpacity={1} name="lower" />
        <Line dataKey="trend" stroke="var(--accent)" strokeWidth={1.5} dot={false} strokeDasharray="2 4" name="trend" connectNulls />
        <Line dataKey="predicted" stroke="var(--primary)" strokeWidth={2} dot={false} strokeDasharray="5 3" name="predicted" connectNulls />
        <Line dataKey="actual" stroke="var(--foreground)" strokeWidth={2.5}
          dot={{ fill: 'var(--foreground)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }} name="actual" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}