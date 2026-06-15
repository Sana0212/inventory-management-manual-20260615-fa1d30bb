'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductRecord, WarehouseRecord } from '@/data/types';

interface StockAdjustmentCreateFormProps {
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function StockAdjustmentCreateForm({ products, warehouses }: StockAdjustmentCreateFormProps) {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [reason, setReason] = useState('Stock count discrepancy correction');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId || !warehouseId) {
      setError('Product and Warehouse must be selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stock-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          warehouse_id: warehouseId,
          adjustment_quantity: Number(adjustmentQuantity),
          reason,
          reference: reference || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to file stock adjustment');
      }

      router.push('/inventory/stock-adjustments');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-slate-950">File Manual Inventory Adjustment</h2>
      <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded border border-dashed border-slate-200">
        Filing this adjustment will immediately modify the on-hand stock and available quantity indicators in the selected warehouse.
      </p>

      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Product *</label>
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
          <div>
            <label className="block text-sm font-medium text-slate-700">Location / Warehouse *</label>
            <select
              required
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="">-- Choose Location --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Adjustment Quantity (Can be negative for write-offs or shrinkage) *
          </label>
          <input
            type="number"
            required
            value={adjustmentQuantity}
            onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="e.g. -5 for damage, +12 for found stock"
          />
          <span className="text-xs text-slate-500 mt-1 block">
            Negative values subtract from stock, positive values increase stock.
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Reason for Adjustment / Auditor Notes *</label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="e.g. Broken packaging discovered, annual recount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Internal Slip / Reference Code</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="e.g. AUDIT-2023-OCT"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/inventory/stock-adjustments')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Filing...' : 'Execute Adjustment'}
          </button>
        </div>
      </form>
    </div>
  );
}
