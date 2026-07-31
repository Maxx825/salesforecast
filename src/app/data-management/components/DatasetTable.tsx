'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ColumnProfiler from './ColumnProfiler';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Eye,
  Download,
  Archive,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

const allDatasets: Array<{
  id: string; name: string; source: string; rows: number; cols: number;
  dateRange: string; uploadedBy: string; uploadedAt: string; status: string;
  quality: number; missing: number; usedInRuns: number;
}> = [];

const PAGE_SIZE = 8;

type SortKey = 'name' | 'rows' | 'quality' | 'missing' | 'uploadedAt' | 'usedInRuns';

export default function DatasetTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('uploadedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [profilerDataset, setProfilerDataset] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const filtered = allDatasets.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string' && typeof bv === 'string')
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === paged.length ? [] : paged.map((d) => d.id));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleDelete = () => {
    setDeleteModal(null);
    toast.success('Dataset deleted — associated forecast runs remain intact');
  };

  const handleBulkArchive = () => {
    setSelected([]);
    toast.success(`${selected.length} datasets archived`);
  };

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
      style={{ color: sortKey === k ? 'var(--primary)' : 'var(--muted-foreground)' }}
      onClick={() => handleSort(k)}
    >
      <div className="flex items-center gap-1">{label}<ArrowUpDown size={10} /></div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Search datasets by name, ID, or uploader…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-8 h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} style={{ color: 'var(--muted-foreground)' }} />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field h-9 text-sm w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="stale">Stale</option>
            <option value="neutral">Archived</option>
            <option value="error">Error</option>
          </select>
        </div>
        <button
          className="btn-secondary text-xs h-9 gap-1.5"
          onClick={() => toast.info('Refreshing dataset quality scores…')}
        >
          <RefreshCw size={13} />
          Refresh Quality
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-lg"
          style={{ background: 'var(--info-bg)', border: '1px solid rgba(108,99,255,0.25)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            {selected.length} dataset{selected.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleBulkArchive} className="btn-ghost text-xs gap-1.5">
              <Archive size={13} />
              Archive Selected
            </button>
            <button
              onClick={() => toast.error('Bulk delete requires individual confirmation')}
              className="btn-danger text-xs"
            >
              <Trash2 size={13} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === paged.length && paged.length > 0}
                    onChange={toggleAll}
                    className="accent-primary"
                  />
                </th>
                <SortTh label="Dataset" k="name" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>Source</th>
                <SortTh label="Rows" k="rows" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>Date Range</th>
                <SortTh label="Quality" k="quality" />
                <SortTh label="Missing %" k="missing" />
                <SortTh label="Used In" k="usedInRuns" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>Uploaded By</th>
                <SortTh label="Upload Date" k="uploadedAt" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRowSkeleton key={`skel-row-${i}`} cols={12} />
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={12}>
                    <EmptyState
                      icon={<Database size={28} />}
                      title="No datasets yet"
                      description="No data yet — upload a file to get started"
                    />
                  </td>
                </tr>
              ) : (
                paged.map((ds, i) => (
                  <tr
                    key={ds.id}
                    className="transition-colors duration-100"
                    style={{
                      background: selected.includes(ds.id)
                        ? 'var(--info-bg)'
                        : i % 2 === 0 ? 'var(--card)' : 'var(--secondary)',
                      borderBottom: '1px solid var(--border)',
                    }}
                    onMouseEnter={(e) => {
                      if (!selected.includes(ds.id)) e.currentTarget.style.background = 'var(--muted)';
                    }}
                    onMouseLeave={(e) => {
                      if (!selected.includes(ds.id))
                        e.currentTarget.style.background = i % 2 === 0 ? 'var(--card)' : 'var(--secondary)';
                    }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(ds.id)}
                        onChange={() => toggleSelect(ds.id)}
                        className="accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{ds.name}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ds.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                        {ds.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-sm" style={{ color: 'var(--foreground)' }}>
                      {ds.rows > 0 ? ds.rows.toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                      {ds.dateRange}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ background: 'var(--muted)' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${ds.quality}%`,
                              background: ds.quality >= 95 ? 'var(--positive)' : ds.quality >= 88 ? 'var(--warning)' : 'var(--negative)',
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-mono font-semibold tabular-nums"
                          style={{ color: ds.quality >= 95 ? 'var(--positive)' : ds.quality >= 88 ? 'var(--warning)' : 'var(--negative)' }}
                        >
                          {ds.quality > 0 ? `${ds.quality}%` : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-mono font-semibold tabular-nums"
                        style={{ color: ds.missing > 1.5 ? 'var(--negative)' : ds.missing > 0.5 ? 'var(--warning)' : 'var(--positive)' }}
                      >
                        {ds.missing > 0 ? `${ds.missing}%` : '0%'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
                      {ds.usedInRuns}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                      {ds.uploadedBy}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                      {ds.uploadedAt}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ds.status as any} dot>{ds.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="btn-ghost h-7 w-7 p-0 justify-center"
                          title="View column profile"
                          onClick={() => setProfilerDataset(ds.id)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn-ghost h-7 w-7 p-0 justify-center"
                          title="Download dataset"
                          onClick={() => toast.success(`Downloading ${ds.name}`)}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          className="btn-ghost h-7 w-7 p-0 justify-center"
                          title="Delete dataset"
                          style={{ color: 'var(--negative)' }}
                          onClick={() => setDeleteModal(ds.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Showing {sorted.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(page * PAGE_SIZE, sorted.length)} of{' '}
            <span className="font-semibold text-foreground">{sorted.length}</span> datasets
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost h-8 w-8 p-0 justify-center disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className="h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: page === i + 1 ? 'var(--primary)' : 'transparent',
                  color: page === i + 1 ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost h-8 w-8 p-0 justify-center disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Column Profiler Modal */}
      <Modal
        open={profilerDataset !== null}
        onClose={() => setProfilerDataset(null)}
        title={`Column Profile — ${allDatasets.find((d) => d.id === profilerDataset)?.name || ''}`}
        size="xl"
      >
        <ColumnProfiler datasetId={profilerDataset} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        title="Delete Dataset"
        size="sm"
      >
        <div className="flex gap-3 p-3 rounded-lg mb-4" style={{ background: 'var(--negative-bg)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--negative)' }} />
          <p className="text-xs" style={{ color: 'var(--negative)' }}>
            This dataset is used in{' '}
            <strong>{allDatasets.find((d) => d.id === deleteModal)?.usedInRuns || 0} forecast runs</strong>.
            Deleting it will not remove those runs but they will lose their source reference.
          </p>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Are you sure you want to permanently delete{' '}
          <strong className="text-foreground">{allDatasets.find((d) => d.id === deleteModal)?.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteModal(null)} className="btn-ghost">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete Dataset</button>
        </div>
      </Modal>
    </div>
  );
}