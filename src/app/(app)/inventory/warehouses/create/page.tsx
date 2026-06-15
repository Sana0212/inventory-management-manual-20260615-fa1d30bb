import React from 'react';
import WarehouseCreateForm from '@/components/forms/WarehouseCreateForm';

export const dynamic = 'force-dynamic';

export default function CreateWarehousePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Warehouse</h1>
        <p className="text-sm text-gray-500">Create a new warehouse location where inventory stock will be stored</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <WarehouseCreateForm />
      </div>
    </div>
  );
}
