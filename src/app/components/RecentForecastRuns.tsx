'use client';

import React, { useState } from 'react';
import { Play, UploadCloud, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useDatasets } from '@/contexts/DatasetContext';

export default function RecentForecastRuns() {
  const { forecastRuns, isLoadingForecasts } = useDatasets();

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Recent Forecast Runs</h2>
        </div>
        <Link
          href="/forecast-configuration"
          className="btn-primary text-xs px-3 py-1.5 h-auto"
        >
          <Play size={12} />
          New Run
        </Link>
      </div>
      {isLoadingForecasts ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading runs…</p>
        </div>
      ) : forecastRuns?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground mb-1">No forecast runs yet</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            No data yet — upload a file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
          {forecastRuns?.slice(0, 8)?.map((run) => (
            <div
              key={run?.id}
              className="p-3 rounded-lg"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{run?.runName}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {run?.model} · {run?.horizonWeeks}w horizon
                  </p>
                </div>
                {run?.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'var(--positive-bg)', color: 'var(--positive)' }}>
                    <CheckCircle2 size={10} />
                    Done
                  </span>
                ) : run?.status === 'running' ? (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'var(--info-bg)', color: 'var(--primary)' }}>
                    <RefreshCw size={10} className="animate-spin" />
                    Running
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                    <Clock size={10} />
                    Queued
                  </span>
                )}
              </div>
              {run?.projectedRevenue != null && (
                <p className="text-xs mt-1.5 font-mono" style={{ color: 'var(--positive)' }}>
                  ${(run?.projectedRevenue / 1_000_000)?.toFixed(2)}M projected · MAPE {run?.mape?.toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}