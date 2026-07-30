'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function SegmentChartInner({ segment }: { segment: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[220px] text-center">
      <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
      <p className="text-sm font-medium text-foreground mb-1">No segment data yet</p>
      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
        No data yet — upload a file to get started
      </p>
      <Link href="/data-upload" className="btn-primary text-xs px-3 py-1.5 h-auto">
        Upload Data
      </Link>
    </div>
  );
}