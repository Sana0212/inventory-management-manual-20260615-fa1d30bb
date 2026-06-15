'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SupplierRecord } from '@/data/types';

interface FormProps {
  id: string;
  initialData?: SupplierRecord | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SupplierEditForm({ id, initialData, onSuccess, onCancel }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        contact_name: initialData.contact_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
        is_active: initialData.is_active !== false,
      });
    } else {
      fetch(`/api/suppliers/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Supplier details load failed');
          return res.json();
        })
        .then((data) => {
          setFormData({
            code: data.code || '',
            name: data.name || '',
            contact_name: data.contact_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            is_active: data.is_active !== false,
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update supplier');
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/purchasing/suppliers');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Edit Supplier Details</h3>
        <p className="text-sm text-slate-500">Update contact or address credentials for this partner.</p>
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="e.g. SUP-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Company Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
          <input
            type="text"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="supplier@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Reference</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="123 Warehouses St"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="United States"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center mt-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-slate-900 select-none">
            Supplier is Active (Allowed to receive orders)
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/purchasing/suppliers'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
