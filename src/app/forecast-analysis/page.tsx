import React from 'react';
import AppLayout from '@/components/AppLayout';
import AnalysisFilterPanel from './components/AnalysisFilterPanel';
import AnalysisMainChart from './components/AnalysisMainChart';
import AccuracyMetricsTable from './components/AccuracyMetricsTable';
import DiagnosticsPanel from './components/DiagnosticsPanel';

export default function ForecastAnalysisPage() {
  return (
    <AppLayout
      title="Forecast Analysis"
      subtitle="run-2026-041 · Prophet · All Regions · Jul 28, 2026"
      lastUpdated="14:32 today"
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {/* Filter panel */}
        <div className="xl:col-span-1">
          <AnalysisFilterPanel />
        </div>
        {/* Main content */}
        <div className="xl:col-span-3 space-y-6">
          <AnalysisMainChart />
          <AccuracyMetricsTable />
          <DiagnosticsPanel />
        </div>
      </div>
    </AppLayout>
  );
}