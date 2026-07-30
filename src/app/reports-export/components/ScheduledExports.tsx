'use client';

import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ScheduledExports() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Scheduled Exports</h2>
        <button
          className="btn-primary text-xs px-3 py-1.5 h-auto"
          onClick={() => toast?.info('Schedule builder coming soon')}
        >
          <Plus size={12} />
          New Schedule
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
        <Calendar size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-40" />
        <p className="text-sm font-medium text-foreground mb-1">No schedules yet</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    </div>
  );
}