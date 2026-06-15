'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { StockAdjustmentRecord, ProductRecord, WarehouseRecord } from '@/data/types';

interface StockAdjustmentsTableProps {
  adjustments: StockAdjustmentRecord[];
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function StockAdjustmentsTable({ adjustments, products, warehouses }: StockAdjustmentsTableProps) {
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const getProduct = (id: string) => products.find((p) => p.id === id);
  const getWarehouse = (id: string) => warehouses.find((w) => w.id === id);

  const entries = adjustments.map((adj) => {
    const prod = getProduct(adj.product_id);
    const wh = getWarehouse(adj.warehouse_id);

    return {
      ...adj,
      productName: prod?.name || 'Unknown Product',
      productSku: prod?.sku || 'UNKNOWN',
      warehouseName: wh ? `${wh.name} (${wh.code})` : 'Unknown Location',
    };
  });

  const filtered = entries.filter((entry) => {
    const term = search.toLowerCase();
    const matchesSearch =
      entry.productName.toLowerCase().includes(term) ||
      entry.productSku.toLowerCase().includes(term) ||
      entry.reason.toLowerCase().includes(term) ||
      (entry.reference || '').toLowerCase().includes(term);

    const matchesWarehouse = !warehouseId || entry.warehouse_id === warehouseId;

    return matchesSearch && matchesWarehouse;
  });

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm('Warning: Deleting this audit reference logic will NOT undo physical stock movements. It only purges audit history. Proceed with deletion?')) return;

    try {
      const res = await fetch(`/api/stock-adjustments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const body = await res.json();
        alert(body.error || 'Failed to remove adjustment entry');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search adjustments by reason, code, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-slate-905 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-slate-900"
          />
        </div>

        <div>
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="border text-slate-905 border-slate-300 rounded-md p-2 text-xs focus:ring-1 text-slate-900 focus:ring-indigo-500"
          >
            <option value="">All Adjustment Depots</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            No stock adjustments matches defined filtering criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold uppercase text-slate-500">
                  <th className="p-3">Reference Slip</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Item</th>
                  <th className="p-3">Warehouse Location</th>
                  <th className="p-3">Adjustment Delta Qty</th>
                  <th className="p-3">Auditor Reason Statement</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-900 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold font-mono text-slate-600">{item.reference || 'N/A'}</td>
                    <td className="p-3 font-mono font-medium text-slate-500">{item.productSku}</td>
                    <td className="p-3 font-semibold text-slate-950">{item.productName}</td>
                    <td className="p-3 text-slate-600">{item.warehouseName}</td>
                    <td className="p-3">
                      {item.adjustment_quantity > 0 ? (
                        <span className="text-green-700 font-extrabold font-mono">+{item.adjustment_quantity}</span>
                      ) : (
                        <span className="text-red-700 font-extrabold font-mono">{item.adjustment_quantity}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 italic max-w-xs truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/inventory/stock-adjustments/${item.id}`}
                        className="inline-flex p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
                        title="Display audit slip detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/inventory/stock-adjustments/${item.id}/edit`}
                        className="inline-flex p-1.5 rounded text-amber-600 hover:bg-amber-50"
                        title="Modify audit notes"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex p-1.5 rounded text-red-600 hover:bg-red-50"
                        title="Delete audit reference record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
