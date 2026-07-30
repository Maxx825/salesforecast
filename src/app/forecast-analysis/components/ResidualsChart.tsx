'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function ResidualsChart() {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] text-center">
      <UploadCloud size={28} style={{ color: 'var(--muted-foreground)' }} className="mb-2 opacity-40" />
      <p className="text-xs font-medium text-foreground mb-1">No residuals data</p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        No data yet — upload a file to get started
      </p>
    </div>
  );
}