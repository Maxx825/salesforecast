import React from 'react';
import AppLayout from '@/components/AppLayout';
import DataUploadWizard from './components/DataUploadWizard';
import ExistingDatasets from './components/ExistingDatasets';

export default function DataUploadPage() {
  return (
    <AppLayout
      title="Data Upload"
      subtitle="Import historical sales data for forecasting"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DataUploadWizard />
        </div>
        <div>
          <ExistingDatasets />
        </div>
      </div>
    </AppLayout>
  );
}