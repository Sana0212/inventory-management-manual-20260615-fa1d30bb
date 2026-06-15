'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductRecord, WarehouseRecord } from '@/data/types';

interface ProductEditFormProps {
  product: ProductRecord;
  warehouses: WarehouseRecord[];
}

export default function ProductEditForm({ product, warehouses }: ProductEditFormProps) {
  const router = useRouter();
  const [sku, setSku] = useState(product.sku || '');
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [unitOfMeasure, setUnitOfMeasure] = useState(product.unit_of_measure || 'pcs');
  const [category, setCategory] = useState(product.category || '');
  const [defaultWarehouseId, setDefaultWarehouseId] = useState(product.default_warehouse_id || '');
  const [reorderLevel, setReorderLevel] = useState<number>(product.reorder_level || 0);
  const [costPrice, setCostPrice] = useState<number>(product.cost_price || 0);
  const [salesPrice, setSalesPrice] = useState<number>(product.sales_price || 0);
  const [isActive, setIsActive] = useState(product.is_active !== false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          name,
          description: description || undefined,
          unit_of_measure: unitOfMeasure,
          category: category || undefined,
          default_warehouse_id: defaultWarehouseId || undefined,
          reorder_level: Number(reorderLevel) || 0,
          cost_price: Number(costPrice) || 0,
          sales_price: Number(salesPrice) || 0,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push(`/inventory/products/${product.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-slate-950">Edit Master Product</h2>
      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">SKU / Item Code *</label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm h-20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Unit of Measure *</label>
            <input
              type="text"
              required
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Default Warehouse</label>
            <select
              value={defaultWarehouseId}
              onChange={(e) => setDefaultWarehouseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="">-- Select default location --</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Reorder Level Min Qty</label>
            <input
              type="number"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Cost Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Sales Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={salesPrice}
              onChange={(e) => setSalesPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
            Product active for operations
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push(`/inventory/products/${product.id}`)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
