'use client';

import React, { useState, useEffect } from 'react';
import type { SalesOrderRecord, CustomerRecord } from '@/data/types';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface SalesOrdersTableProps {
  data: SalesOrderRecord[];
  onDelete: (id: string) => void;
}

export function SalesOrdersTable({ data, onDelete }: SalesOrdersTableProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const list = await res.json();
          setCustomers(list);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCustomers();
  }, []);

  const getCustomerName = (cId: string) => {
    const cust = customers.find((c) => c.id === cId);
    return cust ? cust.name : '—';
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'shipped':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'approved':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'cancelled':
        return 'bg-slate-50 text-slate-700 ring-slate-600/20';
      default:
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-slate-500 mb-4 text-sm font-medium">No sales orders found.</p>
          <Link
            href="/sales/sales-orders/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Sales Order
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm font-normal">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3">SO Number</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Order Date</th>
                <th className="px-6 py-3">Deliver By</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Currency</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-slate-900">
                    {row.so_number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                    {getCustomerName(row.customer_id)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {row.order_date ? row.order_date.split('T')[0] : '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {row.required_date ? row.required_date.split('T')[0] : '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClass(row.status)}`}>
                      {row.status || 'draft'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600 uppercase font-mono">
                    {row.currency || 'USD'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-slate-900">
                    {(row.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/sales/sales-orders/${row.id}`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/sales/sales-orders/${row.id}/edit`}
                        className="rounded p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                        title="Edit SO"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this sales order permanently?')) {
                            onDelete(row.id || '');
                          }
                        }}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Delete SO"
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
