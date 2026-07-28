import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      className={`skeleton-pulse rounded-md ${height} ${width} ${className}`}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <Skeleton height="h-3" width="w-24" />
      <Skeleton height="h-8" width="w-32" />
      <Skeleton height="h-3" width="w-20" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={`skel-col-${i}`} className="px-4 py-3">
          <Skeleton height="h-4" width={i === 0 ? 'w-32' : 'w-20'} />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full rounded-lg skeleton-pulse`} />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={`skel-card-${i}`} />
        ))}
      </div>
      <ChartSkeleton height="h-80" />
    </div>
  );
}