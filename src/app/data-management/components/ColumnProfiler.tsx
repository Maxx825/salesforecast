'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const DistributionMiniChart = dynamic(() => import('./DistributionMiniChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height="h-16" />,
});

// Backend integration point: replace with GET /api/datasets/:id/column-profile
const columnProfiles = [
  { id: 'cp-date', name: 'date', type: 'Date', completeness: 100, unique: 1218, nulls: 0, min: 'Jan 1, 2023', max: 'Jun 30, 2026', distribution: [4,4,4,4,4,4,4,4,4,4,4,4] },
  { id: 'cp-product-id', name: 'product_id', type: 'String', completeness: 100, unique: 274, nulls: 0, min: 'ADD-0001', max: 'TRN-0099', distribution: [8,12,15,18,14,11,9,7,6,5,4,3] },
  { id: 'cp-product-name', name: 'product_name', type: 'String', completeness: 100, unique: 274, nulls: 0, min: '—', max: '—', distribution: [8,12,15,18,14,11,9,7,6,5,4,3] },
  { id: 'cp-category', name: 'category', type: 'String', completeness: 100, unique: 5, nulls: 0, min: 'Add-ons', max: 'Training', distribution: [22,18,20,24,16] },
  { id: 'cp-region', name: 'region', type: 'String', completeness: 99.4, unique: 6, nulls: 77, min: 'APAC', max: 'ROW', distribution: [30,22,18,14,12,4] },
  { id: 'cp-channel', name: 'channel', type: 'String', completeness: 100, unique: 4, nulls: 0, min: 'Direct Sales', max: 'Resellers', distribution: [38,28,22,12] },
  { id: 'cp-quantity', name: 'quantity', type: 'Integer', completeness: 100, unique: 892, nulls: 0, min: '1', max: '487', distribution: [35,28,18,10,5,2,1,0.5,0.3,0.2] },
  { id: 'cp-unit-price', name: 'unit_price', type: 'Decimal', completeness: 100, unique: 48, nulls: 0, min: '₹89.00', max: '₹12,400.00', distribution: [20,18,15,12,10,8,7,5,3,2] },
  { id: 'cp-revenue', name: 'revenue', type: 'Decimal', completeness: 99.9, unique: 11842, nulls: 14, min: '-₹2,400', max: '₹482,800', distribution: [30,25,18,12,7,4,2,1,0.7,0.3] },
  { id: 'cp-cost', name: 'cost', type: 'Decimal', completeness: 100, unique: 9840, nulls: 0, min: '₹31.50', max: '₹168,980', distribution: [32,26,18,11,7,3,2,0.8,0.5,0.2] },
  { id: 'cp-discount', name: 'discount', type: 'Decimal', completeness: 100, unique: 12, nulls: 0, min: '0%', max: '25%', distribution: [42,0,18,0,15,0,12,0,8,5] },
  { id: 'cp-customer-id', name: 'customer_id', type: 'String', completeness: 100, unique: 2840, nulls: 0, min: 'C-00001', max: 'C-04218', distribution: [10,11,10,9,9,10,11,10,10,10] },
];

export default function ColumnProfiler({ datasetId }: { datasetId: string | null }) {
  const [selectedCol, setSelectedCol] = useState<string>('cp-revenue');

  const selected = columnProfiles.find((c) => c.id === selectedCol);

  return (
    <div className="flex gap-4" style={{ minHeight: 400 }}>
      {/* Column List */}
      <div className="w-48 shrink-0 overflow-y-auto scrollbar-thin space-y-0.5">
        {columnProfiles.map((col) => (
          <button
            key={col.id}
            onClick={() => setSelectedCol(col.id)}
            className="w-full text-left px-3 py-2 rounded-lg transition-all duration-150 text-xs"
            style={{
              background: selectedCol === col.id ? 'var(--info-bg)' : 'transparent',
              color: selectedCol === col.id ? 'var(--primary)' : 'var(--muted-foreground)',
              border: `1px solid ${selectedCol === col.id ? 'rgba(59,111,212,0.2)' : 'transparent'}`,
            }}
          >
            <p className="font-mono font-semibold">{col.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{col.type}</p>
          </button>
        ))}
      </div>

      {/* Profile Detail */}
      {selected && (
        <div className="flex-1 space-y-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-mono font-semibold text-foreground">{selected.name}</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {selected.type}
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Completeness', value: `${selected.completeness}%`, good: selected.completeness >= 99 },
              { label: 'Null Values', value: selected.nulls.toLocaleString(), good: selected.nulls === 0 },
              { label: 'Unique Values', value: selected.unique.toLocaleString(), good: true },
              { label: 'Min Value', value: selected.min, good: true },
              { label: 'Max Value', value: selected.max, good: true },
              { label: 'Dataset ID', value: datasetId || '—', good: true },
            ].map((stat) => (
              <div
                key={`prof-stat-${stat.label}`}
                className="p-3 rounded-lg"
                style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {stat.label}
                </p>
                <p
                  className="text-sm font-semibold font-mono"
                  style={{ color: stat.label === 'Completeness' && !stat.good ? 'var(--warning)' : 'var(--foreground)' }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Completeness bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: 'var(--muted-foreground)' }}>Completeness</span>
              <span className="font-mono font-semibold" style={{
                color: selected.completeness >= 99 ? 'var(--positive)' : selected.completeness >= 95 ? 'var(--warning)' : 'var(--negative)'
              }}>
                {selected.completeness}%
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'var(--muted)' }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${selected.completeness}%`,
                  background: selected.completeness >= 99 ? 'var(--positive)' : selected.completeness >= 95 ? 'var(--warning)' : 'var(--negative)',
                }}
              />
            </div>
          </div>

          {/* Value distribution */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Value Distribution
            </p>
            <DistributionMiniChart data={selected.distribution} />
          </div>
        </div>
      )}
    </div>
  );
}