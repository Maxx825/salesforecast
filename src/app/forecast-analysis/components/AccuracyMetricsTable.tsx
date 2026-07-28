'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

// Backend integration point: replace with GET /api/forecast-runs/run-2026-041/accuracy-by-segment
const metricsData = [
  { id: 'seg-001', segment: 'North America', model: 'Prophet', mape: 4.8, rmse: 18200, r2: 0.961, ciWidth: 11.2, bias: -0.4, status: 'complete', trend: 'up' },
  { id: 'seg-002', segment: 'EMEA', model: 'Prophet', mape: 7.1, rmse: 24600, r2: 0.928, ciWidth: 15.8, bias: 1.2, status: 'complete', trend: 'down' },
  { id: 'seg-003', segment: 'APAC', model: 'Prophet', mape: 14.2, rmse: 41300, r2: 0.847, ciWidth: 22.4, bias: 3.8, status: 'warning', trend: 'down' },
  { id: 'seg-004', segment: 'LATAM', model: 'ARIMA', mape: 11.8, rmse: 31800, r2: 0.882, ciWidth: 18.6, bias: -1.1, status: 'warning', trend: 'up' },
  { id: 'seg-005', segment: 'India', model: 'Prophet', mape: 6.4, rmse: 19400, r2: 0.944, ciWidth: 13.1, bias: 0.7, status: 'complete', trend: 'up' },
  { id: 'seg-006', segment: 'Enterprise Suite', model: 'Prophet', mape: 5.2, rmse: 22100, r2: 0.957, ciWidth: 12.4, bias: -0.2, status: 'complete', trend: 'up' },
  { id: 'seg-007', segment: 'SMB Plans', model: 'Prophet', mape: 8.3, rmse: 27400, r2: 0.912, ciWidth: 16.9, bias: 2.1, status: 'complete', trend: 'down' },
  { id: 'seg-008', segment: 'Add-ons', model: 'Exp. Smooth', mape: 9.7, rmse: 18900, r2: 0.901, ciWidth: 19.3, bias: 1.4, status: 'complete', trend: 'up' },
  { id: 'seg-009', segment: 'Professional Svcs', model: 'Prophet', mape: 13.1, rmse: 38200, r2: 0.861, ciWidth: 20.8, bias: -2.9, status: 'warning', trend: 'down' },
  { id: 'seg-010', segment: 'Training', model: 'Moving Avg', mape: 7.8, rmse: 14200, r2: 0.919, ciWidth: 14.6, bias: 0.3, status: 'complete', trend: 'up' },
];

type SortKey = 'segment' | 'mape' | 'rmse' | 'r2' | 'ciWidth';

export default function AccuracyMetricsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('mape');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...metricsData].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string' && typeof bv === 'string')
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

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
            10 segments · run-2026-041 · Click column headers to sort
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--positive)' }} />
            MAPE &lt; 10%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--warning)' }} />
            MAPE ≥ 10%
          </span>
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
            {sorted.map((row, i) => (
              <tr
                key={row.id}
                className="transition-colors duration-100"
                style={{
                  background: i % 2 === 0 ? 'var(--card)' : 'var(--secondary)',
                  borderBottom: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'var(--card)' : 'var(--secondary)')}
              >
                <td className="px-4 py-3 font-semibold text-foreground">{row.segment}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {row.model}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono font-semibold tabular-nums text-sm"
                    style={{ color: row.mape < 10 ? 'var(--positive)' : row.mape < 14 ? 'var(--warning)' : 'var(--negative)' }}
                  >
                    {row.mape}%
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-sm" style={{ color: 'var(--foreground)' }}>
                  ₹{(row.rmse / 1000).toFixed(1)}K
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono font-semibold tabular-nums text-sm"
                    style={{ color: row.r2 >= 0.93 ? 'var(--positive)' : row.r2 >= 0.88 ? 'var(--warning)' : 'var(--negative)' }}
                  >
                    {row.r2.toFixed(3)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-sm" style={{ color: row.ciWidth > 18 ? 'var(--warning)' : 'var(--foreground)' }}>
                  ±{row.ciWidth}%
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-sm"
                  style={{ color: Math.abs(row.bias) < 2 ? 'var(--positive)' : 'var(--warning)' }}>
                  {row.bias > 0 ? '+' : ''}{row.bias}%
                </td>
                <td className="px-4 py-3">
                  {row.trend === 'up' ? (
                    <TrendingUp size={16} style={{ color: 'var(--positive)' }} />
                  ) : (
                    <TrendingDown size={16} style={{ color: 'var(--negative)' }} />
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={row.status as any} dot>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}