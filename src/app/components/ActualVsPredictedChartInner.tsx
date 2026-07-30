'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useDatasets } from '@/contexts/DatasetContext';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,  } from 'recharts';

export default function ActualVsPredictedChartInner({ range }: { range: '6m' | '12m' | '18m' }) {
  const { latestForecast, isLoadingForecasts } = useDatasets();

  if (isLoadingForecasts) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3"
          style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading forecast data…</p>
      </div>
    );
  }

  if (!latestForecast?.forecastData) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center">
        <UploadCloud size={36} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
        <p className="text-sm font-medium text-foreground mb-1">No data yet</p>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
        <Link href="/data-upload" className="btn-primary text-xs px-3 py-1.5 h-auto">
          Upload Data
        </Link>
      </div>
    );
  }

  const rangeMap = { '6m': 26, '12m': 52, '18m': 78 };
  const weeksToShow = Math.min(rangeMap[range], latestForecast.forecastData.length);
  const chartData = latestForecast.forecastData.slice(0, weeksToShow);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          formatter={(value: any, name: string) => [`$${Number(value).toLocaleString()}`, name]}
        />
        <Area type="monotone" dataKey="upper" stroke="none" fill="url(#ciGradient)" />
        <Area type="monotone" dataKey="lower" stroke="none" fill="var(--card)" />
        <Line type="monotone" dataKey="actual" stroke="var(--positive)" strokeWidth={2} dot={false} name="Actual" />
        <Line type="monotone" dataKey="predicted" stroke="var(--primary)" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Predicted" />
      </AreaChart>
    </ResponsiveContainer>
  );
}