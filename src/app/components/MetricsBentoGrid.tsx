import React from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { DollarSign, Activity, Percent, BarChart2, Database } from 'lucide-react';

const EMPTY_VALUE = '—';
const EMPTY_SUB = 'No data yet — upload a file to get started';

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero — Projected Revenue */}
      <div className="col-span-2">
        <MetricCard
          label="Projected Revenue — Next 12 Weeks"
          value={EMPTY_VALUE}
          subValue={EMPTY_SUB}
          variant="hero"
          icon={<DollarSign size={16} style={{ color: 'var(--primary)' }} />}
          className="h-full"
        />
      </div>

      {/* MAPE */}
      <MetricCard
        label="Forecast Accuracy (MAPE)"
        value={EMPTY_VALUE}
        subValue={EMPTY_SUB}
        variant="default"
        icon={<Activity size={16} style={{ color: 'var(--muted-foreground)' }} />}
      />

      {/* Growth Rate */}
      <MetricCard
        label="MoM Growth Rate"
        value={EMPTY_VALUE}
        subValue={EMPTY_SUB}
        variant="default"
        icon={<Percent size={16} style={{ color: 'var(--muted-foreground)' }} />}
      />

      {/* Confidence Interval Width */}
      <MetricCard
        label="Avg. CI Width"
        value={EMPTY_VALUE}
        subValue={EMPTY_SUB}
        variant="default"
        icon={<BarChart2 size={16} style={{ color: 'var(--muted-foreground)' }} />}
      />

      {/* Data Coverage */}
      <MetricCard
        label="Data Coverage"
        value={EMPTY_VALUE}
        subValue={EMPTY_SUB}
        variant="default"
        icon={<Database size={16} style={{ color: 'var(--muted-foreground)' }} />}
      />
    </div>
  );
}