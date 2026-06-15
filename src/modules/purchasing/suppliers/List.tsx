'use client';

import React, { useState, useEffect } from 'react';
import { SuppliersTable } from '@/components/tables/SuppliersTable';
import { Plus, Search } from 'lucide-react';
import type { SupplierRecord } from '@/data/types';

export function SuppliersList() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [filtered, setFiltered] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/suppliers');
      if (!res.ok) throw new Error('Unsuccessful database response');
      const data = await res.json();
      setSuppliers(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.message || 'Failed to list suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    let list = [...suppliers];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.contact_name && s.contact_name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      const active = statusFilter === 'active';
      list = list.filter((s) => (s.is_active !== false) === active);
    }

    setFiltered(list);
  }, [query, statusFilter, suppliers]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete supplier');
      fetchSuppliers();
    } catch (err: any) {
      alert(err.message || 'Delete operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suppliers Master</h1>
          <p className="text-slate-500 text-sm mt-1">Manage vendor contact details and locations.</p>
        </div>

        <a
          href="/purchasing/suppliers/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Supplier
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, supplier name or contact..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
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
        <SuppliersTable data={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
