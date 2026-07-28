import React from 'react';
import AppLayout from '@/components/AppLayout';
import ForecastConfigForm from './components/ForecastConfigForm';
import RunHistoryPanel from './components/RunHistoryPanel';

export default function ForecastConfigurationPage() {
  return (
    <AppLayout
      title="Forecast Configuration"
      subtitle="Set up and run a new forecast model"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ForecastConfigForm />
        </div>
        <div>
          <RunHistoryPanel />
        </div>
      </div>
    </AppLayout>
  );
}