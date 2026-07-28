import React from 'react';
import AppLayout from '@/components/AppLayout';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import ActualVsPredictedChart from './components/ActualVsPredictedChart';
import SegmentPerformanceChart from './components/SegmentPerformanceChart';
import RecentForecastRuns from './components/RecentForecastRuns';
import AlertsPanel from './components/AlertsPanel';

export default function ForecastingDashboardPage() {
  return (
    <AppLayout
      title="Forecasting Dashboard"
      subtitle="Q3 2026 · Prophet Model · 12-week horizon"
      lastUpdated="2 min ago"
    >
      <div className="space-y-6">
        <MetricsBentoGrid />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ActualVsPredictedChart />
          </div>
          <div>
            <AlertsPanel />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SegmentPerformanceChart />
          </div>
          <div>
            <RecentForecastRuns />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}