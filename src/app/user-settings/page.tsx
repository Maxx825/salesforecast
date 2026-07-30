'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  SlidersHorizontal,
  Bell,
  Download,
  Check,
  ChevronDown,
  Sun,
  TrendingUp,
  Calendar,
  Repeat,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

type ExportFormat = 'CSV' | 'Excel' | 'PDF' | 'JSON';
type NotifChannel = 'email' | 'in_app';

interface ForecastParams {
  horizon: number;
  seasonalityWeekly: boolean;
  seasonalityYearly: boolean;
  seasonalityMonthly: boolean;
  autoDetectSeasonality: boolean;
  confidenceInterval: number;
  defaultModel: string;
}

interface NotifPrefs {
  runComplete: boolean;
  runFailed: boolean;
  accuracyAlert: boolean;
  weeklyDigest: boolean;
  channels: NotifChannel[];
}

const modelOptions = ['Prophet', 'ARIMA', 'Exp. Smoothing', 'Moving Average', 'Auto-Select'];
const exportFormats: ExportFormat[] = ['CSV', 'Excel', 'PDF', 'JSON'];

export default function UserSettingsPage() {
  const [forecastParams, setForecastParams] = useState<ForecastParams>({
    horizon: 12,
    seasonalityWeekly: true,
    seasonalityYearly: true,
    seasonalityMonthly: false,
    autoDetectSeasonality: false,
    confidenceInterval: 80,
    defaultModel: 'Prophet',
  });

  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    runComplete: true,
    runFailed: true,
    accuracyAlert: false,
    weeklyDigest: true,
    channels: ['email', 'in_app'],
  });

  const [exportFormat, setExportFormat] = useState<ExportFormat>('CSV');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleChannel = (ch: NotifChannel) => {
    setNotifPrefs((prev) => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter((c) => c !== ch)
        : [...prev.channels, ch],
    }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: checked ? 'var(--primary)' : 'var(--border)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">User Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Configure your default forecast parameters, notifications, and export preferences.
            </p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
          </button>
        </div>

        {saved && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'var(--positive-bg)', color: 'var(--positive)', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <CheckCircle size={15} />
            Settings saved successfully.
          </div>
        )}

        {/* Section 1: Default Forecast Parameters */}
        <div className="card-elevated p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="text-sm font-semibold text-foreground">Default Forecast Parameters</h2>
          </div>

          {/* Horizon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: 'var(--muted-foreground)' }} />
                <label className="text-sm font-medium text-foreground">Forecast Horizon</label>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                {forecastParams.horizon} months
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={36}
              value={forecastParams.horizon}
              onChange={(e) => setForecastParams((p) => ({ ...p, horizon: Number(e.target.value) }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--primary)', background: 'var(--border)' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              <span>1 mo</span>
              <span>36 mo</span>
            </div>
          </div>

          {/* Confidence Interval */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info size={14} style={{ color: 'var(--muted-foreground)' }} />
                <label className="text-sm font-medium text-foreground">Confidence Interval</label>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                {forecastParams.confidenceInterval}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={99}
              step={5}
              value={forecastParams.confidenceInterval}
              onChange={(e) => setForecastParams((p) => ({ ...p, confidenceInterval: Number(e.target.value) }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--primary)', background: 'var(--border)' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              <span>50%</span>
              <span>99%</span>
            </div>
          </div>

          {/* Default Model */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Repeat size={14} style={{ color: 'var(--muted-foreground)' }} />
              <label className="text-sm font-medium text-foreground">Default Model</label>
            </div>
            <div className="relative w-56">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="input-field flex items-center justify-between"
              >
                <span className="text-sm">{forecastParams.defaultModel}</span>
                <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
              </button>
              {modelDropdownOpen && (
                <div
                  className="absolute top-full mt-1 left-0 w-full rounded-lg z-20 shadow-lg overflow-hidden"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {modelOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setForecastParams((p) => ({ ...p, defaultModel: m })); setModelDropdownOpen(false); }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {m}
                      {forecastParams.defaultModel === m && <Check size={13} style={{ color: 'var(--primary)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seasonality Toggles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: 'var(--muted-foreground)' }} />
              <label className="text-sm font-medium text-foreground">Seasonality Components</label>
            </div>
            <div className="space-y-2.5">
              {[
                { key: 'autoDetectSeasonality', label: 'Auto-detect seasonality', desc: 'Let the model determine seasonality automatically' },
                { key: 'seasonalityWeekly', label: 'Weekly seasonality', desc: 'Capture day-of-week patterns' },
                { key: 'seasonalityMonthly', label: 'Monthly seasonality', desc: 'Capture within-month patterns' },
                { key: 'seasonalityYearly', label: 'Yearly seasonality', desc: 'Capture annual cycles and trends' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
                  </div>
                  <Toggle
                    checked={forecastParams[key as keyof ForecastParams] as boolean}
                    onChange={() => setForecastParams((p) => ({ ...p, [key]: !p[key as keyof ForecastParams] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Notification Preferences */}
        <div className="card-elevated p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Bell size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
          </div>

          {/* Notification Events */}
          <div className="space-y-2.5">
            {[
              { key: 'runComplete', label: 'Forecast run completed', icon: CheckCircle, desc: 'Notify when a forecast run finishes successfully' },
              { key: 'runFailed', label: 'Forecast run failed', icon: AlertTriangle, desc: 'Alert when a run encounters an error' },
              { key: 'accuracyAlert', label: 'Accuracy threshold alert', icon: TrendingUp, desc: 'Alert when MAPE exceeds your threshold' },
              { key: 'weeklyDigest', label: 'Weekly digest', icon: Sun, desc: 'Summary of all forecast activity each week' },
            ].map(({ key, label, icon: IconComponent, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                <div className="flex items-start gap-2.5">
                  <IconComponent size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={notifPrefs[key as keyof NotifPrefs] as boolean}
                  onChange={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key as keyof NotifPrefs] }))}
                />
              </div>
            ))}
          </div>

          {/* Notification Channels */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Delivery Channels</p>
            <div className="flex gap-3">
              {[
                { id: 'email' as NotifChannel, label: 'Email', icon: Mail },
                { id: 'in_app' as NotifChannel, label: 'In-App', icon: Smartphone },
              ].map(({ id, label, icon: ChannelIcon }) => {
                const active = notifPrefs.channels.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleChannel(id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: active ? 'var(--info-bg)' : 'var(--muted)',
                      color: active ? 'var(--primary)' : 'var(--muted-foreground)',
                      border: active ? '1px solid rgba(59,111,212,0.25)' : '1px solid transparent',
                    }}
                  >
                    <ChannelIcon size={14} />
                    {label}
                    {active && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Default Export Format */}
        <div className="card-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Download size={16} style={{ color: 'var(--primary)' }} />
            <h2 className="text-sm font-semibold text-foreground">Default Export Format</h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Choose the default file format when exporting forecast reports and data.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {exportFormats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className="flex flex-col items-center gap-1.5 p-4 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background: exportFormat === fmt ? 'var(--info-bg)' : 'var(--muted)',
                  color: exportFormat === fmt ? 'var(--primary)' : 'var(--muted-foreground)',
                  border: exportFormat === fmt ? '1px solid rgba(59,111,212,0.25)' : '1px solid transparent',
                }}
              >
                <Download size={16} />
                {fmt}
                {exportFormat === fmt && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
