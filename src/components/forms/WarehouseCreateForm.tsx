'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WarehouseCreateForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          address: address || undefined,
          city: city || undefined,
          country: country || undefined,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create warehouse');
      }

      router.push('/inventory/warehouses');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-slate-950">Add Warehouse Location</h2>
      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Code / Tag *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. WH-SOUTH"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. Atlanta Main Distribution"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Street address physical location"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. Atlanta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm text-slate-900 border p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. USA"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
            Warehouse is active & accepting deliveries
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/inventory/warehouses')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Warehouse'}
          </button>
        </div>
      </form>
    </div>
  );
}
