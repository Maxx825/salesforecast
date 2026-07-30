'use client';

import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';

export default function ExportHistoryTable() {
  const [search, setSearch] = useState('');

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <h2 className="text-base font-semibold text-foreground">Export History</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            0 exports
          </p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Search exports…"
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            className="input-field pl-8 h-8 text-xs w-48"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
        <p className="text-sm font-medium text-foreground mb-1">No exports yet</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    </div>
  );
}