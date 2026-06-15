'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomerRecord } from '@/data/types';

interface CustomerEditFormProps {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CustomerEditForm({ id, onSuccess, onCancel }: CustomerEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    billing_address: '',
    shipping_address: '',
    is_active: true,
  });

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await fetch(`/api/customers/${id}`);
        if (!response.ok) throw new Error('Failed to load customer profile');
        const data = (await response.json()) as CustomerRecord;
        setFormData({
          code: data.code || '',
          name: data.name || '',
          contact_name: data.contact_name || '',
          email: data.email || '',
          phone: data.phone || '',
          billing_address: data.billing_address || '',
          shipping_address: data.shipping_address || '',
          is_active: data.is_active !== false,
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading customer details');
      } finally {
        setFetching(false);
      }
    }
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update customer');
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/sales/customers');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20 bg-white border rounded-lg border-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Edit Customer Information</h3>
        <p className="text-sm text-slate-500">Update specific details configurations for this customer.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="CUST-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Contact Corporation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
          <input
            type="text"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="+1 555 1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Billing Address</label>
          <input
            type="text"
            name="billing_address"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="123 billing road"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
          <textarea
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="456 shipping avenue"
          />
        </div>

        <div className="flex items-center col-span-1 md:col-span-2 mt-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-slate-900 select-none">
            Customer is Active (Allowed to receive orders)
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/sales/customers'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Updates'}
        </button>
      </div>
    </form>
  );
}
