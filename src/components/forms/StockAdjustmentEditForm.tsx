'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StockAdjustmentRecord } from '@/data/types';

interface StockAdjustmentEditFormProps {
  adjustment: StockAdjustmentRecord;
}

export default function StockAdjustmentEditForm({ adjustment }: StockAdjustmentEditFormProps) {
  const router = useRouter();
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(adjustment.adjustment_quantity || 0);
  const [reason, setReason] = useState(adjustment.reason || '');
  const [reference, setReference] = useState(adjustment.reference || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/stock-adjustments/${adjustment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: adjustment.product_id,
          warehouse_id: adjustment.warehouse_id,
          adjustment_quantity: Number(adjustmentQuantity),
          reason,
          reference: reference || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update adjustment record');
      }

      router.push(`/inventory/stock-adjustments/${adjustment.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-slate-950">Edit Stock Adjustment Audit Reference</h2>
      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Adjustment Quantity</label>
          <input
            type="number"
            disabled
            value={adjustmentQuantity}
            className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 text-slate-500 border p-2 text-sm cursor-not-allowed"
          />
          <span className="text-xs text-slate-400 mt-1 block">
            Quantity amount modification is prohibited after physical execution to prevent stock ledger imbalances.
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Modified Auditor Reason *</label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Slip / Invoice Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push(`/inventory/stock-adjustments/${adjustment.id}`)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Update Audit Log'}
          </button>
        </div>
      </form>
    </div>
  );
}
