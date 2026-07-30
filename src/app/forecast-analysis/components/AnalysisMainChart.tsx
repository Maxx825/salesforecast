'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { Download, ZoomIn } from 'lucide-react';

const AnalysisChartInner = dynamic(
  () => import('./AnalysisChartInner'),
  { ssr: false, loading: () => <ChartSkeleton height="h-96" /> }
);

export default function AnalysisMainChart() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Actual vs. Predicted — Full Detail View</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            18-month window · Prophet model · 80% confidence interval · All segments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed((v) => !v)}
            className="btn-ghost text-xs gap-1.5"
          >
            <ZoomIn size={14} />
            {zoomed ? 'Zoom Out' : 'Zoom In'}
          </button>
          <button className="btn-secondary text-xs gap-1.5">
            <Download size={14} />
            Export Chart
          </button>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { color: 'var(--foreground)', label: 'Actual Revenue', type: 'solid' },
          { color: 'var(--primary)', label: 'Forecast (Prophet)', type: 'dashed' },
          { color: 'var(--accent)', label: 'Trend Component', type: 'solid' },
          { color: 'rgba(59,111,212,0.2)', label: '80% CI Band', type: 'area' },
        ]?.map((item) => (
          <div key={`legend-a-${item?.label}`} className="flex items-center gap-2">
            {item?.type === 'area' ? (
              <div className="w-5 h-3 rounded" style={{ background: item?.color }} />
            ) : (
              <div
                className="w-5 h-0.5"
                style={{
                  background: item?.color,
                  borderTop: item?.type === 'dashed' ? '2px dashed' : 'none',
                  height: item?.type === 'dashed' ? '0' : '2px',
                  borderColor: item?.color,
                }}
              />
            )}
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item?.label}</span>
          </div>
        ))}
      </div>
      <AnalysisChartInner />
      {/* Inline stats below chart */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { label: 'MAPE', value: '6.2%', good: true },
          { label: 'RMSE', value: '₹28,400', good: true },
          { label: 'R²', value: '0.934', good: true },
          { label: 'Avg CI Width', value: '±14.3%', good: false },
        ]?.map((stat) => (
          <div key={`stat-${stat?.label}`} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
              {stat?.label}
            </p>
            <p
              className="text-lg font-bold font-mono tabular-nums"
              style={{ color: stat?.good ? 'var(--positive)' : 'var(--warning)' }}
            >
              {stat?.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}