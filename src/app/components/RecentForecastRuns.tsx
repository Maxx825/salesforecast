'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { Play, RefreshCw, Clock, Pin, Star } from 'lucide-react';
import Link from 'next/link';

// Backend integration point: replace with /api/forecast-runs?limit=6
const initialRuns = [
  { id: 'run-2026-041', model: 'Prophet', segments: 'All Regions', duration: '2m 14s', status: 'complete', mape: '6.2%', ts: 'Jul 28, 14:32', pinned: false },
  { id: 'run-2026-040', model: 'ARIMA', segments: 'LATAM only', duration: '48s', status: 'complete', mape: '11.8%', ts: 'Jul 27, 09:15', pinned: false },
  { id: 'run-2026-039', model: 'Prophet', segments: 'All Regions', duration: '—', status: 'error', mape: '—', ts: 'Jul 26, 17:01', pinned: false },
  { id: 'run-2026-038', model: 'Exp. Smooth', segments: 'EMEA', duration: '31s', status: 'complete', mape: '7.9%', ts: 'Jul 25, 11:44', pinned: false },
  { id: 'run-2026-037', model: 'Moving Avg', segments: 'NA + APAC', duration: '22s', status: 'stale', mape: '9.1%', ts: 'Jul 22, 08:30', pinned: false },
];

export default function RecentForecastRuns() {
  const [runs, setRuns] = useState(initialRuns);

  const togglePin = (id: string) => {
    setRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r))
    );
  };

  // Pinned runs first, then the rest
  const sortedRuns = [...runs].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Recent Forecast Runs</h2>
          {runs.some((r) => r.pinned) && (
            <span
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}
            >
              <Pin size={9} />
              {runs.filter((r) => r.pinned).length} pinned
            </span>
          )}
        </div>
        <Link
          href="/forecast-configuration"
          className="btn-primary text-xs px-3 py-1.5 h-auto"
        >
          <Play size={12} />
          New Run
        </Link>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {sortedRuns.map((run) => (
          <div
            key={run.id}
            className="flex items-start gap-3 p-3 rounded-lg transition-all duration-150 cursor-pointer group"
            style={{
              background: run.pinned ? 'var(--warning-bg)' : 'var(--muted)',
              border: run.pinned ? '1px solid rgba(217,119,6,0.2)' : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!run.pinned) e.currentTarget.style.background = 'var(--secondary)';
            }}
            onMouseLeave={(e) => {
              if (!run.pinned) e.currentTarget.style.background = 'var(--muted)';
            }}
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
                {run.pinned && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--warning)' }}>
                    <Star size={10} fill="currentColor" />
                    Pinned
                  </span>
                )}
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

            {/* Pin / Unpin button */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePin(run.id); }}
              title={run.pinned ? 'Unpin run' : 'Pin run'}
              className="p-1.5 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100"
              style={{
                color: run.pinned ? 'var(--warning)' : 'var(--muted-foreground)',
                background: run.pinned ? 'var(--warning-bg)' : 'transparent',
                opacity: run.pinned ? 1 : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--warning)';
                e.currentTarget.style.background = 'var(--warning-bg)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                if (!run.pinned) {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.opacity = '0';
                }
              }}
            >
              <Pin size={13} fill={run.pinned ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}