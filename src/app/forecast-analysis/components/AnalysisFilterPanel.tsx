'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import { Filter, RotateCcw } from 'lucide-react';
import { useDatasets } from '@/contexts/DatasetContext';

const periods = ['Monthly', 'Weekly', 'Quarterly'];

interface Props {
  selectedRunId: string;
  onSelectRun: (id: string) => void;
}

export default function AnalysisFilterPanel({ selectedRunId, onSelectRun }: Props) {
  const { forecastRuns, isLoadingForecasts } = useDatasets();
  const completedRuns = forecastRuns.filter((r) => r.status === 'completed');

  const [period, setPeriod] = useState('Monthly');
  const [horizon, setHorizon] = useState(12);
  const [showCI, setShowCI] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showSeasonality, setShowSeasonality] = useState(false);

  const reset = () => {
    setPeriod('Monthly');
    setHorizon(12);
    setShowCI(true);
    setShowActual(true);
    setShowSeasonality(false);
    if (completedRuns.length > 0) onSelectRun(completedRuns[0].id);
  };

  return (
    <div className="card-elevated p-5 space-y-5 sticky top-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={15} style={{ color: 'var(--primary)' }} />
          <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        </div>
        <button onClick={reset} className="btn-ghost text-xs h-7 px-2 gap-1">
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Forecast Run */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Forecast Run
        </label>
        {isLoadingForecasts ? (
          <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>Loading…</p>
        ) : completedRuns.length === 0 ? (
          <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>No runs yet</p>
        ) : (
          <select
            value={selectedRunId}
            onChange={(e) => onSelectRun(e.target.value)}
            className="input-field text-xs"
          >
            {completedRuns.map((r) => (
              <option key={r.id} value={r.id}>{r.runName}</option>
            ))}
          </select>
        )}
      </div>

      {/* Period */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Granularity
        </label>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
          {periods.map((p) => (
            <button
              key={`period-${p}`}
              onClick={() => setPeriod(p)}
              className="flex-1 py-1 rounded-md text-xs font-semibold transition-all duration-150"
              style={{
                background: period === p ? 'var(--card)' : 'transparent',
                color: period === p ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {p.slice(0, 1)}
            </button>
          ))}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{period}</p>
      </div>

      {/* Horizon */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Forecast Horizon
        </label>
        <input
          type="range"
          min={4}
          max={52}
          value={horizon}
          onChange={(e) => setHorizon(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>4 wks</span>
          <span className="font-semibold text-foreground">{horizon} wks</span>
          <span>52 wks</span>
        </div>
      </div>

      {/* Overlays */}
      <div className="space-y-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide pt-3" style={{ color: 'var(--muted-foreground)' }}>
          Chart Overlays
        </p>
        <Toggle checked={showCI} onChange={setShowCI} label="Confidence Intervals" size="sm" />
        <Toggle checked={showActual} onChange={setShowActual} label="Actual Sales" size="sm" />
        <Toggle checked={showSeasonality} onChange={setShowSeasonality} label="Seasonality Component" size="sm" />
      </div>
    </div>
  );
}