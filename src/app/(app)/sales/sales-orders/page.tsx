'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Loader2, ArrowLeft } from 'lucide-react';
import { SalesOrdersTable } from '@/components/tables/SalesOrdersTable';
import type { SalesOrderRecord } from '@/data/types';

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSalesOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/sales-orders');
      if (!res.ok) {
        throw new Error('Failed to retrieve sales orders registry');
      }
      const data = await res.json();
      setSalesOrders(data);
    } catch (err: any) {
      setError(err?.message || 'Error occurred listing sales orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sales-orders/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete sales order');
      }
      setSalesOrders((prev) => prev.filter((so) => so.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to complete deletion action');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-650" />
          <p className="text-sm text-slate-500 font-medium">Extracting Sales Orders Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, track and dispatch customer sales orders, reserve quantities and inspect statuses.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sales/customers"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-55 transition"
          >
            Manage Customers
          </Link>
          <Link
            href="/sales/sales-orders/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" /> Create Sales Order
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-750 text-sm p-4 rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <SalesOrdersTable data={salesOrders} onDelete={handleDelete} />
      )}
    </div>
  );
}
