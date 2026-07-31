'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { Download, ZoomIn } from 'lucide-react';

const AnalysisChartInner = dynamic(
  () => import('./AnalysisChartInner'),
  { ssr: false, loading: () => <ChartSkeleton height="h-96" /> }
);

interface ForecastPoint {
  week: string;
  actual: number | null;
  predicted: number;
  lower: number;
  upper: number;
}

interface Props {
  data: ForecastPoint[];
  runName?: string;
  model?: string;
}

export default function AnalysisMainChart({ data, runName, model }: Props) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Actual vs. Predicted — Full Detail View</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {runName ? `${runName}${model ? ` · ${model}` : ''}` : 'Upload data and run a forecast to see the full detail view'}
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
          { color: 'var(--primary)', label: `Forecast${model ? ` (${model})` : ''}`, type: 'dashed' },
          { color: 'rgba(59,111,212,0.2)', label: 'CI Band', type: 'area' },
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
      <AnalysisChartInner data={data ?? []} />
    </div>
  );
}