import React from 'react';
import StockAdjustmentEditForm from '@/components/forms/StockAdjustmentEditForm';
import { getStockAdjustment } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStockAdjustmentPage({ params }: PageProps) {
  const { id } = await params;
  const stockAdjustment = await getStockAdjustment(id);

  if (!stockAdjustment) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Stock Adjustment</h1>
        <p className="text-sm text-gray-500">Update stock adjustment quantity, reason, or reference metadata</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <StockAdjustmentEditForm adjustment={stockAdjustment} />
      </div>
    </div>
  );
}
