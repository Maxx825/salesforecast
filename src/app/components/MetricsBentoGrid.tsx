import React from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { DollarSign, Activity, Percent, BarChart2, Database } from 'lucide-react';

// Bento plan: 5 cards → grid-cols-4 → row 1: hero spans 2 cols + 2 regular, row 2: 3 regular spanning full
// Actually: 1 hero (col-span-2) + 4 regular = 6 slots in 4-col grid → row1: hero(2) + 2 regular, row2: 2 regular + 1 spanning 2 = clean
// Final: hero col-span-2, 4 singles → 2 rows of 4 cols total

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero — Projected Revenue */}
      <div className="col-span-2">
        <MetricCard
          label="Projected Revenue — Next 12 Weeks"
          value="₹4,827,340"
          subValue="Q3 2026 · Prophet model · 87% confidence"
          trend={11.4}
          trendLabel="vs. Q3 2025 actual"
          variant="hero"
          icon={<DollarSign size={16} style={{ color: 'var(--primary)' }} />}
          className="h-full"
        />
      </div>

      {/* MAPE */}
      <MetricCard
        label="Forecast Accuracy (MAPE)"
        value="6.2%"
        subValue="Last 8-week backtest"
        trend={-1.3}
        trendLabel="vs. previous run"
        variant="positive"
        icon={<Activity size={16} style={{ color: 'var(--positive)' }} />}
      />

      {/* Growth Rate */}
      <MetricCard
        label="MoM Growth Rate"
        value="+8.7%"
        subValue="Jul → Aug 2026"
        trend={8.7}
        trendLabel="month-over-month"
        variant="positive"
        icon={<Percent size={16} style={{ color: 'var(--positive)' }} />}
      />

      {/* Confidence Interval Width */}
      <MetricCard
        label="Avg. CI Width"
        value="±14.3%"
        subValue="Upper–lower band spread"
        variant="warning"
        alert="Wider than target ±10% — high volatility in APAC segment"
        icon={<BarChart2 size={16} style={{ color: 'var(--warning)' }} />}
      />

      {/* Data Coverage */}
      <MetricCard
        label="Data Coverage"
        value="91.4%"
        subValue="274 of 300 SKUs have ≥24 months data"
        trend={2.1}
        trendLabel="vs. last import"
        variant="default"
        icon={<Database size={16} style={{ color: 'var(--muted-foreground)' }} />}
      />
    </div>
  );
}