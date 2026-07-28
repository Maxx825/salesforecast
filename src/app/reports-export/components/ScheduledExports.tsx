'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import { Calendar, Plus, Mail } from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: replace with GET /api/reports/schedules
const schedules = [
  { id: 'sched-001', name: 'Weekly Board Pack', template: 'Executive Summary', frequency: 'Every Monday', time: '07:00 UTC', recipients: 4, format: 'PDF', active: true },
  { id: 'sched-002', name: 'Monthly Segment Report', template: 'Segment Deep-Dive', frequency: '1st of month', time: '06:00 UTC', recipients: 7, format: 'XLSX', active: true },
  { id: 'sched-003', name: 'Bi-weekly Accuracy Check', template: 'Model Accuracy Report', frequency: 'Every 2 weeks', time: '08:00 UTC', recipients: 2, format: 'PDF', active: false },
];

export default function ScheduledExports() {
  const [activeStates, setActiveStates] = useState(
    Object.fromEntries(schedules.map((s) => [s.id, s.active]))
  );

  const toggleSchedule = (id: string, val: boolean) => {
    setActiveStates((prev) => ({ ...prev, [id]: val }));
    toast.success(`Schedule ${val ? 'enabled' : 'paused'}`);
  };

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Scheduled Exports</h2>
        <button
          className="btn-primary text-xs px-3 py-1.5 h-auto"
          onClick={() => toast.info('Schedule builder coming soon')}
        >
          <Plus size={12} />
          New Schedule
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {schedules.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl"
            style={{
              background: 'var(--secondary)',
              border: `1px solid ${activeStates[s.id] ? 'rgba(108,99,255,0.2)' : 'var(--border)'}`,
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.template}</p>
              </div>
              <Toggle
                checked={activeStates[s.id]}
                onChange={(val) => toggleSchedule(s.id, val)}
                size="sm"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Calendar size={11} />
                {s.frequency} at {s.time}
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Mail size={11} />
                {s.recipients} recipients
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {s.format}
                </span>
                <Badge variant={activeStates[s.id] ? 'active' : 'neutral'} dot>
                  {activeStates[s.id] ? 'active' : 'paused'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}