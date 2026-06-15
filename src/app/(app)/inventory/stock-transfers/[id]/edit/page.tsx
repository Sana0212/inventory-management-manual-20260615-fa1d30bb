import React from 'react';
import StockTransferEditForm from '@/components/forms/StockTransferEditForm';
import { getStockTransfer, listProducts, listWarehouses } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStockTransferPage({ params }: PageProps) {
  const { id } = await params;
  const transfer = await getStockTransfer(id);
  const products = await listProducts();
  const warehouses = await listWarehouses();

  if (!transfer) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Stock Transfer</h1>
        <p className="text-sm text-gray-500">Edit transport route, product metadata or progress status</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <StockTransferEditForm transfer={transfer} products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}
