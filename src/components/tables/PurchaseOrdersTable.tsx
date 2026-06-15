'use client';

import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { PurchaseOrderRecord, SupplierRecord } from '@/data/types';

interface TableProps {
  data: PurchaseOrderRecord[];
  suppliers: SupplierRecord[];
  onDelete?: (id: string) => void;
}

export function PurchaseOrdersTable({ data, suppliers, onDelete }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-lg">
        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        <p className="text-slate-500 text-sm">No purchase orders found matching selected filter lists.</p>
      </div>
    );
  }

  const getSupplierName = (supplierId: string) => {
    const s = suppliers.find((supplier) => supplier.id === supplierId);
    return s ? s.name : 'Unknown Supplier';
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    approved: 'bg-blue-50 text-indigo-700 border-indigo-200',
    ordered: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
          <tr>
            <th className="px-6 py-4">PO Number</th>
            <th className="px-6 py-4">Supplier</th>
            <th className="px-6 py-4">Order Date</th>
            <th className="px-6 py-4">Expected Date</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 divide-solid">
          {data.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                {order.po_number}
              </td>
              <td className="px-6 py-4 text-slate-900 font-semibold">
                {getSupplierName(order.supplier_id)}
              </td>
              <td className="px-6 py-4">
                {order.order_date}
              </td>
              <td className="px-6 py-4">
                {order.expected_date || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    statusColors[order.status] || 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-mono font-medium text-slate-950">
                {order.currency || 'USD'} {order.total_amount?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <a
                    href={`/purchasing/purchase-orders/${order.id}`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-50 rounded"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href={`/purchasing/purchase-orders/${order.id}/edit`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-50 rounded"
                    title="Edit Order"
                  >
                    <Pencil className="w-4 h-4 text-indigo-500" />
                  </a>
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Are you absolutely certain you want to discard this purchase order?')) {
                          onDelete(order.id || '');
                        }
                      }}
                      className="p-1 hover:text-red-900 hover:bg-red-50 rounded"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
