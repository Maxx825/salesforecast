'use client';

import React from 'react';
import { Database, UploadCloud } from 'lucide-react';


const datasets: any[] = [];

export default function ExistingDatasets() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Existing Datasets</h2>
        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          {datasets.length} datasets
        </span>
      </div>

      {datasets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground mb-1">No datasets yet</p>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            No data yet — upload a file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
          {datasets.map((ds: any) => (
            <div
              key={ds.id}
              className="p-3 rounded-lg transition-all duration-150 cursor-pointer"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <Database size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{ds.name}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ds.id}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}