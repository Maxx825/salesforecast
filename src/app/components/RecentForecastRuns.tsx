'use client';

import React, { useState } from 'react';

import { Play, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function RecentForecastRuns() {
  const runs: any[] = [];

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Recent Forecast Runs</h2>
        </div>
        <Link
          href="/forecast-configuration"
          className="btn-primary text-xs px-3 py-1.5 h-auto"
        >
          <Play size={12} />
          New Run
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
        <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-50" />
        <p className="text-sm font-medium text-foreground mb-1">No forecast runs yet</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    </div>
  );
}