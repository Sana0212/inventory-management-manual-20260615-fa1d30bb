import React from 'react';
import Link from 'next/link';
import { listStockLevels, listProducts, listWarehouses } from '@/lib/firestore/app-data';
import { Package, MapPin, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StockLevelsListPage() {
  const stockLevels = await listStockLevels();
  const products = await listProducts();
  const warehouses = await listWarehouses();

  const joinedStockData = stockLevels.map((sl) => {
    const product = products.find((p) => p.id === sl.product_id);
    const warehouse = warehouses.find((w) => w.id === sl.warehouse_id);
    return {
      id: sl.id,
      productId: sl.product_id,
      sku: product?.sku || 'UNKNOWN',
      productName: product?.name || 'Unknown Product',
      warehouseId: sl.warehouse_id,
      warehouseName: warehouse?.name || 'Unknown Warehouse',
      onHand: sl.on_hand_quantity,
      allocated: sl.allocated_quantity,
      available: sl.available_quantity,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Current Stock Levels</h1>
        <p className="text-sm text-gray-500">Real-time stock quantities across products and warehouses</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Warehouse</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">On Hand</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Allocated</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Available</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {joinedStockData.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold font-mono text-indigo-700">
                  <Link href={`/inventory/products/${s.productId}`} className="hover:underline">
                    {s.sku}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-sm truncate">{s.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold flex items-center gap-1.5 pt-4.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <Link href={`/inventory/warehouses/${s.warehouseId}`} className="hover:underline">
                    {s.warehouseName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{s.onHand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-amber-600 font-semibold">{s.allocated}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">{s.available}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link href={`/inventory/stock-levels/${s.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                    <Eye className="w-4 h-4 mr-1" /> View Details
                  </Link>
                </td>
              </tr>
            ))}
            {joinedStockData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  No stock records available. Set up default warehouses or perform adjustments/purchases to initiate stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
