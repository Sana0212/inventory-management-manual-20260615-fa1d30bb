import React from 'react';
import Link from 'next/link';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import { Plus, Home, Edit, Eye, Trash, Warehouse as WarehouseIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getWarehouses() {
  try {
    const db = getAdminFirestore();
    const snapshot = await appCollection(db, 'warehouses').get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error loading warehouses:', error);
    return [];
  }
}

export default async function WarehousesListPage() {
  const warehouses = await getWarehouses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-sm text-gray-500">Warehouse locations where inventory stock is stored</p>
        </div>
        <Link
          href="/inventory/warehouses/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold shadow hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Warehouse
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City / Country</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {warehouses.map((w: any) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-mono text-indigo-700">{w.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{w.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{w.address || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {w.city || ''} {w.country ? `(${w.country})` : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${w.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {w.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                  <Link href={`/inventory/warehouses/${w.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Link>
                  <Link href={`/inventory/warehouses/${w.id}/edit`} className="inline-flex items-center text-amber-600 hover:text-amber-900">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {warehouses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  No warehouses found. Click Creative Warehouse to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
