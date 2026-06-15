'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserCreateForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleKey, setRoleKey] = useState('inventory_manager');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password_hash: password,
          role_key: roleKey,
          is_active: isActive,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to create user');
      }

      router.push('/settings/users');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Error creating user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white p-6 rounded-lg border border-gray-200">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-sm font-medium border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={roleKey}
          onChange={(e) => setRoleKey(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
        >
          <option value="admin">Administrator</option>
          <option value="inventory_manager">Inventory Manager</option>
          <option value="purchasing_clerk">Purchasing Clerk</option>
          <option value="sales_clerk">Sales Clerk</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-indigo-650 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          User is Active
        </label>
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/settings/users')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
