'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const expectedColumns = [
  { id: 'col-date', expected: 'date', detected: 'transaction_date', type: 'Date', status: 'mapped' },
  { id: 'col-product-id', expected: 'product_id', detected: 'sku_code', type: 'String', status: 'mapped' },
  { id: 'col-product-name', expected: 'product_name', detected: 'product_desc', type: 'String', status: 'mapped' },
  { id: 'col-category', expected: 'category', detected: 'product_category', type: 'String', status: 'mapped' },
  { id: 'col-region', expected: 'region', detected: 'sales_region', type: 'String', status: 'warning' },
  { id: 'col-channel', expected: 'channel', detected: 'distribution_channel', type: 'String', status: 'mapped' },
  { id: 'col-quantity', expected: 'quantity', detected: 'units_sold', type: 'Integer', status: 'mapped' },
  { id: 'col-unit-price', expected: 'unit_price', detected: 'price_per_unit', type: 'Decimal', status: 'mapped' },
  { id: 'col-revenue', expected: 'revenue', detected: 'total_revenue', type: 'Decimal', status: 'error' },
  { id: 'col-cost', expected: 'cost', detected: 'cogs', type: 'Decimal', status: 'mapped' },
  { id: 'col-discount', expected: 'discount', detected: 'discount_pct', type: 'Decimal', status: 'mapped' },
  { id: 'col-customer-id', expected: 'customer_id', detected: 'client_id', type: 'String', status: 'mapped' },
];

export default function ColumnMapper() {
  const [mappings, setMappings] = useState(
    Object.fromEntries(expectedColumns?.map((c) => [c?.id, c?.detected]))
  );

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Column Mapping
      </p>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              {['Expected Field', 'Detected Column', 'Type', 'Status']?.map((h) => (
                <th key={`cm-h-${h}`} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expectedColumns?.map((col, i) => (
              <tr
                key={col?.id}
                style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--secondary)', borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">{col?.expected}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={mappings?.[col?.id]}
                    onChange={(e) => setMappings((prev) => ({ ...prev, [col?.id]: e?.target?.value }))}
                    className="input-field text-xs py-1 font-mono"
                    style={{ width: '180px' }}
                  >
                    <option value={col?.detected}>{col?.detected}</option>
                    <option value="— unmapped —">— unmapped —</option>
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {col?.type}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {col?.status === 'mapped' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--positive)' }}>
                      <CheckCircle2 size={13} /> Mapped
                    </span>
                  )}
                  {col?.status === 'warning' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--warning)' }}>
                      ⚠ Review
                    </span>
                  )}
                  {col?.status === 'error' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--negative)' }}>
                      <AlertCircle size={13} /> 1 error
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}