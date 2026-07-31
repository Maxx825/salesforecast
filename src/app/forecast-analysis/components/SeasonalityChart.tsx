'use client';

import React, { useMemo } from 'react';
import { UploadCloud } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface ForecastPoint {
  week: string;
  predicted: number;
}

interface Props {
  data: ForecastPoint[];
}

export default function SeasonalityChart({ data }: Props) {
  // Derive a seasonality component: deviation of predicted from its own moving average
  const seasonality = React.useMemo(() => {
    if (!data || data.length < 4) return [];
    const window = 4;
    return data.map((d, i) => {
      const start = Math.max(0, i - Math.floor(window / 2));
      const end = Math.min(data.length, start + window);
      const avg = data.slice(start, end).reduce((s, x) => s + x.predicted, 0) / (end - start);
      return {
        week: d.week,
        seasonality: Math.round(d.predicted - avg),
      };
    });
  }, [data]);

  if (seasonality.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] text-center">
        <UploadCloud size={28} style={{ color: 'var(--muted-foreground)' }} className="mb-2 opacity-40" />
        <p className="text-xs font-medium text-foreground mb-1">No seasonality data</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    );
  }

  const formatK = (v: number) => {
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return `${v}`;
  };

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={seasonality} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            formatter={(v: number) => [`$${formatK(v)}`, 'Seasonal Effect']}
            contentStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="3 2" />
          <Line
            type="monotone"
            dataKey="seasonality"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}