'use client';

import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { PurchaseReceiptRecord, PurchaseOrderRecord, WarehouseRecord } from '@/data/types';

interface TableProps {
  data: PurchaseReceiptRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  warehouses: WarehouseRecord[];
  onDelete?: (id: string) => void;
}

export function PurchaseReceiptsTable({ data, purchaseOrders, warehouses, onDelete }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-lg">
        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        <p className="text-slate-500 text-sm">No recorded purchase goods receipts found.</p>
      </div>
    );
  }

  const getPONumber = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    return po ? po.po_number : 'Unknown PO';
  };

  const getWarehouseName = (warehouseId: string) => {
    const wh = warehouses.find((w) => w.id === warehouseId);
    return wh ? wh.name : 'Unknown Store';
  };

  const getFormattedDate = (timestamp: any) => {
    if (!timestamp) return '-';
    // If double field or Firestore server timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
          <tr>
            <th className="px-6 py-4">Receipt Number</th>
            <th className="px-6 py-4">Associated PO</th>
            <th className="px-6 py-4">Destination Store</th>
            <th className="px-6 py-4">Received Date</th>
            <th className="px-6 py-4">Filer ID</th>
            <th className="px-6 py-4">Comment</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 divide-solid">
          {data.map((receipt) => (
            <tr key={receipt.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                {receipt.receipt_number}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-800">
                {getPONumber(receipt.purchase_order_id)}
              </td>
              <td className="px-6 py-4">
                {getWarehouseName(receipt.warehouse_id)}
              </td>
              <td className="px-6 py-4 text-slate-700">
                {getFormattedDate(receipt.received_at)}
              </td>
              <td className="px-6 py-4 font-mono text-xs">
                {receipt.received_by_user_id || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4 italic text-slate-400 max-w-xs truncate">
                {receipt.notes || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <a
                    href={`/purchasing/purchase-receipts/${receipt.id}`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-50 rounded"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </a>
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Warning! Deleting is dangerous. Are you certain you want to delete this purchase receipt record?')) {
                          onDelete(receipt.id || '');
                        }
                      }}
                      className="p-1 hover:text-red-900 hover:bg-red-50 rounded"
                      title="Delete receipt record"
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
