'use client';

import React from 'react';
import Link from 'next/navigation';
import type { UserRecord } from '@/data/types';

interface UsersTableProps {
  users: Array<UserRecord & { id: string }>;
  onDelete?: (id: string) => void;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="capitalize px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800">
                  {u.role_key?.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.is_active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <a
                  href={`/settings/users/${u.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </a>
                <a
                  href={`/settings/users/${u.id}/edit`}
                  className="text-amber-600 hover:text-amber-900"
                >
                  Edit
                </a>
                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this user?')) onDelete(u.id);
                    }}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
