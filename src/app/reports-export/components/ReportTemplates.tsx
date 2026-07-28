'use client';

import React, { useState } from 'react';
import { FileText, BarChart2, Activity, Download, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/AppIcon';


const templates = [
  {
    id: 'tpl-executive',
    icon: BarChart2,
    name: 'Executive Summary',
    desc: 'High-level forecast overview with projected revenue, growth rate, top risks, and segment highlights. Designed for VP and C-suite stakeholders.',
    pages: '4–6 pages',
    formats: ['PDF', 'PPTX'],
    lastGenerated: 'Jul 28, 2026',
    color: 'var(--primary)',
    bg: 'var(--info-bg)',
  },
  {
    id: 'tpl-segment',
    icon: Activity,
    name: 'Segment Deep-Dive',
    desc: 'Detailed breakdown by region, channel, and category with actual vs. predicted charts, accuracy metrics, and confidence interval analysis per segment.',
    pages: '12–18 pages',
    formats: ['PDF', 'CSV', 'XLSX'],
    lastGenerated: 'Jul 25, 2026',
    color: 'var(--accent)',
    bg: 'rgba(0,212,170,0.08)',
  },
  {
    id: 'tpl-accuracy',
    icon: FileText,
    name: 'Model Accuracy Report',
    desc: 'Technical model performance report with MAPE, RMSE, R² by segment, residuals analysis, seasonality decomposition, and recommendations for model tuning.',
    pages: '8–10 pages',
    formats: ['PDF', 'CSV'],
    lastGenerated: 'Jul 22, 2026',
    color: 'var(--warning)',
    bg: 'var(--warning-bg)',
  },
];

export default function ReportTemplates() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState<string | null>(null);
  const [format, setFormat] = useState('PDF');
  const [forecastRun, setForecastRun] = useState('run-2026-041');
  const [includeCI, setIncludeCI] = useState(true);

  const handleGenerate = (tplId: string, tplName: string) => {
    setGenerating(tplId);
    // Backend integration point: POST /api/reports/generate with template + config
    setTimeout(() => {
      setGenerating(null);
      toast.success(`${tplName} generated — downloading now`);
    }, 2200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Report Templates</h2>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Based on run-2026-041 · Jul 28, 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          const isGenerating = generating === tpl.id;
          return (
            <div
              key={tpl.id}
              className="card-elevated-hover p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: tpl.bg }}
                >
                  <Icon size={20} style={{ color: tpl.color }} />
                </div>
                <button
                  onClick={() => setConfigOpen(tpl.id)}
                  className="btn-ghost h-8 w-8 p-0 justify-center"
                  title="Configure report"
                >
                  <Settings size={14} />
                </button>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{tpl.name}</h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{tpl.desc}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {tpl.formats.map((f) => (
                    <span key={`fmt-${tpl.id}-${f}`} className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      {f}
                    </span>
                  ))}
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tpl.pages}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Last generated: {tpl.lastGenerated}
                </p>
              </div>

              <button
                onClick={() => handleGenerate(tpl.id, tpl.name)}
                disabled={isGenerating}
                className="btn-primary w-full justify-center"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    Generate & Download
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Config Modal */}
      <Modal
        open={configOpen !== null}
        onClose={() => setConfigOpen(null)}
        title={`Configure — ${templates.find((t) => t.id === configOpen)?.name || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Forecast Run</label>
            <select value={forecastRun} onChange={(e) => setForecastRun(e.target.value)} className="input-field">
              <option value="run-2026-041">run-2026-041 — Prophet (Jul 28)</option>
              <option value="run-2026-040">run-2026-040 — ARIMA (Jul 27)</option>
              <option value="run-2026-038">run-2026-038 — Exp. Smooth (Jul 25)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Export Format</label>
            <div className="flex gap-2">
              {['PDF', 'CSV', 'XLSX'].map((f) => (
                <button
                  key={`fmtbtn-${f}`}
                  onClick={() => setFormat(f)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                  style={{
                    background: format === f ? 'var(--primary)' : 'var(--muted)',
                    color: format === f ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={includeCI} onChange={(e) => setIncludeCI(e.target.checked)} className="accent-primary" />
            <span className="text-sm text-foreground">Include confidence interval bands in charts</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setConfigOpen(null)} className="btn-ghost">Cancel</button>
            <button
              onClick={() => {
                setConfigOpen(null);
                toast.success('Report configuration saved');
              }}
              className="btn-primary"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}