'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Clock, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// Backend integration point: replace with GET /api/forecast-runs?limit=8
const runs = [
  { id: 'run-2026-041', name: 'Q3 2026 All-Regions', model: 'Prophet', horizon: '12 wks', mape: '6.2%', status: 'complete', ts: 'Jul 28, 14:32', duration: '2m 14s' },
  { id: 'run-2026-040', name: 'LATAM ARIMA Test', model: 'ARIMA', horizon: '8 wks', mape: '11.8%', status: 'complete', ts: 'Jul 27, 09:15', duration: '48s' },
  { id: 'run-2026-039', name: 'Q3 All-Regions v2', model: 'Prophet', horizon: '12 wks', mape: '—', status: 'error', ts: 'Jul 26, 17:01', duration: '—' },
  { id: 'run-2026-038', name: 'EMEA Exp Smooth', model: 'Exp. Smooth', horizon: '6 wks', mape: '7.9%', status: 'complete', ts: 'Jul 25, 11:44', duration: '31s' },
  { id: 'run-2026-037', name: 'NA + APAC Baseline', model: 'Moving Avg', horizon: '4 wks', mape: '9.1%', status: 'stale', ts: 'Jul 22, 08:30', duration: '22s' },
  { id: 'run-2026-036', name: 'Q2 Backtest Prophet', model: 'Prophet', horizon: '13 wks', mape: '5.8%', status: 'complete', ts: 'Jul 18, 16:22', duration: '2m 41s' },
  { id: 'run-2026-035', name: 'Category Deep-Dive', model: 'Prophet', horizon: '12 wks', mape: '7.4%', status: 'complete', ts: 'Jul 15, 10:05', duration: '1m 58s' },
  { id: 'run-2026-034', name: 'India Pilot Run', model: 'Exp. Smooth', horizon: '8 wks', mape: '6.4%', status: 'stale', ts: 'Jul 10, 14:18', duration: '27s' },
];

export default function RunHistoryPanel() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Run History</h2>
        <Link href="/forecast-analysis" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
          View Analysis →
        </Link>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {runs.map((run) => (
          <div
            key={run.id}
            className="p-3 rounded-lg cursor-pointer transition-all duration-150"
            style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-xs font-semibold text-foreground truncate">{run.name}</p>
              <Badge variant={run.status as any}>{run.status}</Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {run.model}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{run.horizon}</span>
              {run.mape !== '—' && (
                <span className="text-xs font-mono font-semibold" style={{ color: parseFloat(run.mape) < 10 ? 'var(--positive)' : 'var(--warning)' }}>
                  MAPE {run.mape}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Clock size={10} />
                {run.ts}
              </span>
              {run.duration !== '—' && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <BarChart2 size={10} />
                  {run.duration}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}