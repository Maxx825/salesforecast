'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import { Filter, RotateCcw } from 'lucide-react';

const regions = ['All Regions', 'North America', 'EMEA', 'APAC', 'LATAM', 'India'];
const channels = ['All Channels', 'Direct Sales', 'Partner Network', 'E-Commerce', 'Resellers'];
const categories = ['All Categories', 'Enterprise Suite', 'SMB Plans', 'Add-ons', 'Professional Svcs', 'Training'];
const periods = ['Monthly', 'Weekly', 'Quarterly'];
const models = ['run-2026-041 (Prophet)', 'run-2026-040 (ARIMA)', 'run-2026-038 (Exp. Smooth)'];

export default function AnalysisFilterPanel() {
  const [region, setRegion] = useState('All Regions');
  const [channel, setChannel] = useState('All Channels');
  const [category, setCategory] = useState('All Categories');
  const [period, setPeriod] = useState('Monthly');
  const [model, setModel] = useState('run-2026-041 (Prophet)');
  const [showCI, setShowCI] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showSeasonality, setShowSeasonality] = useState(false);
  const [horizon, setHorizon] = useState(12);

  const reset = () => {
    setRegion('All Regions');
    setChannel('All Channels');
    setCategory('All Categories');
    setPeriod('Monthly');
    setModel(models?.[0]);
    setShowCI(true);
    setShowActual(true);
    setShowSeasonality(false);
    setHorizon(12);
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
        <select value={model} onChange={(e) => setModel(e?.target?.value)} className="input-field text-xs">
          {models?.map((m) => <option key={`model-opt-${m}`} value={m}>{m}</option>)}
        </select>
      </div>
      {/* Period */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Granularity
        </label>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
          {periods?.map((p) => (
            <button
              key={`period-${p}`}
              onClick={() => setPeriod(p)}
              className="flex-1 py-1 rounded-md text-xs font-semibold transition-all duration-150"
              style={{
                background: period === p ? 'var(--card)' : 'transparent',
                color: period === p ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {p?.slice(0, 1)}
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
          onChange={(e) => setHorizon(Number(e?.target?.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>4 wks</span>
          <span className="font-semibold text-foreground">{horizon} wks</span>
          <span>52 wks</span>
        </div>
      </div>
      {/* Region */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Region
        </label>
        <select value={region} onChange={(e) => setRegion(e?.target?.value)} className="input-field text-xs">
          {regions?.map((r) => <option key={`region-opt-${r}`} value={r}>{r}</option>)}
        </select>
      </div>
      {/* Channel */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Sales Channel
        </label>
        <select value={channel} onChange={(e) => setChannel(e?.target?.value)} className="input-field text-xs">
          {channels?.map((c) => <option key={`ch-opt-${c}`} value={c}>{c}</option>)}
        </select>
      </div>
      {/* Category */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Product Category
        </label>
        <select value={category} onChange={(e) => setCategory(e?.target?.value)} className="input-field text-xs">
          {categories?.map((c) => <option key={`cat-opt-${c}`} value={c}>{c}</option>)}
        </select>
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