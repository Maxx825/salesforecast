'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Play, RefreshCw, Clock } from 'lucide-react';
import Link from 'next/link';

// Backend integration point: replace with /api/forecast-runs?limit=6
const runs = [
  { id: 'run-2026-041', model: 'Prophet', segments: 'All Regions', duration: '2m 14s', status: 'complete', mape: '6.2%', ts: 'Jul 28, 14:32' },
  { id: 'run-2026-040', model: 'ARIMA', segments: 'LATAM only', duration: '48s', status: 'complete', mape: '11.8%', ts: 'Jul 27, 09:15' },
  { id: 'run-2026-039', model: 'Prophet', segments: 'All Regions', duration: '—', status: 'error', mape: '—', ts: 'Jul 26, 17:01' },
  { id: 'run-2026-038', model: 'Exp. Smooth', segments: 'EMEA', duration: '31s', status: 'complete', mape: '7.9%', ts: 'Jul 25, 11:44' },
  { id: 'run-2026-037', model: 'Moving Avg', segments: 'NA + APAC', duration: '22s', status: 'stale', mape: '9.1%', ts: 'Jul 22, 08:30' },
];

export default function RecentForecastRuns() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Recent Forecast Runs</h2>
        <Link
          href="/forecast-configuration"
          className="btn-primary text-xs px-3 py-1.5 h-auto"
        >
          <Play size={12} />
          New Run
        </Link>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-start gap-3 p-3 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ background: 'var(--muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--muted)')}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--card)' }}
            >
              {run.status === 'processing' ? (
                <RefreshCw size={14} style={{ color: 'var(--primary)' }} className="animate-spin" />
              ) : (
                <Play size={14} style={{ color: 'var(--muted-foreground)' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-semibold font-mono text-foreground">{run.id}</p>
                <Badge variant={run.status as any}>{run.status}</Badge>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {run.model} · {run.segments}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                  MAPE: <span style={{ color: run.mape === '—' ? 'var(--muted-foreground)' : 'var(--positive)' }}>{run.mape}</span>
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <Clock size={10} />
                  {run.ts}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}