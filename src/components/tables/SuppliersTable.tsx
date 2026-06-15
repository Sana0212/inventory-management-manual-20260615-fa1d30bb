'use client';

import React from 'react';
import Link from 'next/navigation';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { SupplierRecord } from '@/data/types';

interface TableProps {
  data: SupplierRecord[];
  onDelete?: (id: string) => void;
}

export function SuppliersTable({ data, onDelete }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-lg">
        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        <p className="text-slate-500 text-sm">No suppliers found matching current catalog filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
          <tr>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Supplier Name</th>
            <th className="px-6 py-4">Contact person</th>
            <th className="px-6 py-4">Contact email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Locality</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 divide-solid">
          {data.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono font-medium text-slate-900">
                {supplier.code}
              </td>
              <td className="px-6 py-4 text-slate-900 font-semibold">
                {supplier.name}
              </td>
              <td className="px-6 py-4">
                {supplier.contact_name || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4">
                {supplier.email || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4">
                {supplier.phone || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4">
                {[supplier.city, supplier.country].filter(Boolean).join(', ') || <span className="text-slate-300">-</span>}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    supplier.is_active !== false
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {supplier.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <a
                    href={`/purchasing/suppliers/${supplier.id}`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-50 rounded"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href={`/purchasing/suppliers/${supplier.id}/edit`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-50 rounded"
                    title="Edit supplier"
                  >
                    <Pencil className="w-4 h-4 text-indigo-500" />
                  </a>
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
                          onDelete(supplier.id || '');
                        }
                      }}
                      className="p-1 hover:text-red-900 hover:bg-red-50 rounded"
                      title="Delete supplier"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
