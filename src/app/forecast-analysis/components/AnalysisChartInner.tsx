'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface ForecastPoint {
  week: string;
  actual: number | null;
  predicted: number;
  lower: number;
  upper: number;
}

interface Props {
  data: ForecastPoint[];
}

function formatK(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-elevated p-3 text-xs space-y-1 min-w-[160px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        p.value != null && (
          <div key={p.name} className="flex justify-between gap-4">
            <span style={{ color: p.color ?? 'var(--muted-foreground)' }}>{p.name}</span>
            <span className="font-mono font-semibold text-foreground">{formatK(p.value)}</span>
          </div>
        )
      ))}
    </div>
  );
};

export default function AnalysisChartInner({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[360px] text-center">
        <UploadCloud size={36} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
        <p className="text-sm font-medium text-foreground mb-1">No forecast data yet</p>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
        <Link href="/data-upload" className="btn-primary text-xs px-3 py-1.5 h-auto">
          Upload Data
        </Link>
      </div>
    );
  }

  // Find the last week with actual data to draw a divider
  const lastActualIdx = [...data].reverse().findIndex((d) => d.actual != null);
  const dividerWeek = lastActualIdx >= 0 ? data[data.length - 1 - lastActualIdx]?.week : null;

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* CI band */}
          <Area
            dataKey="upper"
            stroke="none"
            fill="url(#ciGrad)"
            name="CI Upper"
            legendType="none"
            dot={false}
            activeDot={false}
          />
          <Area
            dataKey="lower"
            stroke="none"
            fill="var(--card)"
            name="CI Lower"
            legendType="none"
            dot={false}
            activeDot={false}
          />
          {/* Predicted line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="Predicted"
            connectNulls
          />
          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--foreground)"
            strokeWidth={2.5}
            dot={false}
            name="Actual"
            connectNulls
          />
          {dividerWeek && (
            <ReferenceLine
              x={dividerWeek}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 2"
              label={{ value: 'Forecast →', position: 'insideTopRight', fontSize: 10, fill: 'var(--muted-foreground)' }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}