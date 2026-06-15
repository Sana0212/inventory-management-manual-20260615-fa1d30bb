'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomerRecord, SalesOrderRecord } from '@/data/types';

interface SalesOrderEditFormProps {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SalesOrderEditForm({ id, onSuccess, onCancel }: SalesOrderEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [formData, setFormData] = useState({
    so_number: '',
    customer_id: '',
    order_date: '',
    required_date: '',
    status: 'draft',
    currency: 'USD',
    total_amount: 0,
    created_by_user_id: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const custRes = await fetch('/api/customers');
        if (custRes.ok) setCustomers(await custRes.json());

        const response = await fetch(`/api/sales-orders/${id}`);
        if (!response.ok) throw new Error('Sales order was not found');
        const data = (await response.json()) as SalesOrderRecord;
        setFormData({
          so_number: data.so_number || '',
          customer_id: data.customer_id || '',
          order_date: data.order_date || '',
          required_date: data.required_date || '',
          status: data.status || 'draft',
          currency: data.currency || 'USD',
          total_amount: data.total_amount || 0,
          created_by_user_id: data.created_by_user_id || '',
        });
      } catch (err: any) {
        setError(err.message || 'Error occurred while loading sales order details.');
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sales-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update Sales order');
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/sales/sales-orders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total_amount' ? Number(value) : value,
    }));
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Edit Sales Order Metadata</h3>
        <p className="text-sm text-slate-500">Update general statuses and dates for Sales order: <span className="font-mono font-bold">{formData.so_number}</span></p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SO Number *</label>
          <input
            type="text"
            name="so_number"
            required
            value={formData.so_number}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            placeholder="SO-000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Customer *</label>
          <select
            name="customer_id"
            required
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Order Date *</label>
          <input
            type="date"
            name="order_date"
            required
            value={formData.order_date.split('T')[0]}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Required Deliver Date</label>
          <input
            type="date"
            name="required_date"
            value={(formData.required_date || '').split('T')[0]}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="draft">Draft (Unreleased)</option>
            <option value="approved">Approved & Reserved</option>
            <option value="shipped">Completed & Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adjusted Total Amount</label>
          <input
            type="number"
            step="any"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/sales/sales-orders'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Sales Order'}
        </button>
      </div>
    </form>
  );
}
