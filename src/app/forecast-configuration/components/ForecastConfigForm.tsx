'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Play, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';
import { toast } from 'sonner';

type FormValues = {
  runName: string;
  dataset: string;
  model: string;
  horizonWeeks: number;
  confidenceLevel: number;
  growthMode: string;
  changePointPrior: number;
  seasonalityMode: string;
  yearlySeasonality: boolean;
  weeklySeasonality: boolean;
  dailySeasonality: boolean;
  customSeasonality: boolean;
  customPeriod: number;
  customFourierOrder: number;
  includeRegions: string[];
  includeChannels: string[];
  includeCategories: string[];
  outlierHandling: string;
  missingValueStrategy: string;
  minHistoryWeeks: number;
  notes: string;
};

const datasets = [
  { value: 'ds-2026-046', label: 'Q2 2026 Actuals (Apr–Jun 2026)' },
  { value: 'ds-2026-044', label: 'Q1 2026 Actuals (Jan–Mar 2026)' },
  { value: 'ds-2025-038', label: 'FY 2025 Full Year' },
];

const models = [
  { value: 'prophet', label: 'Prophet', desc: 'Best for data with strong seasonality and holiday effects' },
  { value: 'arima', label: 'ARIMA', desc: 'Best for stationary time series with no strong seasonality' },
  { value: 'exp_smooth', label: 'Exponential Smoothing', desc: 'Best for short-horizon forecasts with trend' },
  { value: 'moving_avg', label: 'Moving Average', desc: 'Simple baseline — good for benchmarking other models' },
];

const regions = ['North America', 'EMEA', 'APAC', 'LATAM', 'India'];
const channels = ['Direct Sales', 'Partner Network', 'E-Commerce', 'Resellers'];
const categories = ['Enterprise Suite', 'SMB Plans', 'Add-ons', 'Professional Svcs', 'Training'];

