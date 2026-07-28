import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const errors = [
  { id: 'err-001', type: 'error', row: 1847, col: 'revenue', message: 'Negative value detected (-₹2,400) — revenue cannot be negative', suggestion: 'Check for credit notes; consider using a separate "adjustments" column' },
  { id: 'err-002', type: 'warning', row: 6203, col: 'date', message: 'Date format inconsistency — found MM/DD/YY in row 6,203 (expected MM/DD/YYYY)', suggestion: 'Auto-corrected to 06/12/2025 — verify this is correct' },
  { id: 'err-003', type: 'warning', row: null, col: 'region', message: '14 rows have unknown region code "ROW" — not mapped to any forecast segment', suggestion: 'Map "ROW" to "Rest of World" or exclude these rows from regional forecasts' },
];

const passed = [
  'Date range is continuous with no gaps in primary segments',
  'All 274 product IDs are consistent across the dataset',
  'Revenue and quantity columns are positively correlated (r=0.94)',
];

export default function ValidationErrors() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
        Validation Results
      </p>
      {errors?.map((err) => (
        <div
          key={err?.id}
          className="flex gap-3 p-3 rounded-lg"
          style={{
            background: err?.type === 'error' ? 'var(--negative-bg)' : 'var(--warning-bg)',
            border: `1px solid ${err?.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        >
          {err?.type === 'error' ? (
            <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--negative)' }} />
          ) : (
            <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold text-foreground">{err?.message}</p>
              {err?.row && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  Row {err?.row?.toLocaleString()}
                </span>
              )}
              <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {err?.col}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              💡 {err?.suggestion}
            </p>
          </div>
        </div>
      ))}
      <div className="rounded-lg p-3" style={{ background: 'var(--positive-bg)', border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={14} style={{ color: 'var(--positive)' }} />
          <p className="text-xs font-semibold" style={{ color: 'var(--positive)' }}>
            {passed?.length} checks passed
          </p>
        </div>
        <ul className="space-y-0.5">
          {passed?.map((p, i) => (
            <li key={`pass-${i}`} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              ✓ {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}