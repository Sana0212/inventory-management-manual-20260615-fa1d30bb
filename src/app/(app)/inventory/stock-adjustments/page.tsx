import React from 'react';
import Link from 'next/link';
import { listStockAdjustments, listProducts, listWarehouses } from '@/lib/firestore/app-data';
import { Plus, Eye, Edit, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StockAdjustmentsListPage() {
  const adjustments = await listStockAdjustments();
  const products = await listProducts();
  const warehouses = await listWarehouses();

  const enrichedAdjustments = adjustments.map((adj) => {
    const product = products.find((p) => p.id === adj.product_id);
    const warehouse = warehouses.find((w) => w.id === adj.warehouse_id);
    return {
      ...adj,
      sku: product?.sku || 'UNKNOWN',
      productName: product?.name || 'Unknown Product',
      warehouseName: warehouse?.name || 'Unknown Warehouse',
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-sm text-gray-500">Record manual overrides, audits, and discrepancies</p>
        </div>
        <Link
          href="/inventory/stock-adjustments/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold shadow hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Stock Adjustment
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Warehouse</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Adjustment Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {enrichedAdjustments.map((a: any) => {
              let reasonDisplay = a.reason;
              if (reasonDisplay && reasonDisplay.length > 20) {
                reasonDisplay = reasonDisplay.slice(0, 20) + '...';
              }

              let dateDisplay = 'N/A';
              if (a.created_at) {
                const docDate = typeof a.created_at.toDate === 'function' ? a.created_at.toDate() : new Date(a.created_at);
                dateDisplay = docDate.toLocaleDateString();
              }

              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-semibold text-gray-900">{a.sku}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{a.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{a.warehouseName}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${a.adjustment_quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {a.adjustment_quantity > 0 ? `+${a.adjustment_quantity}` : a.adjustment_quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{reasonDisplay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{a.reference || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1 mt-4">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {dateDisplay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <Link href={`/inventory/stock-adjustments/${a.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                    <Link href={`/inventory/stock-adjustments/${a.id}/edit`} className="inline-flex items-center text-amber-600 hover:text-amber-900">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {enrichedAdjustments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                  No adjustments found. Click Create Stock Adjustment to record one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
