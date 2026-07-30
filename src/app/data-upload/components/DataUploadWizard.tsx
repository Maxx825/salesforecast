'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, ChevronRight, AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import DataPreviewTable from './DataPreviewTable';
import ColumnMapper from './ColumnMapper';
import ValidationErrors from './ValidationErrors';

type Step = 'select' | 'validate' | 'confirm';

const steps: { id: Step; label: string; num: number }[] = [
  { id: 'select', label: 'Select File', num: 1 },
  { id: 'validate', label: 'Validate & Map', num: 2 },
  { id: 'confirm', label: 'Confirm Import', num: 3 },
];

export default function DataUploadWizard() {
  const [step, setStep] = useState<Step>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string; rows: number; cols: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped.name, dropped.size);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected.name, selected.size);
  };

  const processFile = (name: string, size: number) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      toast.error('Unsupported format — only CSV, XLSX, and XLS files are accepted');
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: `"${name}" is not a supported format. Please upload a CSV, XLSX, or XLS file.`,
        href: '/data-upload',
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setFile({
        name,
        size: `${(size / 1024).toFixed(1)} KB`,
        rows: 14832,
        cols: 12,
      });
      setIsProcessing(false);
      setStep('validate');
      addNotification({
        type: 'info',
        title: 'File Parsed',
        message: `"${name}" parsed successfully — 14,832 rows detected. Review column mapping before importing.`,
        href: '/data-upload',
      });
    }, 1500);
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    // Backend integration point: POST /api/datasets/import with mapped columns
    setTimeout(() => {
      setIsProcessing(false);
      setImportSuccess(true);
      toast.success('Dataset imported successfully — 14,832 rows ready for forecasting');
      addNotification({
        type: 'success',
        title: 'Data Upload Complete',
        message: `"${file?.name}" imported — 14,832 rows are now ready for forecasting.`,
        href: '/data-management',
      });
    }, 2000);
  };

  const resetWizard = () => {
    setStep('select');
    setFile(null);
    setImportSuccess(false);
    setIsProcessing(false);
  };

  if (importSuccess) {
    return (
      <div className="card-elevated p-8 flex flex-col items-center text-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--positive-bg)' }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--positive)' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Import Complete</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-semibold font-mono text-foreground">14,832 rows</span> ingested from{' '}
            <span className="font-semibold text-foreground">{file?.name}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Dataset ID: <span className="font-mono">ds-2026-047</span> · Status: Validating
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetWizard} className="btn-secondary">Upload Another</button>
          <button className="btn-primary">Run Forecast on This Dataset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated overflow-hidden">
      {/* Step Progress */}
      <div className="flex items-center px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isDone = steps.findIndex((x) => x.id === step) > i;
          return (
            <React.Fragment key={`step-${s.id}`}>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{
                    background: isDone ? 'var(--positive)' : isActive ? 'var(--primary)' : 'var(--muted)',
                    color: isDone || isActive ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {isDone ? <CheckCircle2 size={14} /> : s.num}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-3 h-px" style={{ background: isDone ? 'var(--positive)' : 'var(--border)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="p-6">
        {/* Step 1: Select File */}
        {step === 'select' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Upload Sales Data</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Accepted formats: CSV, XLSX, XLS · Max file size: 50 MB · Min 6 months of historical data required
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 transition-all duration-200 cursor-pointer ${isDragging ? 'drag-over' : ''}`}
              style={{
                borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
                background: isDragging ? 'var(--info-bg)' : 'var(--secondary)',
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload sales data file"
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="sr-only" onChange={handleFileSelect} />
              {isProcessing ? (
                <RefreshCw size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--info-bg)' }}
                >
                  <Upload size={28} style={{ color: 'var(--primary)' }} />
                </div>
              )}
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">
                  {isProcessing ? 'Parsing file…' : 'Drop your file here, or click to browse'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  CSV, XLSX, XLS up to 50 MB
                </p>
              </div>
            </div>

            {/* Required columns hint */}
            <div className="rounded-lg p-4" style={{ background: 'var(--muted)' }}>
              <p className="text-xs font-semibold text-foreground mb-2">Expected columns in your file:</p>
              <div className="flex flex-wrap gap-2">
                {['date', 'product_id', 'product_name', 'category', 'region', 'channel', 'quantity', 'unit_price', 'revenue', 'cost', 'discount', 'customer_id'].map((col) => (
                  <span key={`col-hint-${col}`} className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{ background: 'var(--card)', color: 'var(--muted-foreground)' }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Validate & Map */}
        {step === 'validate' && file && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Validate & Map Columns</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  Review auto-detected mapping and fix any issues before importing
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--muted)' }}>
                <FileText size={14} style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{file.name}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {file.rows.toLocaleString()} rows · {file.cols} cols · {file.size}
                  </p>
                </div>
              </div>
            </div>

            <ValidationErrors />
            <ColumnMapper />
            <DataPreviewTable />

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep('select')} className="btn-ghost">
                ← Back
              </button>
              <button onClick={() => setStep('confirm')} className="btn-primary">
                Continue to Confirm
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Import */}
        {step === 'confirm' && file && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Confirm Import</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Review the import summary before finalizing
              </p>
            </div>

            <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold text-foreground">Import Summary</h3>
              {[
                { label: 'File', value: file.name },
                { label: 'Total Rows', value: file.rows.toLocaleString() },
                { label: 'Columns Mapped', value: '12 / 12' },
                { label: 'Date Range', value: 'Jan 1, 2023 — Jun 30, 2026' },
                { label: 'Products Detected', value: '274 unique SKUs' },
                { label: 'Regions Detected', value: 'North America, EMEA, APAC, LATAM, India' },
                { label: 'Channels Detected', value: 'Direct, Partner Network, E-Commerce, Resellers' },
                { label: 'Missing Values', value: '0.4% (58 rows imputed)' },
                { label: 'Validation Warnings', value: '2 non-critical warnings' },
              ].map((item) => (
                <div key={`summary-${item.label}`} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                  <span className="font-medium text-foreground font-mono">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-4 flex gap-3" style={{ background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>2 Non-Critical Warnings</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  APAC region has 6 weeks of missing data (weeks 18–23). Values will be imputed using seasonal averages. Import will proceed.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep('validate')} className="btn-ghost">← Back</button>
              <button
                onClick={handleConfirmImport}
                disabled={isProcessing}
                className="btn-primary"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Confirm Import
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}