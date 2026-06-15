import React from 'react';
import WarehouseEditForm from '@/components/forms/WarehouseEditForm';
import { getWarehouse } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWarehousePage({ params }: PageProps) {
  const { id } = await params;
  const warehouse = await getWarehouse(id);

  if (!warehouse) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Warehouse</h1>
        <p className="text-sm text-gray-500">Update warehouse information and status</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <WarehouseEditForm warehouse={warehouse} />
      </div>
    </div>
  );
}
