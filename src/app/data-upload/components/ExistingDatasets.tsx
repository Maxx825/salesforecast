'use client';

import React from 'react';
import { Database, UploadCloud, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useDatasets } from '@/contexts/DatasetContext';

function StatusBadge({ status }: { status: string }) {
  if (status === 'ready') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: 'var(--positive-bg)', color: 'var(--positive)' }}>
        <CheckCircle2 size={10} />
        Ready
      </span>
    );
  }
  if (status === 'validating') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
        <Clock size={10} />
        Validating
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
      <AlertCircle size={10} />
      {status}
    </span>
  );
}

export default function ExistingDatasets() {
  const { datasets, isLoadingDatasets } = useDatasets();

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Existing Datasets</h2>
        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoadingDatasets ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3"
            style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Loading datasets…</p>
        </div>
      ) : datasets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <UploadCloud size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground mb-1">No datasets yet</p>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            No data yet — upload a file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
          {datasets.map((ds) => (
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
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {ds.rowCount.toLocaleString()} rows · {ds.fileSize}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(ds.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={ds.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}