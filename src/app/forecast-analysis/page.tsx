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
      subtitle="Run a forecast to see detailed analysis"
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