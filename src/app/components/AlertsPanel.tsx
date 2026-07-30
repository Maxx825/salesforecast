import React from 'react';
import { Bell } from 'lucide-react';

export default function AlertsPanel() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Alerts & Notices</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
        <Bell size={32} style={{ color: 'var(--muted-foreground)' }} className="mb-3 opacity-50" />
        <p className="text-sm font-medium text-foreground mb-1">No alerts</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          No data yet — upload a file to get started
        </p>
      </div>
    </div>
  );
}