import React from 'react';

// Backend integration point: replace with first 8 rows of parsed file
const previewRows = [
  { id: 'prev-001', date: '01/03/2023', sku: 'ENT-4821', product: 'Enterprise Suite Pro', category: 'Enterprise Suite', region: 'North America', channel: 'Direct Sales', qty: 12, price: '₹4,200', revenue: '₹50,400', cost: '₹18,900', discount: '5%', customerId: 'C-00142' },
  { id: 'prev-002', date: '01/04/2023', sku: 'SMB-1103', product: 'SMB Growth Plan', category: 'SMB Plans', region: 'EMEA', channel: 'Partner Network', qty: 34, price: '₹890', revenue: '₹30,260', cost: '₹10,591', discount: '0%', customerId: 'C-00287' },
  { id: 'prev-003', date: '01/05/2023', sku: 'ADD-0092', product: 'Analytics Add-on', category: 'Add-ons', region: 'APAC', channel: 'E-Commerce', qty: 58, price: '₹350', revenue: '₹20,300', cost: '₹6,090', discount: '8%', customerId: 'C-00491' },
  { id: 'prev-004', date: '01/06/2023', sku: 'ENT-4821', product: 'Enterprise Suite Pro', category: 'Enterprise Suite', region: 'LATAM', channel: 'Resellers', qty: 5, price: '₹4,200', revenue: '₹21,000', cost: '₹7,875', discount: '10%', customerId: 'C-00088' },
  { id: 'prev-005', date: '01/07/2023', sku: 'SVC-2241', product: 'Implementation Services', category: 'Professional Svcs', region: 'North America', channel: 'Direct Sales', qty: 3, price: '₹8,500', revenue: '₹25,500', cost: '₹12,750', discount: '0%', customerId: 'C-00342' },
  { id: 'prev-006', date: '01/09/2023', sku: 'SMB-1104', product: 'SMB Starter Plan', category: 'SMB Plans', region: 'India', channel: 'E-Commerce', qty: 87, price: '₹290', revenue: '₹25,230', cost: '₹8,831', discount: '3%', customerId: 'C-00621' },
  { id: 'prev-007', date: '01/10/2023', sku: 'ADD-0093', product: 'API Access Add-on', category: 'Add-ons', region: 'EMEA', channel: 'Direct Sales', qty: 22, price: '₹480', revenue: '₹10,560', cost: '₹3,168', discount: '0%', customerId: 'C-00178' },
  { id: 'prev-008', date: '01/11/2023', sku: 'TRN-0041', product: 'Admin Training Bundle', category: 'Training', region: 'North America', channel: 'Partner Network', qty: 14, price: '₹1,200', revenue: '₹16,800', cost: '₹5,040', discount: '5%', customerId: 'C-00509' },
];

const cols = ['Date', 'SKU', 'Product', 'Category', 'Region', 'Channel', 'Qty', 'Unit Price', 'Revenue', 'Cost', 'Discount', 'Customer ID'];

export default function DataPreviewTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
          Data Preview — First 8 Rows
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          14,832 total rows in file
        </p>
      </div>
      <div className="rounded-xl overflow-hidden overflow-x-auto scrollbar-thin" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-xs whitespace-nowrap">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              {cols?.map((c) => (
                <th key={`prev-h-${c}`} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows?.map((row, i) => (
              <tr
                key={row?.id}
                style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--secondary)', borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-3 py-2 font-mono">{row?.date}</td>
                <td className="px-3 py-2 font-mono" style={{ color: 'var(--primary)' }}>{row?.sku}</td>
                <td className="px-3 py-2 max-w-[160px] truncate">{row?.product}</td>
                <td className="px-3 py-2">{row?.category}</td>
                <td className="px-3 py-2">{row?.region}</td>
                <td className="px-3 py-2">{row?.channel}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-right">{row?.qty}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-right">{row?.price}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-right" style={{ color: 'var(--positive)' }}>{row?.revenue}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-right">{row?.cost}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-right">{row?.discount}</td>
                <td className="px-3 py-2 font-mono" style={{ color: 'var(--muted-foreground)' }}>{row?.customerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}