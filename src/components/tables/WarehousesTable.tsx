'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Search, Warehouse } from 'lucide-react';
import { WarehouseRecord } from '@/data/types';

interface WarehousesTableProps {
  warehouses: WarehouseRecord[];
}

export default function WarehousesTable({ warehouses }: WarehousesTableProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = warehouses.filter((w) => {
    const term = search.toLowerCase();
    const matchesSearch =
      w.name.toLowerCase().includes(term) ||
      w.code.toLowerCase().includes(term) ||
      (w.city || '').toLowerCase().includes(term) ||
      (w.country || '').toLowerCase().includes(term);

    let matchesActive = true;
    if (activeFilter === 'active') matchesActive = w.is_active !== false;
    if (activeFilter === 'inactive') matchesActive = w.is_active === false;

    return matchesSearch && matchesActive;
  });

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm('Are you sure you want to stop operations and delete this warehouse block? Stock references might orphan.')) return;

    try {
      const res = await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const body = await res.json();
        alert(body.error || 'Failed to delete warehouse');
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
            placeholder="Search warehouses by name, code or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="border text-slate-900 border-slate-300 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Operational Statuses</option>
            <option value="active">Active Depots</option>
            <option value="inactive">Inactive Depots</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((w) => (
          <div key={w.id} className="bg-white border rounded-lg shadow-sm p-5 flex flex-col justify-between hover:border-indigo-200 transition-colors">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="bg-indigo-50 p-2 rounded text-indigo-600">
                  <Warehouse className="h-5 w-5" />
                </div>
                {w.is_active !== false ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Inactive
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-slate-900 text-lg">{w.name}</h3>
              <p className="font-mono text-sm text-slate-500 font-bold mb-3">{w.code}</p>

              <div className="text-xs text-slate-500 space-y-1 border-t pt-3">
                <p>
                  <strong className="text-slate-700">Address:</strong> {w.address || '-'}
                </p>
                <p>
                  <strong className="text-slate-700">City:</strong> {w.city || '-'}
                </p>
                <p>
                  <strong className="text-slate-700">Country:</strong> {w.country || '-'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-1 pt-4 mt-4 border-t border-dashed">
              <Link
                href={`/inventory/warehouses/${w.id}`}
                className="inline-flex p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
                title="View depot analytics & stock logs"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/inventory/warehouses/${w.id}/edit`}
                className="inline-flex p-1.5 rounded text-amber-600 hover:bg-amber-50"
                title="Edit location properties"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(w.id)}
                className="inline-flex p-1.5 rounded text-red-600 hover:bg-red-50"
                title="Decommission warehouse"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-lg shadow-sm border text-center text-slate-500">
            No warehouses correspond to the current filter set.
          </div>
        )}
      </div>
    </div>
  );
}
