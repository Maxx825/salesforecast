import React from 'react';
import AppLayout from '@/components/AppLayout';
import DatasetTable from './components/DatasetTable';

export default function DataManagementPage() {
  return (
    <AppLayout
      title="Data Management"
      subtitle="Manage uploaded datasets, quality scores, and column profiles"
    >
      <DatasetTable />
    </AppLayout>
  );
}