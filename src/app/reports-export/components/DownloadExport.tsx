'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, BarChart2, RefreshCw, CheckCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type ExportFormat = 'CSV' | 'Excel' | 'PDF';
type DataType = 'forecasts' | 'segments' | 'accuracy';

interface DataOption {
  id: DataType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const dataOptions: DataOption[] = [
  {
    id: 'forecasts',
    label: 'Forecast Data',
    description: 'Actual vs. predicted values, confidence intervals, and projected revenue by period.',
    icon: BarChart2,
    color: 'var(--primary)',
    bg: 'var(--info-bg)',
  },
  {
    id: 'segments',
    label: 'Segment Data',
    description: 'Performance breakdown by region, channel, and category with growth metrics.',
    icon: Table,
    color: 'var(--positive)',
    bg: 'var(--positive-bg)',
  },
  {
    id: 'accuracy',
    label: 'Accuracy Metrics',
    description: 'MAPE, RMSE, R², CI Width, Bias, and model diagnostics per segment.',
    icon: FileText,
    color: 'var(--warning)',
    bg: 'var(--warning-bg)',
  },
];

function generateCSV(dataType: DataType): string {
  if (dataType === 'forecasts') {
    const rows = [
      ['Period', 'Actual', 'Predicted', 'CI Lower', 'CI Upper', 'Projected Revenue'],
      ['Jan 2026', '142000', '138500', '131000', '146000', '$142,000'],
      ['Feb 2026', '155000', '152000', '144000', '160000', '$155,000'],
      ['Mar 2026', '168000', '165000', '156000', '174000', '$168,000'],
      ['Apr 2026', '172000', '170000', '161000', '179000', '$172,000'],
      ['May 2026', '181000', '178000', '169000', '187000', '$181,000'],
      ['Jun 2026', '195000', '192000', '182000', '202000', '$195,000'],
      ['Jul 2026', '—', '205000', '194000', '216000', '$205,000 (forecast)'],
      ['Aug 2026', '—', '218000', '206000', '230000', '$218,000 (forecast)'],
    ];
    return rows.map((r) => r.join(',')).join('\n');
  }
  if (dataType === 'segments') {
    const rows = [
      ['Segment', 'Category', 'Actual', 'Predicted', 'Growth %', 'Status'],
      ['North Region', 'Region', '48200', '46500', '+3.7%', 'On Track'],
      ['South Region', 'Region', '39100', '40200', '-2.7%', 'Below Target'],
      ['East Region', 'Region', '52300', '51000', '+2.5%', 'On Track'],
      ['West Region', 'Region', '55400', '54100', '+2.4%', 'On Track'],
      ['Online Channel', 'Channel', '71000', '68500', '+3.6%', 'On Track'],
      ['Retail Channel', 'Channel', '62000', '63200', '-1.9%', 'Below Target'],
      ['Enterprise Channel', 'Channel', '62000', '60800', '+2.0%', 'On Track'],
      ['Electronics', 'Category', '58000', '56200', '+3.2%', 'On Track'],
      ['Apparel', 'Category', '47000', '48100', '-2.3%', 'Below Target'],
      ['Home & Garden', 'Category', '90000', '87700', '+2.6%', 'On Track'],
    ];
    return rows.map((r) => r.join(',')).join('\n');
  }
  // accuracy
  const rows = [
    ['Segment', 'MAPE (%)', 'RMSE', 'R²', 'CI Width', 'Bias', 'Status'],
    ['North Region', '3.65', '1760', '0.94', '9500', '+0.8%', 'Good'],
    ['South Region', '5.12', '2050', '0.91', '11200', '-1.2%', 'Acceptable'],
    ['East Region', '2.88', '1510', '0.96', '8800', '+0.3%', 'Excellent'],
    ['West Region', '3.10', '1680', '0.95', '9100', '+0.5%', 'Good'],
    ['Online Channel', '3.64', '2500', '0.95', '12000', '+0.7%', 'Good'],
    ['Retail Channel', '4.30', '2710', '0.92', '13200', '-0.9%', 'Acceptable'],
    ['Enterprise Channel', '3.28', '1990', '0.94', '10400', '+0.4%', 'Good'],
  ];
  return rows.map((r) => r.join(',')).join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateAndDownload(dataType: DataType, format: ExportFormat) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const baseName = `salesforecast_${dataType}_${timestamp}`;

  if (format === 'CSV') {
    const csv = generateCSV(dataType);
    downloadFile(csv, `${baseName}.csv`, 'text/csv;charset=utf-8;');
    return;
  }

  if (format === 'Excel') {
    // Generate a simple TSV wrapped in Excel-compatible format
    const csv = generateCSV(dataType).replace(/,/g, '\t');
    downloadFile(csv, `${baseName}.xls`, 'application/vnd.ms-excel');
    return;
  }

  // PDF — generate an HTML-based printable document and trigger print-to-PDF
  const csv = generateCSV(dataType);
  const rows = csv.split('\n').map((r) => r.split(','));
  const headers = rows[0];
  const body = rows.slice(1);

  const labelMap: Record<DataType, string> = {
    forecasts: 'Forecast Data',
    segments: 'Segment Data',
    accuracy: 'Accuracy Metrics',
  };

  const tableRows = body
    .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #ddd;padding:6px 10px;font-size:12px;">${cell}</td>`).join('')}</tr>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${labelMap[dataType]} — SalesForecast</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p { font-size: 12px; color: #666; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #1a56db; color: white; padding: 8px 10px; font-size: 12px; text-align: left; }
        tr:nth-child(even) { background: #f9fafb; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${labelMap[dataType]}</h1>
      <p>Generated by SalesForecast · ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}

export default function DownloadExport() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('CSV');
  const [downloading, setDownloading] = useState<DataType | null>(null);
  const [downloaded, setDownloaded] = useState<DataType | null>(null);

  const handleDownload = (dataType: DataType) => {
    setDownloading(dataType);
    setTimeout(() => {
      generateAndDownload(dataType, selectedFormat);
      setDownloading(null);
      setDownloaded(dataType);
      setTimeout(() => setDownloaded(null), 2500);
    }, 800);
  };

  const formats: ExportFormat[] = ['CSV', 'Excel', 'PDF'];

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Download Data</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Export forecasts, segments, and accuracy metrics in your preferred format
          </p>
        </div>
        {/* Format Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFormat(f)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
              style={{
                background: selectedFormat === f ? 'var(--card)' : 'transparent',
                color: selectedFormat === f ? 'var(--foreground)' : 'var(--muted-foreground)',
                boxShadow: selectedFormat === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {dataOptions.map((opt) => {
          const Icon = opt.icon;
          const isDownloading = downloading === opt.id;
          const isDone = downloaded === opt.id;

          return (
            <div
              key={opt.id}
              className="flex flex-col gap-3 p-4 rounded-xl"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: opt.bg }}
                >
                  <Icon size={18} style={{ color: opt.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {opt.description}
              </p>
              <button
                onClick={() => handleDownload(opt.id)}
                disabled={isDownloading}
                className="btn-primary w-full justify-center text-xs py-2"
                style={isDone ? { background: 'var(--positive)' } : {}}
              >
                {isDownloading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Preparing…
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle size={13} />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    Download {selectedFormat}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
