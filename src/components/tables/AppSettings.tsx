'use client';

import React from 'react';
import type { AppSettingsRecord } from '@/data/types';

interface AppSettingsTableProps {
  settings: Array<AppSettingsRecord & { id: string }>;
  onDelete?: (id: string) => void;
  onEdit?: (setting: AppSettingsRecord & { id: string }) => void;
}

export default function AppSettingsTable({ settings, onDelete, onEdit }: AppSettingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Key</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {settings.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-700 font-bold">{s.key}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.value}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{s.description || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(s)}
                    className="text-amber-600 hover:text-amber-900 focus:outline-none"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this setting?')) onDelete(s.id);
                    }}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {settings.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                No custom application settings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
