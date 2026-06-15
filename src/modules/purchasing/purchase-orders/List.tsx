'use client';

import React, { useState, useEffect } from 'react';
import { PurchaseOrdersTable } from '@/components/tables/PurchaseOrdersTable';
import { Plus, Search } from 'lucide-react';
import type { PurchaseOrderRecord, SupplierRecord } from '@/data/types';

export function PurchaseOrdersList() {
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([]);
  const [filtered, setFiltered] = useState<PurchaseOrderRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [oRes, sRes] = await Promise.all([
        fetch('/api/purchase-orders'),
        fetch('/api/suppliers'),
      ]);

      if (!oRes.ok || !sRes.ok) throw new Error('Database server failure');

      const oData = await oRes.json();
      const sData = await sRes.json();

      setOrders(oData);
      setFiltered(oData);
      setSuppliers(sData);
    } catch (err: any) {
      setError(err.message || 'Error pulling orders list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let list = [...orders];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((order) => {
        const sup = suppliers.find((s) => s.id === order.supplier_id);
        return (
          order.po_number.toLowerCase().includes(q) ||
          (sup && sup.name.toLowerCase().includes(q))
        );
      });
    }

    if (statusFilter !== 'all') {
      list = list.filter((order) => order.status === statusFilter);
    }

    setFiltered(list);
  }, [query, statusFilter, orders, suppliers]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete order failed');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Command was rejected');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Manage purchase agreements, billing totals and receiving statuses.</p>
        </div>

        <a
          href="/purchasing/purchase-orders/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create PO
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by purchase order number or supplier name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm text-slate-900 bg-white focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
        <PurchaseOrdersTable data={filtered} suppliers={suppliers} onDelete={handleDelete} />
      )}
    </div>
  );
}
