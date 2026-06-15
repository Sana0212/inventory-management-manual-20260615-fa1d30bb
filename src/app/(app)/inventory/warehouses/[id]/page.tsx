import React from 'react';
import Link from 'next/link';
import { getWarehouse, listStockLevels, listProducts } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';
import { Edit, ArrowLeft, Warehouse as WarehouseIcon, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WarehouseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const warehouse = await getWarehouse(id);

  if (!warehouse) {
    notFound();
  }

  // Fetch stocks and products to show stock status in this warehouse
  const allStockLevels = await listStockLevels();
  const allProducts = await listProducts();

  const warehouseStocks = allStockLevels.filter(sl => sl.warehouse_id === id);
  const stockByProduct = warehouseStocks.map(sl => {
    const product = allProducts.find(p => p.id === sl.product_id);
    return {
      productId: sl.product_id,
      sku: product?.sku || 'UNKNOWN',
      name: product?.name || 'Unknown Product',
      onHand: sl.on_hand_quantity,
      allocated: sl.allocated_quantity,
      available: sl.available_quantity,
      lastUpdated: sl.last_updated_at,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory/warehouses" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-700">{warehouse.code}</span>
            <span className={`px-2Py-0.5 text-xs font-semibold rounded-full ${warehouse.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {warehouse.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{warehouse.name}</h1>
        </div>
        <Link href={`/inventory/warehouses/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-md text-sm shadow">
          <Edit className="w-4 h-4" /> Edit Warehouse
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <WarehouseIcon className="w-5 h-5 text-indigo-500" /> Warehouse Details
          </h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Code</label>
            <p className="text-sm font-bold text-gray-900 font-mono mt-0.5">{warehouse.code}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Address</label>
            <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{warehouse.address || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">City</label>
            <p className="text-sm text-gray-900 mt-0.5">{warehouse.city || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Country</label>
            <p className="text-sm text-gray-900 mt-0.5">{warehouse.country || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" /> Stock Listing ({stockByProduct.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product SKU</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product Name</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">On Hand</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Allocated</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockByProduct.map((stock) => (
                  <tr key={stock.productId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-semibold font-mono text-indigo-700">
                      <Link href={`/inventory/products/${stock.productId}`} className="hover:underline">{stock.sku}</Link>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{stock.name}</td>
                    <td className="px-4 py-2 text-sm text-right font-bold text-gray-900">{stock.onHand}</td>
                    <td className="px-4 py-2 text-sm text-right text-amber-600">{stock.allocated}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">{stock.available}</td>
                  </tr>
                ))}
                {stockByProduct.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No stock levels recorded in this warehouse.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
