'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const ResidualsChart = dynamic(() => import('./ResidualsChart'), { ssr: false, loading: () => <ChartSkeleton height="h-48" /> });
const SeasonalityChart = dynamic(() => import('./SeasonalityChart'), { ssr: false, loading: () => <ChartSkeleton height="h-48" /> });

export default function DiagnosticsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Residuals Distribution</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Prediction errors over time — should be centered around zero with no pattern
        </p>
        <ResidualsChart />
      </div>
      <div className="card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Seasonality Component</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Detected weekly seasonality pattern extracted by Prophet model
        </p>
        <SeasonalityChart />
      </div>
    </div>
  );
}