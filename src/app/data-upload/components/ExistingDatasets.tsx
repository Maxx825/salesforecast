'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Database, MoreHorizontal } from 'lucide-react';

// Backend integration point: replace with GET /api/datasets
const datasets = [
  { id: 'ds-2026-046', name: 'Q2 2026 Actuals', rows: 12840, dateRange: 'Apr–Jun 2026', uploadedBy: 'Priya Sharma', status: 'active', quality: 98 },
  { id: 'ds-2026-044', name: 'Q1 2026 Actuals', rows: 11920, dateRange: 'Jan–Mar 2026', uploadedBy: 'Marcus Rivera', status: 'active', quality: 96 },
  { id: 'ds-2025-038', name: 'FY 2025 Full Year', rows: 48310, dateRange: 'Jan–Dec 2025', uploadedBy: 'Keiko Tanaka', status: 'active', quality: 99 },
  { id: 'ds-2025-021', name: 'H1 2025 Actuals', rows: 23140, dateRange: 'Jan–Jun 2025', uploadedBy: 'Marcus Rivera', status: 'stale', quality: 94 },
  { id: 'ds-2024-009', name: 'FY 2024 Archive', rows: 45880, dateRange: 'Jan–Dec 2024', uploadedBy: 'Lena Hoffmann', status: 'neutral', quality: 91 },
];

export default function ExistingDatasets() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Existing Datasets</h2>
        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          {datasets.length} datasets
        </span>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            className="p-3 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <Database size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{ds.name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ds.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={ds.status as any}>{ds.status}</Badge>
                <button className="btn-ghost h-6 w-6 p-0 justify-center">
                  <MoreHorizontal size={13} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                {ds.rows.toLocaleString()} rows
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ds.dateRange}</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>by {ds.uploadedBy}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--muted)' }}>
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${ds.quality}%`,
                    background: ds.quality >= 97 ? 'var(--positive)' : ds.quality >= 93 ? 'var(--warning)' : 'var(--negative)',
                  }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                {ds.quality}% quality
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}