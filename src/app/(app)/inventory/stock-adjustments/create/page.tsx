import React from 'react';
import { listProducts, listWarehouses } from '@/lib/firestore/app-data';
import StockAdjustmentCreateForm from '@/components/forms/StockAdjustmentCreateForm';

export const dynamic = 'force-dynamic';

export default async function CreateStockAdjustmentPage() {
  const products = await listProducts();
  const warehouses = await listWarehouses();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Stock Adjustment</h1>
        <p className="text-sm text-gray-500">Record a manual increase, decrease, or correction to a product's warehouse stock levels</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <StockAdjustmentCreateForm products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}
