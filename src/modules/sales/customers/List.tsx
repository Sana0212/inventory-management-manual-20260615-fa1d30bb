'use client';

import React, { useState, useEffect } from 'react';
import { CustomersTable } from '@/components/tables/CustomersTable';
import { Plus, Search } from 'lucide-react';
import type { CustomerRecord } from '@/data/types';

export function CustomersList() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [filtered, setFiltered] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Unsuccessful database response');
      const data = await res.json();
      setCustomers(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.message || 'Failed to list customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let list = [...customers];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.contact_name && c.contact_name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      const active = statusFilter === 'active';
      list = list.filter((c) => (c.is_active !== false) === active);
    }

    setFiltered(list);
  }, [query, statusFilter, customers]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete customer');
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Delete operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage active corporate and individual customer directory accounts.</p>
        </div>

        <a
          href="/sales/customers/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Customer
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name, contact or code..."
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <CustomersTable data={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
