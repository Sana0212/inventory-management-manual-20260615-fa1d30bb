import React from 'react';
import Link from 'next/link';
import { getStockLevel, getProduct, getWarehouse } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, MapPin, Calendar, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StockLevelDetailPage({ params }: PageProps) {
  const { id } = await params;
  const stockLevel = await getStockLevel(id);

  if (!stockLevel) {
    notFound();
  }

  const product = await getProduct(stockLevel.product_id);
  const warehouse = await getWarehouse(stockLevel.warehouse_id);

  // Convert firebase timestamp of last_updated_at if needed
  let updatedDisplay = 'N/A';
  if (stockLevel.last_updated_at) {
    const d = typeof stockLevel.last_updated_at.toDate === 'function' ? stockLevel.last_updated_at.toDate() : new Date(stockLevel.last_updated_at);
    updatedDisplay = d.toLocaleString();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory/stock-levels" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Location Details</h1>
          <p className="text-sm text-gray-500">Inventory breakdown for SKU: <span className="font-bold">{product?.sku || 'N/A'}</span> at <span className="font-bold">{warehouse?.name || 'N/A'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase">On Hand Quantity</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{stockLevel.on_hand_quantity}</p>
          <p className="text-xs text-gray-500 mt-1">Total physical stock in building</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase">Allocated Quantity</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{stockLevel.allocated_quantity}</p>
          <p className="text-xs text-gray-500 mt-1">Reserved for sales orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase">Available Quantity</p>
          <p className="text-3xl font-extrabold text-green-600 mt-2">{stockLevel.available_quantity}</p>
          <p className="text-xs text-gray-500 mt-1">Free to sell or transfer</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" /> Information Mapping
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-start gap-3">
            <Package className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Product Information</p>
              {product ? (
                <div className="mt-1">
                  <p className="text-sm font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                  <Link href={`/inventory/products/${product.id}`} className="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-900 mt-1">
                    View Product Details &rarr;
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">Loading error or product deleted.</p>
              )}
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Warehouse Information</p>
              {warehouse ? (
                <div className="mt-1">
                  <p className="text-sm font-bold text-gray-900">{warehouse.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Code: {warehouse.code}</p>
                  <Link href={`/inventory/warehouses/${warehouse.id}`} className="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-900 mt-1">
                    View Warehouse Details &rarr;
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">Loading error or warehouse deleted.</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last Updated At: {updatedDisplay}
          </span>
          <span>Record ID: {stockLevel.id}</span>
        </div>
      </div>
    </div>
  );
}
