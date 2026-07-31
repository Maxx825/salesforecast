'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function RunHistoryPanel() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Run History</h2>
        <Link href="/forecast-analysis" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
          View Analysis →
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
        <Clock size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-50" />
        <p className="text-sm font-medium text-foreground mb-1">No runs yet</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    </div>
  );
}