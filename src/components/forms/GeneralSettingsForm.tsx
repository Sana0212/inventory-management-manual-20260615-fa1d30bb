'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppSettingsRecord } from '@/data/types';

interface GeneralSettingsFormProps {
  setting?: AppSettingsRecord & { id: string };
  onSuccess?: () => void;
}

export default function GeneralSettingsForm({ setting, onSuccess }: GeneralSettingsFormProps) {
  const router = useRouter();
  const [key, setKey] = useState(setting?.key || '');
  const [value, setValue] = useState(setting?.value || '');
  const [description, setDescription] = useState(setting?.description || '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !value) {
      setError('Please fill in both Key and Value.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const url = setting?.id ? `/api/app-settings/${setting.id}` : '/api/app-settings';
      const method = setting?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, description }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to save settings');
      }

      setKey('');
      setValue('');
      setDescription('');
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-2">
        {setting?.id ? 'Edit Setting' : 'Create Context / App Setting'}
      </h3>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-sm font-medium border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Setting Key</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={!!setting?.id}
          required
          placeholder="e.g. currency_symbol, default_tax_rate"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Setting Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          placeholder="e.g. USD, 0.15"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe how this setting behaves"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        >
          {submitting ? 'Saving...' : setting?.id ? 'Update Setting' : 'Add App Setting'}
        </button>
      </div>
    </form>
  );
}
