'use client';

import React, { useState, useEffect } from 'react';
import type { CustomerRecord } from '@/data/types';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface CustomersTableProps {
  data: CustomerRecord[];
  onDelete: (id: string) => void;
}

export function CustomersTable({ data, onDelete }: CustomersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-slate-500 mb-4 text-sm font-medium">No customers found matching search criteria.</p>
          <Link
            href="/sales/customers/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Customer
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-slate-700">
                    {row.code}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {row.contact_name || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {row.email || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {row.phone || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {row.is_active !== false ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/sales/customers/${row.id}`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/sales/customers/${row.id}/edit`}
                        className="rounded p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
                            onDelete(row.id || '');
                          }
                        }}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
