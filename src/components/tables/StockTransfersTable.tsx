'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { StockTransferRecord, ProductRecord, WarehouseRecord } from '@/data/types';

interface StockTransfersTableProps {
  transfers: StockTransferRecord[];
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function StockTransfersTable({ transfers, products, warehouses }: StockTransfersTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getProduct = (id: string) => products.find((p) => p.id === id);
  const getWarehouse = (id: string) => warehouses.find((w) => w.id === id);

  const flatTransfers = transfers.map((t) => {
    const prod = getProduct(t.product_id);
    const fromWh = getWarehouse(t.from_warehouse_id);
    const toWh = getWarehouse(t.to_warehouse_id);

    return {
      ...t,
      productName: prod?.name || 'Unknown SKU',
      productSku: prod?.sku || 'UNKNOWN',
      fromName: fromWh ? `${fromWh.name} (${fromWh.code})` : 'Unknown Warehouse',
      toName: toWh ? `${toWh.name} (${toWh.code})` : 'Unknown Warehouse',
    };
  });

  const filtered = flatTransfers.filter((t) => {
    const term = search.toLowerCase();
    const matchesSearch =
      t.productName.toLowerCase().includes(term) ||
      t.productSku.toLowerCase().includes(term) ||
      t.fromName.toLowerCase().includes(term) ||
      t.toName.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm('Are you certain you wish to discard this stock transfer record? Abandoned records cannot be easily recovered.')) return;

    try {
      const res = await fetch(`/api/stock-transfers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const body = await res.json();
        alert(body.error || 'Failed to discard transfer');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Requested / Draft</span>;
      case 'in_transit':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">In Transit</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-slate md:items-center bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search routing by dispatch location or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-slate-900 border-slate-300 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Routing Statuses</option>
            <option value="requested">Requested / Pending</option>
            <option value="in_transit">In Transit / Dispatched</option>
            <option value="completed">Completed Depolarisations</option>
            <option value="cancelled">Cancelled Moves</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium font-bold">
            No stock transport logs match defined criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold uppercase text-slate-500">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Source Dispatch Location</th>
                  <th className="p-3">Target Transit Destination</th>
                  <th className="p-3">Moving Volume Qty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-900 text-sm animate-fade-in">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-slate-500">{item.productSku}</td>
                    <td className="p-3 font-bold text-slate-950">{item.productName}</td>
                    <td className="p-3 text-slate-600 font-medium">{item.fromName}</td>
                    <td className="p-3 text-slate-600 font-medium">{item.toName}</td>
                    <td className="p-3 font-mono font-semibold text-indigo-800">{item.transfer_quantity}</td>
                    <td className="p-3">{getStatusBadge(item.status)}</td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/inventory/stock-transfers/${item.id}`}
                        className="inline-flex p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
                        title="View dispatch checklist"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/inventory/stock-transfers/${item.id}/edit`}
                        className="inline-flex p-1.5 rounded text-amber-600 hover:bg-amber-50"
                        title="Update checklist properties"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex p-1.5 rounded text-red-600 hover:bg-red-50"
                        title="Discard transport log"
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
