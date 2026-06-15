import React from 'react';
import Link from 'next/link';
import { getStockAdjustment, getProduct, getWarehouse, getUser } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, Package, MapPin, Clipboard, User as UserIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StockAdjustmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const adj = await getStockAdjustment(id);

  if (!adj) {
    notFound();
  }

  const product = await getProduct(adj.product_id);
  const warehouse = await getWarehouse(adj.warehouse_id);
  const user = await getUser(adj.created_by_user_id);

  let dateDisplay = 'N/A';
  if (adj.created_at) {
    const d = typeof adj.created_at.toDate === 'function' ? adj.created_at.toDate() : new Date(adj.created_at);
    dateDisplay = d.toLocaleString();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory/stock-adjustments" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
            Adjustment ID: {adj.id}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Stock Adjustment Detail</h1>
        </div>
        <Link href={`/inventory/stock-adjustments/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-md text-sm shadow">
          <Edit className="w-4 h-4" /> Edit Details
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-500" /> Operational Information
          </h2>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Quantity Adjusted</label>
            <p className={`text-2xl font-extrabold mt-1 ${adj.adjustment_quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {adj.adjustment_quantity > 0 ? `+${adj.adjustment_quantity}` : adj.adjustment_quantity}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Reason for adjustment</label>
            <p className="text-sm text-gray-800 mt-1 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{adj.reason}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Reference Doc / ID</label>
            <p className="text-sm text-gray-900 font-semibold mt-1 font-mono">{adj.reference || 'None Provided'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" /> Context Mapping
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Product SKU & Name</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{product?.name || 'Unknown'}</p>
                <p className="font-mono text-xs text-indigo-700 mt-0.5">SKU: {product?.sku || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Warehouse / Location</p>
                <p className="text-sm font-bold text-gray-900">{warehouse?.name || 'Unknown'}</p>
                <p className="font-mono text-xs text-gray-500 mt-0.5">Code: {warehouse?.code || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
              <UserIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Created By User</p>
                <p className="text-sm text-gray-700">{user?.full_name || 'System / Unlinked'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Logged DateTime</p>
                <p className="text-sm text-gray-700">{dateDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
