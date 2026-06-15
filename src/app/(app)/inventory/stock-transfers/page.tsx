import React from 'react';
import Link from 'next/link';
import { listStockTransfers, listProducts, listWarehouses } from '@/lib/firestore/app-data';
import { Plus, Eye, Edit, Calendar, ArrowRightLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StockTransfersListPage() {
  const transfers = await listStockTransfers();
  const products = await listProducts();
  const warehouses = await listWarehouses();

  const enrichedTransfers = transfers.map((t) => {
    const product = products.find((p) => p.id === t.product_id);
    const fromWarehouse = warehouses.find((w) => w.id === t.from_warehouse_id);
    const toWarehouse = warehouses.find((w) => w.id === t.to_warehouse_id);

    return {
      ...t,
      sku: product?.sku || 'UNKNOWN',
      productName: product?.name || 'Unknown Product',
      fromWarehouseName: fromWarehouse?.name || 'Unknown Warehouse',
      toWarehouseName: toWarehouse?.name || 'Unknown Warehouse',
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Transfers</h1>
          <p className="text-sm text-gray-500">Track and dispatch inventory movements between warehouse sites</p>
        </div>
        <Link
          href="/inventory/stock-transfers/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold shadow hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Stock Transfer
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Route (From &rarr; To)</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Requested Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {enrichedTransfers.map((t: any) => {
              let statusClass = 'bg-gray-100 text-gray-800';
              if (t.status === 'requested') statusClass = 'bg-amber-100 text-amber-800';
              if (t.status === 'approved') statusClass = 'bg-blue-100 text-blue-800';
              if (t.status === 'completed' || t.status === 'received') statusClass = 'bg-green-100 text-green-800';
              if (t.status === 'cancelled') statusClass = 'bg-red-100 text-red-800';

              let requestedDisplay = 'N/A';
              if (t.requested_at) {
                const reqDate = typeof t.requested_at.toDate === 'function' ? t.requested_at.toDate() : new Date(t.requested_at);
                requestedDisplay = reqDate.toLocaleDateString();
              }

              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-semibold text-indigo-700 font-mono">{t.sku}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">{t.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-xs">{t.fromWarehouseName}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-semibold text-gray-800 text-xs">{t.toWarehouseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                    {t.transfer_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${statusClass}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {requestedDisplay}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <Link href={`/inventory/stock-transfers/${t.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                    <Link href={`/inventory/stock-transfers/${t.id}/edit`} className="inline-flex items-center text-amber-600 hover:text-amber-900">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {enrichedTransfers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  No stock transfers registered. Click Create Stock Transfer to model stock moves.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
