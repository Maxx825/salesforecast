import React from 'react';
import AppLayout from '@/components/AppLayout';
import ReportTemplates from './components/ReportTemplates';
import ExportHistoryTable from './components/ExportHistoryTable';
import ScheduledExports from './components/ScheduledExports';

export default function ReportsExportPage() {
  return (
    <AppLayout
      title="Reports & Export"
      subtitle="Generate, schedule, and download forecast reports"
    >
      <div className="space-y-6">
        <ReportTemplates />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ExportHistoryTable />
          </div>
          <div>
            <ScheduledExports />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}