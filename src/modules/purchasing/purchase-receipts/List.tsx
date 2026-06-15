'use client';

import React, { useState, useEffect } from 'react';
import { PurchaseReceiptsTable } from '@/components/tables/PurchaseReceiptsTable';
import { Plus, Search } from 'lucide-react';
import type { PurchaseReceiptRecord, PurchaseOrderRecord, WarehouseRecord } from '@/data/types';

export function PurchaseReceiptsList() {
  const [receipts, setReceipts] = useState<PurchaseReceiptRecord[]>([]);
  const [filtered, setFiltered] = useState<PurchaseReceiptRecord[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, pRes, wRes] = await Promise.all([
        fetch('/api/purchase-receipts'),
        fetch('/api/purchase-orders'),
        fetch('/api/warehouses'),
      ]);

      if (!rRes.ok || !pRes.ok || !wRes.ok) throw new Error('Unsuccessful dynamic request fetch');

      const rData = await rRes.json();
      const pData = await pRes.json();
      const wData = await wRes.json();

      setReceipts(rData);
      setFiltered(rData);
      setPurchaseOrders(pData);
      setWarehouses(wData);
    } catch (err: any) {
      setError(err.message || 'Failed loading purchase receipts list dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let list = [...receipts];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((receipt) => {
        const po = purchaseOrders.find((p) => p.id === receipt.purchase_order_id);
        return (
          receipt.receipt_number.toLowerCase().includes(q) ||
          (po && po.po_number.toLowerCase().includes(q))
        );
      });
    }

    if (warehouseFilter !== 'all') {
      list = list.filter((receipt) => receipt.warehouse_id === warehouseFilter);
    }

    setFiltered(list);
  }, [query, warehouseFilter, receipts, purchaseOrders]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/purchase-receipts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Action aborted by database rules');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to undo file receipt record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Goods Receipts</h1>
          <p className="text-slate-500 text-sm mt-1">Audit logs of merchandise delivered under active purchase requests.</p>
        </div>

        <a
          href="/purchasing/purchase-receipts/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Receive Goods
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by receipt number or purchase order code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm text-slate-900 bg-white focus:outline-none"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Storage Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <PurchaseReceiptsTable
          data={filtered}
          purchaseOrders={purchaseOrders}
          warehouses={warehouses}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
