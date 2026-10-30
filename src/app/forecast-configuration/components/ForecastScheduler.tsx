'use client';

import React, { useState, useId } from 'react';
import { CalendarClock, Play, Pause, Trash2, Plus, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';
import { useDatasets } from '@/contexts/DatasetContext';
import { toast } from 'sonner';

type Frequency = 'daily' | 'weekly' | 'monthly';
type ScheduleStatus = 'active' | 'paused' | 'running' | 'failed';

interface Schedule {
  id: string;
  name: string;
  frequency: Frequency;
  dayOfWeek?: number; // 0–6 for weekly
  dayOfMonth?: number; // 1–28 for monthly
  hour: number;
  model: string;
  status: ScheduleStatus;
  lastRunAt: string | null;
  lastRunResult: 'success' | 'failed' | null;
  nextRunAt: string;
  datasetLabel: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MODELS = [
  { value: 'prophet', label: 'Prophet' },
  { value: 'arima', label: 'ARIMA' },
  { value: 'exp_smooth', label: 'Exp. Smoothing' },
  { value: 'moving_avg', label: 'Moving Average' },
];

function computeNextRun(frequency: Frequency, hour: number, dayOfWeek?: number, dayOfMonth?: number): string {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(hour);

  if (frequency === 'daily') {
    if (next <= now) next.setDate(next.getDate() + 1);
  } else if (frequency === 'weekly') {
    const dow = dayOfWeek ?? 1;
    const diff = (dow - now.getDay() + 7) % 7 || 7;
    next.setDate(now.getDate() + diff);
    if (diff === 0 && next <= now) next.setDate(next.getDate() + 7);
  } else {
    const dom = dayOfMonth ?? 1;
    next.setDate(dom);
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
      next.setDate(dom);
    }
  }

  return next.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const map: Record<ScheduleStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    active: { label: 'Active', color: 'var(--positive)', bg: 'var(--positive-bg)', icon: <CheckCircle2 size={11} /> },
    paused: { label: 'Paused', color: 'var(--muted-foreground)', bg: 'var(--secondary)', icon: <Pause size={11} /> },
    running: { label: 'Running', color: 'var(--info)', bg: 'var(--info-bg)', icon: <RefreshCw size={11} className="animate-spin" /> },
    failed: { label: 'Failed', color: 'var(--negative)', bg: 'var(--negative-bg)', icon: <AlertCircle size={11} /> },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-1',
    name: 'Weekly Sales Forecast',
    frequency: 'weekly',
    dayOfWeek: 1,
    hour: 6,
    model: 'prophet',
    status: 'active',
    lastRunAt: 'Jul 28, 2026, 6:00 AM',
    lastRunResult: 'success',
    nextRunAt: computeNextRun('weekly', 6, 1),
    datasetLabel: 'Latest uploaded dataset',
  },
];

