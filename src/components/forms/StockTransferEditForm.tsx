'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductRecord, WarehouseRecord, StockTransferRecord } from '@/data/types';

interface StockTransferEditFormProps {
  transfer: StockTransferRecord;
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function StockTransferEditForm({ transfer, products, warehouses }: StockTransferEditFormProps) {
  const router = useRouter();
  const [productId, setProductId] = useState(transfer.product_id || '');
  const [fromWarehouseId, setFromWarehouseId] = useState(transfer.from_warehouse_id || '');
  const [toWarehouseId, setToWarehouseId] = useState(transfer.to_warehouse_id || '');
  const [transferQuantity, setTransferQuantity] = useState<number>(transfer.transfer_quantity || 1);
  const [status, setStatus] = useState(transfer.status || 'requested');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fromWarehouseId === toWarehouseId) {
      setError('Origin and destination warehouses must be distinct');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/stock-transfers/${transfer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_warehouse_id: fromWarehouseId,
          to_warehouse_id: toWarehouseId,
          product_id: productId,
          transfer_quantity: Number(transferQuantity),
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update transfer');
      }

      router.push(`/inventory/stock-transfers/${transfer.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-slate-950">Update Stock Transfer</h2>
      
      {transfer.status === 'completed' && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded p-2">
          This transfer has already been labeled "completed". Changing specs now may require manual inventory level adjustments to fix balances.
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Product / Item *</label>
          <select
            required
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">-- Choose Item --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">From Workshop / Warehouse *</label>
            <select
              required
              value={fromWarehouseId}
              onChange={(e) => setFromWarehouseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">To Workshop / Warehouse *</label>
            <select
              required
              value={toWarehouseId}
              onChange={(e) => setToWarehouseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Transfer Quantity *</label>
          <input
            type="number"
            required
            min={1}
            value={transferQuantity}
            onChange={(e) => setTransferQuantity(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Transfer Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="requested">Requested (Draft)</option>
            <option value="in_transit">In Transit (Dispatched)</option>
            <option value="completed">Completed (Instantly Adjusts Stock)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push(`/inventory/stock-transfers/${transfer.id}`)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
