import React from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: replace with /api/alerts?severity=all
const alerts = [
  {
    id: 'alert-001',
    severity: 'critical',
    title: 'APAC CI Width Exceeds Threshold',
    detail: 'Confidence interval at ±22.4% — model needs retraining with recent data',
    time: '12 min ago',
  },
  {
    id: 'alert-002',
    severity: 'warning',
    title: 'EMEA Missing 6 Weeks of Data',
    detail: 'Weeks 18–23 have no sales records — imputing with seasonal average',
    time: '1 hr ago',
  },
  {
    id: 'alert-003',
    severity: 'warning',
    title: 'LATAM MAPE Degraded to 11.8%',
    detail: 'Accuracy below 10% target — consider switching to ARIMA for this region',
    time: '3 hr ago',
  },
  {
    id: 'alert-004',
    severity: 'info',
    title: 'New Dataset Awaiting Validation',
    detail: 'Q2 2026 actuals uploaded by Priya Sharma — 2 column mapping issues',
    time: '5 hr ago',
  },
  {
    id: 'alert-005',
    severity: 'info',
    title: 'Scheduled Export Completed',
    detail: 'Weekly executive PDF delivered to 4 recipients',
    time: '8 hr ago',
  },
];

const severityConfig = {
  critical: { icon: AlertCircle, color: 'var(--negative)', bg: 'var(--negative-bg)', border: 'rgba(239,68,68,0.2)' },
  warning:  { icon: AlertTriangle, color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'rgba(245,158,11,0.2)' },
  info:     { icon: Info, color: 'var(--primary)', bg: 'var(--info-bg)', border: 'rgba(108,99,255,0.2)' },
};

export default function AlertsPanel() {
  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Alerts & Notices</h2>
        <span className="badge-error text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: 'var(--negative-bg)', color: 'var(--negative)' }}>
          1 critical
        </span>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity as keyof typeof severityConfig];
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 hover:brightness-110"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <Icon size={15} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-snug">{alert.title}</p>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted-foreground)' }}>{alert.detail}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>{alert.time}</p>
              </div>
              <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}