export default function ForecastScheduler() {
  const { datasets } = useDatasets();
  const latestDataset = datasets[0];
  const uid = useId();

  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [showForm, setShowForm] = useState(false);
  const [enabled, setEnabled] = useState(true);

  // New schedule form state
  const [formName, setFormName] = useState('');
  const [formFrequency, setFormFrequency] = useState<Frequency>('weekly');
  const [formDayOfWeek, setFormDayOfWeek] = useState(1);
  const [formDayOfMonth, setFormDayOfMonth] = useState(1);
  const [formHour, setFormHour] = useState(6);
  const [formModel, setFormModel] = useState('prophet');

  const handleAddSchedule = () => {
    if (!formName.trim()) {
      toast.error('Please enter a schedule name');
      return;
    }
    const nextRun = computeNextRun(formFrequency, formHour, formDayOfWeek, formDayOfMonth);
    const newSchedule: Schedule = {
      id: `sched-${Date.now()}`,
      name: formName.trim(),
      frequency: formFrequency,
      dayOfWeek: formFrequency === 'weekly' ? formDayOfWeek : undefined,
      dayOfMonth: formFrequency === 'monthly' ? formDayOfMonth : undefined,
      hour: formHour,
      model: formModel,
      status: 'active',
      lastRunAt: null,
      lastRunResult: null,
      nextRunAt: nextRun,
      datasetLabel: latestDataset ? latestDataset.name : 'Latest uploaded dataset',
    };
    setSchedules((prev) => [newSchedule, ...prev]);
    toast.success(`Schedule "${formName.trim()}" created — next run: ${nextRun}`);
    setShowForm(false);
    setFormName('');
    setFormFrequency('weekly');
    setFormDayOfWeek(1);
    setFormDayOfMonth(1);
    setFormHour(6);
    setFormModel('prophet');
  };

  const togglePause = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = s.status === 'active' ? 'paused' : 'active';
        toast.success(`Schedule "${s.name}" ${next === 'active' ? 'resumed' : 'paused'}`);
        return { ...s, status: next };
      })
    );
  };

  const triggerNow = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'running' } : s))
    );
    const sched = schedules.find((s) => s.id === id);
    toast.success(`Forecast run triggered for "${sched?.name}"`);
    setTimeout(() => {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const now = new Date().toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
          });
          return {
            ...s,
            status: 'active',
            lastRunAt: now,
            lastRunResult: 'success',
            nextRunAt: computeNextRun(s.frequency, s.hour, s.dayOfWeek, s.dayOfMonth),
          };
        })
      );
      toast.success(`Scheduled run "${sched?.name}" completed`);
    }, 3500);
  };

  const deleteSchedule = (id: string) => {
    const sched = schedules.find((s) => s.id === id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Schedule "${sched?.name}" deleted`);
  };

  const frequencyLabel = (s: Schedule) => {
    if (s.frequency === 'daily') return `Daily at ${s.hour}:00`;
    if (s.frequency === 'weekly') return `Every ${DAYS_OF_WEEK[s.dayOfWeek ?? 1]} at ${s.hour}:00`;
    return `Monthly on day ${s.dayOfMonth} at ${s.hour}:00`;
  };

  return (
    <div className="card-elevated overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <CalendarClock size={18} style={{ color: 'var(--primary)' }} />
          <div>
            <h2 className="text-base font-semibold text-foreground">Recurring Forecast Schedules</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Auto-run forecasts on the latest dataset at a set cadence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onChange={setEnabled} label="Scheduling enabled" />
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={13} />
            New Schedule
          </button>
        </div>
      </div>

      {/* New Schedule Form */}
      {showForm && (
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
            New Schedule
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Name */}
            <div className="md:col-span-2 xl:col-span-3">
              <label htmlFor={`${uid}-name`} className="block text-sm font-semibold text-foreground mb-1">
                Schedule Name
              </label>
              <input
                id={`${uid}-name`}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Monthly Revenue Forecast"
                className="input-field"
              />
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor={`${uid}-freq`} className="block text-sm font-semibold text-foreground mb-1">
                Frequency
              </label>
              <select
                id={`${uid}-freq`}
                value={formFrequency}
                onChange={(e) => setFormFrequency(e.target.value as Frequency)}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Day selector */}
            {formFrequency === 'weekly' && (
              <div>
                <label htmlFor={`${uid}-dow`} className="block text-sm font-semibold text-foreground mb-1">
                  Day of Week
                </label>
                <select
                  id={`${uid}-dow`}
                  value={formDayOfWeek}
                  onChange={(e) => setFormDayOfWeek(Number(e.target.value))}
                  className="input-field"
                >
                  {DAYS_OF_WEEK.map((d, i) => (
                    <option key={d} value={i}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            {formFrequency === 'monthly' && (
              <div>
                <label htmlFor={`${uid}-dom`} className="block text-sm font-semibold text-foreground mb-1">
                  Day of Month
                </label>
                <select
                  id={`${uid}-dom`}
                  value={formDayOfMonth}
                  onChange={(e) => setFormDayOfMonth(Number(e.target.value))}
                  className="input-field"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Hour */}
            <div>
              <label htmlFor={`${uid}-hour`} className="block text-sm font-semibold text-foreground mb-1">
                Run Time (UTC)
              </label>
              <select
                id={`${uid}-hour`}
                value={formHour}
                onChange={(e) => setFormHour(Number(e.target.value))}
                className="input-field"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label htmlFor={`${uid}-model`} className="block text-sm font-semibold text-foreground mb-1">
                Forecast Model
              </label>
              <select
                id={`${uid}-model`}
                value={formModel}
                onChange={(e) => setFormModel(e.target.value)}
                className="input-field"
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Dataset info */}
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-semibold text-foreground">Dataset:</span>{' '}
                {latestDataset ? (
                  <span>{latestDataset.name} <span className="opacity-60">({latestDataset.rowCount.toLocaleString()} rows · uploaded {new Date(latestDataset.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span></span>
                ) : (
                  <span className="italic">Always uses the latest uploaded dataset at run time</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button type="button" onClick={handleAddSchedule} className="btn-primary text-sm">
              <CalendarClock size={14} />
              Create Schedule
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
              Cancel
            </button>
            <p className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>
              Next run: <span className="font-semibold text-foreground">
                {computeNextRun(formFrequency, formHour, formDayOfWeek, formDayOfMonth)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {schedules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <CalendarClock size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
            <p className="text-sm font-medium text-foreground mb-1">No schedules yet</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Create a schedule to auto-run forecasts on the latest dataset
            </p>
          </div>
        )}

        {schedules.map((sched) => (
          <div key={sched.id} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-foreground truncate">{sched.name}</span>
                  <StatusBadge status={sched.status} />
                  {!enabled && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                      Scheduling off
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw size={12} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="font-medium text-foreground capitalize">{sched.frequency}</span> · {frequencyLabel(sched)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Model: <span className="font-medium text-foreground">{MODELS.find((m) => m.value === sched.model)?.label ?? sched.model}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Dataset: <span className="font-medium text-foreground">{sched.datasetLabel}</span>
                    </span>
                  </div>
                </div>

                {/* Run status row */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Next run:{' '}
                      <span className="font-semibold" style={{ color: sched.status === 'paused' || !enabled ? 'var(--muted-foreground)' : 'var(--primary)' }}>
                        {sched.status === 'paused' || !enabled ? 'Paused' : sched.nextRunAt}
                      </span>
                    </span>
                  </div>
                  {sched.lastRunAt && (
                    <div className="flex items-center gap-1.5">
                      {sched.lastRunResult === 'success' ? (
                        <CheckCircle2 size={12} style={{ color: 'var(--positive)' }} />
                      ) : (
                        <AlertCircle size={12} style={{ color: 'var(--negative)' }} />
                      )}
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Last run: <span className="font-medium text-foreground">{sched.lastRunAt}</span>
                        {' '}
                        <span style={{ color: sched.lastRunResult === 'success' ? 'var(--positive)' : 'var(--negative)' }}>
                          ({sched.lastRunResult})
                        </span>
                      </span>
                    </div>
                  )}
                  {!sched.lastRunAt && (
                    <span className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>No runs yet</span>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  title="Run now"
                  disabled={sched.status === 'running' || !enabled}
                  onClick={() => triggerNow(sched.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-secondary disabled:opacity-40"
                  style={{ color: 'var(--primary)' }}
                >
                  {sched.status === 'running' ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
                </button>
                <button
                  type="button"
                  title={sched.status === 'paused' ? 'Resume' : 'Pause'}
                  disabled={sched.status === 'running'}
                  onClick={() => togglePause(sched.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-secondary disabled:opacity-40"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {sched.status === 'paused' ? <Play size={15} /> : <Pause size={15} />}
                </button>
                <button
                  type="button"
                  title="Delete schedule"
                  onClick={() => deleteSchedule(sched.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-secondary"
                  style={{ color: 'var(--negative)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
