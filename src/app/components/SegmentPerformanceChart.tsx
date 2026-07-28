'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const SegmentChartInner = dynamic(
  () => import('./SegmentChartInner'),
  { ssr: false, loading: () => <ChartSkeleton height="h-56" /> }
);

const segments = ['Region', 'Channel', 'Category'];

export default function SegmentPerformanceChart() {
  const [segment, setSegment] = useState('Region');

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Segment Performance vs. Target</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Forecasted revenue by {segment?.toLowerCase()} · Q3 2026
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
          {segments?.map((s) => (
            <button
              key={`seg-${s}`}
              onClick={() => setSegment(s)}
              className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150"
              style={{
                background: segment === s ? 'var(--card)' : 'transparent',
                color: segment === s ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <SegmentChartInner segment={segment} />
    </div>
  );
}