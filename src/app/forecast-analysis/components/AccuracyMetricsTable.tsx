'use client';

import React, { useState } from 'react';
import { ArrowUpDown, UploadCloud } from 'lucide-react';
import Link from 'next/link';

type SortKey = 'segment' | 'mape' | 'rmse' | 'r2' | 'ciWidth';

export default function AccuracyMetricsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('mape');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none transition-colors"
      style={{ color: sortKey === k ? 'var(--primary)' : 'var(--muted-foreground)' }}
      onClick={() => handleSort(k)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={11} />
      </div>
    </th>
  );

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <h2 className="text-base font-semibold text-foreground">Accuracy Metrics by Segment</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Run a forecast to see accuracy metrics
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              <SortHeader label="Segment" k="segment" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Model</th>
              <SortHeader label="MAPE" k="mape" />
              <SortHeader label="RMSE" k="rmse" />
              <SortHeader label="R²" k="r2" />
              <SortHeader label="CI Width" k="ciWidth" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Bias</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Trend</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
                  <p className="text-sm font-medium text-foreground mb-1">No accuracy data yet</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    No data yet — upload a file to get started
                  </p>
                  <Link href="/data-upload" className="btn-primary text-xs px-3 py-1.5 h-auto">
                    Upload Data
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}