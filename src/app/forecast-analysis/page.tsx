'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import AnalysisFilterPanel from './components/AnalysisFilterPanel';
import AnalysisMainChart from './components/AnalysisMainChart';
import AccuracyMetricsTable from './components/AccuracyMetricsTable';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import { useDatasets } from '@/contexts/DatasetContext';

export default function ForecastAnalysisPage() {
  const { forecastRuns, latestForecast, isLoadingForecasts } = useDatasets();
  const completedRuns = forecastRuns?.filter((r) => r?.status === 'completed');

  const [selectedRunId, setSelectedRunId] = useState<string>('');

  // Auto-select the latest completed run when data loads
  useEffect(() => {
    if (!selectedRunId && latestForecast) {
      setSelectedRunId(latestForecast?.id);
    }
  }, [latestForecast, selectedRunId]);

  const selectedRun = completedRuns?.find((r) => r?.id === selectedRunId) ?? latestForecast ?? null;
  const forecastData = selectedRun?.forecastData ?? [];
  const segmentData = selectedRun?.segmentData ?? [];

  return (
    <AppLayout
      title="Forecast Analysis"
      subtitle={
        selectedRun
          ? `Showing: ${selectedRun?.runName} · ${selectedRun?.model}`
          : 'Run a forecast to see detailed analysis'
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {/* Filter panel */}
        <div className="xl:col-span-1">
          <AnalysisFilterPanel
            selectedRunId={selectedRunId}
            onSelectRun={setSelectedRunId}
          />
        </div>
        {/* Main content */}
        <div className="xl:col-span-3 space-y-6">
          <AnalysisMainChart
            data={forecastData}
            runName={selectedRun?.runName}
            model={selectedRun?.model}
          />
          <AccuracyMetricsTable
            segmentData={segmentData}
            model={selectedRun?.model}
          />
          <DiagnosticsPanel data={forecastData} />
        </div>
      </div>
    </AppLayout>
  );
}