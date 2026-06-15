import React from 'react';
import { listProducts, listWarehouses } from '@/lib/firestore/app-data';
import StockAdjustmentCreateForm from '@/components/forms/StockTransferCreateForm'; // Note: Wait, let's look at import or use the correct module

export const dynamic = 'force-dynamic';

export default async function CreateStockTransferPage() {
  const products = await listProducts();
  const warehouses = await listWarehouses();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Stock Transfer</h1>
        <p className="text-sm text-gray-500">Initiate a route movement of product stock from a departure warehouse to a receipt destination</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <StockAdjustmentCreateForm products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}