export default function ForecastConfigForm() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([...regions]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([...channels]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);
  const [yearlySeasonality, setYearlySeasonality] = useState(true);
  const [weeklySeasonality, setWeeklySeasonality] = useState(true);
  const [dailySeasonality, setDailySeasonality] = useState(false);
  const [customSeasonality, setCustomSeasonality] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      runName: '',
      dataset: 'ds-2026-046',
      model: 'prophet',
      horizonWeeks: 12,
      confidenceLevel: 80,
      growthMode: 'linear',
      changePointPrior: 0.05,
      seasonalityMode: 'additive',
      customPeriod: 30,
      customFourierOrder: 5,
      outlierHandling: 'clip',
      missingValueStrategy: 'seasonal_impute',
      minHistoryWeeks: 26,
      notes: '',
    },
  });

  const selectedModel = watch('model');
  const horizonWeeks = watch('horizonWeeks');
  const confidenceLevel = watch('confidenceLevel');

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const onSubmit = (data: FormValues) => {
    setIsRunning(true);
    // Backend integration point: POST /api/forecast-runs with model config payload
    setTimeout(() => {
      setIsRunning(false);
      toast.success(`Forecast run "${data.runName || 'Untitled Run'}" queued — estimated completion: 2–3 minutes`);
    }, 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-elevated overflow-hidden">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-base font-semibold text-foreground">New Forecast Run</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          Configure model parameters and scope, then submit to the forecasting queue
        </p>
      </div>

      <div className="p-6 space-y-7">
        {/* Section 1: Basic Setup */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Basic Setup
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Run Name
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                A descriptive name to identify this run in history
              </p>
              <input
                {...register('runName', { required: 'Run name is required' })}
                placeholder="e.g. Q3 2026 All-Regions Prophet"
                className={`input-field ${errors.runName ? 'error' : ''}`}
              />
              {errors.runName && (
                <p className="text-xs mt-1" style={{ color: 'var(--negative)' }}>{errors.runName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Source Dataset
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Historical sales data to train the model on
              </p>
              <select {...register('dataset')} className="input-field">
                {datasets.map((d) => (
                  <option key={`ds-opt-${d.value}`} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Model Selection */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Forecasting Model
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {models.map((m) => {
              const isSelected = selectedModel === m.value;
              return (
                <label
                  key={`model-card-${m.value}`}
                  className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all duration-150"
                  style={{
                    background: isSelected ? 'var(--info-bg)' : 'var(--secondary)',
                    border: `1px solid ${isSelected ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
                  }}
                >
                  <input type="radio" value={m.value} {...register('model')} className="mt-0.5 accent-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{m.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Section 3: Horizon & Confidence */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Forecast Horizon & Confidence
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Forecast Horizon
              </label>
              <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                How many weeks ahead to predict
              </p>
              <input
                type="range"
                min={4}
                max={52}
                step={4}
                {...register('horizonWeeks', { valueAsNumber: true })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-mono mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                <span>4 wks</span>
                <span className="font-semibold text-foreground">{horizonWeeks} weeks ({Math.round(horizonWeeks / 4.33)} months)</span>
                <span>52 wks</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Confidence Interval Level
              </label>
              <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                Probability that actuals fall within the CI band
              </p>
              <input
                type="range"
                min={50}
                max={99}
                step={5}
                {...register('confidenceLevel', { valueAsNumber: true })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-mono mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                <span>50%</span>
                <span className="font-semibold text-foreground">{confidenceLevel}% CI</span>
                <span>99%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Seasonality */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Seasonality Settings
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Seasonality Mode
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Additive is better when seasonal fluctuations are constant; multiplicative when they scale with trend
              </p>
              <select {...register('seasonalityMode')} className="input-field">
                <option value="additive">Additive</option>
                <option value="multiplicative">Multiplicative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Growth Mode
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Linear assumes unbounded growth; logistic requires a capacity cap
              </p>
              <select {...register('growthMode')} className="input-field">
                <option value="linear">Linear</option>
                <option value="logistic">Logistic (with cap)</option>
                <option value="flat">Flat (no trend)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Toggle checked={yearlySeasonality} onChange={setYearlySeasonality} label="Yearly Seasonality" />
            <Toggle checked={weeklySeasonality} onChange={setWeeklySeasonality} label="Weekly Seasonality" />
            <Toggle checked={dailySeasonality} onChange={setDailySeasonality} label="Daily Seasonality (requires daily data)" />
            <Toggle checked={customSeasonality} onChange={setCustomSeasonality} label="Custom Seasonality Period" />
            {customSeasonality && (
              <div className="grid grid-cols-2 gap-4 ml-10 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Period (days)</label>
                  <input
                    type="number"
                    {...register('customPeriod', { valueAsNumber: true, min: 2, max: 365 })}
                    className="input-field text-xs"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Fourier Order</label>
                  <input
                    type="number"
                    {...register('customFourierOrder', { valueAsNumber: true, min: 1, max: 20 })}
                    className="input-field text-xs"
                    placeholder="5"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Segment Scope */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Forecast Scope
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Regions', items: regions, selected: selectedRegions, setSelected: setSelectedRegions },
              { label: 'Channels', items: channels, selected: selectedChannels, setSelected: setSelectedChannels },
              { label: 'Categories', items: categories, selected: selectedCategories, setSelected: setSelectedCategories },
            ].map((group) => (
              <div key={`scope-${group.label}`}>
                <label className="block text-sm font-semibold text-foreground mb-2">{group.label}</label>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <label key={`scope-item-${group.label}-${item}`} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={group.selected.includes(item)}
                        onChange={() => toggleItem(group.selected, group.setSelected, item)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Settings Collapsible */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground w-full text-left"
          >
            {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Advanced Parameters
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted-foreground)' }}>
              (changepoint sensitivity, outlier handling, min history)
            </span>
          </button>

          {advancedOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Changepoint Prior Scale
                </label>
                <div className="flex items-start gap-1.5 mb-2">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Controls flexibility of trend changes. Higher = more flexible (0.001–0.5)
                  </p>
                  <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="0.5"
                  {...register('changePointPrior', { valueAsNumber: true })}
                  className="input-field"
                  placeholder="0.05"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Outlier Handling
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  How to treat data points beyond 3σ from the mean
                </p>
                <select {...register('outlierHandling')} className="input-field">
                  <option value="clip">Clip to 3σ boundary</option>
                  <option value="remove">Remove and impute</option>
                  <option value="keep">Keep as-is</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Missing Value Strategy
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Method for filling gaps in historical data
                </p>
                <select {...register('missingValueStrategy')} className="input-field">
                  <option value="seasonal_impute">Seasonal average imputation</option>
                  <option value="linear_interp">Linear interpolation</option>
                  <option value="forward_fill">Forward fill</option>
                  <option value="zero">Fill with zero</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Minimum History Required (weeks)
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Segments with less history than this will be excluded
                </p>
                <input
                  type="number"
                  min={12}
                  max={104}
                  {...register('minHistoryWeeks', { valueAsNumber: true })}
                  className="input-field"
                  placeholder="26"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Run Notes
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Optional context for this run — visible in run history
                </p>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="e.g. Testing higher changepoint sensitivity for APAC after data gap fix"
                  className="input-field resize-none"
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Sticky Submit Bar */}
      <div
        className="sticky bottom-0 px-6 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}
      >
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Scope: <span className="text-foreground font-semibold">{selectedRegions.length} regions</span> ·{' '}
          <span className="text-foreground font-semibold">{selectedChannels.length} channels</span> ·{' '}
          <span className="text-foreground font-semibold">{selectedCategories.length} categories</span> ·{' '}
          <span className="text-foreground font-semibold">{horizonWeeks}-week horizon</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="btn-ghost">Save as Draft</button>
          <button
            type="submit"
            disabled={isRunning}
            className="btn-primary"
          >
            {isRunning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Queuing Run…
              </>
            ) : (
              <>
                <Play size={14} />
                Run Forecast
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}