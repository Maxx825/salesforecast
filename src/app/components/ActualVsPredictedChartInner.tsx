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

// Mock data: 18 months of actual + predicted with CI bands
// Backend integration point: replace with ForecastRun.series API response
const allData = [
  { month: 'Jan 25', actual: 312000, predicted: 318000, upper: 348000, lower: 288000 },
  { month: 'Feb 25', actual: 287000, predicted: 295000, upper: 325000, lower: 265000 },
  { month: 'Mar 25', actual: 341000, predicted: 335000, upper: 368000, lower: 302000 },
  { month: 'Apr 25', actual: 368000, predicted: 358000, upper: 392000, lower: 324000 },
  { month: 'May 25', actual: 392000, predicted: 385000, upper: 421000, lower: 349000 },
  { month: 'Jun 25', actual: 415000, predicted: 408000, upper: 446000, lower: 370000 },
  { month: 'Jul 25', actual: 378000, predicted: 395000, upper: 432000, lower: 358000 },
  { month: 'Aug 25', actual: 402000, predicted: 412000, upper: 451000, lower: 373000 },
  { month: 'Sep 25', actual: 445000, predicted: 438000, upper: 479000, lower: 397000 },
  { month: 'Oct 25', actual: 471000, predicted: 462000, upper: 505000, lower: 419000 },
  { month: 'Nov 25', actual: 518000, predicted: 505000, upper: 552000, lower: 458000 },
  { month: 'Dec 25', actual: 562000, predicted: 548000, upper: 598000, lower: 498000 },
  { month: 'Jan 26', actual: 421000, predicted: 432000, upper: 475000, lower: 389000 },
  { month: 'Feb 26', actual: 398000, predicted: 415000, upper: 456000, lower: 374000 },
  { month: 'Mar 26', actual: 448000, predicted: 451000, upper: 495000, lower: 407000 },
  { month: 'Apr 26', actual: 472000, predicted: 468000, upper: 514000, lower: 422000 },
  { month: 'May 26', actual: 495000, predicted: 488000, upper: 536000, lower: 440000 },
  { month: 'Jun 26', actual: null, predicted: 512000, upper: 563000, lower: 461000 },
];

const rangeMap = { '6m': 6, '12m': 12, '18m': 18 };

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs space-y-1.5 shadow-xl"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: 160 }}>
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        p.value !== null && p.value !== undefined && (
          <div key={`tooltip-${p.name}`} className="flex justify-between gap-4">
            <span style={{ color: 'var(--muted-foreground)' }}>{p.name}</span>
            <span className="font-semibold font-mono tabular-nums" style={{ color: p.color }}>{fmt(p.value)}</span>
          </div>
        )
      ))}
    </div>
  );
};

export default function ActualVsPredictedChartInner({ range }: { range: '6m' | '12m' | '18m' }) {
  const data = allData.slice(-rangeMap[range]);
  const forecastStart = data.findIndex((d) => d.actual === null);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
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
        {forecastStart >= 0 && (
          <ReferenceLine
            x={data[forecastStart]?.month}
            stroke="var(--border)"
            strokeDasharray="4 4"
            label={{ value: 'Forecast →', fill: 'var(--muted-foreground)', fontSize: 10, position: 'top' }}
          />
        )}
        {/* CI Band */}
        <Area dataKey="upper" stroke="none" fill="url(#ciGradient)" fillOpacity={1} legendType="none" name="Upper CI" />
        <Area dataKey="lower" stroke="none" fill="var(--background)" fillOpacity={1} legendType="none" name="Lower CI" />
        {/* Predicted */}
        <Line
          dataKey="predicted"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 3"
          name="Predicted"
          connectNulls
        />
        {/* Actual */}
        <Line
          dataKey="actual"
          stroke="var(--foreground)"
          strokeWidth={2.5}
          dot={{ fill: 'var(--foreground)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--foreground)' }}
          name="Actual"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}