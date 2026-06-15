import React from 'react';
import Link from 'next/link';
import { getStockTransfer, getProduct, getWarehouse, getUser } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, Package, MapPin, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StockTransferDetailPage({ params }: PageProps) {
  const { id } = await params;
  const transfer = await getStockTransfer(id);

  if (!transfer) {
    notFound();
  }

  const product = await getProduct(transfer.product_id);
  const fromWarehouse = await getWarehouse(transfer.from_warehouse_id);
  const toWarehouse = await getWarehouse(transfer.to_warehouse_id);
  const requestedBy = await getUser(transfer.requested_by_user_id);
  const approvedBy = transfer.approved_by_user_id ? await getUser(transfer.approved_by_user_id) : null;

  const formatDate = (field: any) => {
    if (!field) return 'Pending / Unfinished';
    const d = typeof field.toDate === 'function' ? field.toDate() : new Date(field);
    return d.toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory/stock-transfers" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
            Transfer ID: {transfer.id}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Stock Transfer Detail</h1>
        </div>
        <Link href={`/inventory/stock-transfers/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-md text-sm shadow">
          <Edit className="w-4 h-4" /> Edit Transfer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Status & Quantity</h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Status</label>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase bg-blue-100 text-blue-800">
              {transfer.status}
            </span>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Qty Transferred</label>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{transfer.transfer_quantity}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Route Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-red-50 bg-red-50/50 rounded-lg flex gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Departure Warehouse</p>
                <p className="text-sm font-bold text-gray-900">{fromWarehouse?.name || 'Unknown'}</p>
                <p className="text-xs font-mono text-gray-500">Code: {fromWarehouse?.code}</p>
              </div>
            </div>

            <div className="p-4 border border-green-50 bg-green-50/50 rounded-lg flex gap-3">
              <MapPin className="w-5 h-5 text-green-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Arrival Destination</p>
                <p className="text-sm font-bold text-gray-900">{toWarehouse?.name || 'Unknown'}</p>
                <p className="text-xs font-mono text-gray-500">Code: {toWarehouse?.code}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Package className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Product Transferred</p>
              <p className="text-sm font-bold text-gray-900">{product?.name || 'Unknown'}</p>
              <p className="text-xs font-mono text-indigo-700">SKU: {product?.sku || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Signoff & Logs Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase block">Requested By</label>
              <p className="text-sm font-semibold text-gray-800">{requestedBy?.full_name || 'System User'}</p>
              <p className="text-xs text-gray-500">{requestedBy?.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase block">Requested On</label>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-gray-400" /> {formatDate(transfer.requested_at)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase block">Approved By</label>
              <p className="text-sm font-semibold text-gray-800">{approvedBy?.full_name || 'Not Approved Yer / Auto-Approve'}</p>
              <p className="text-xs text-gray-500">{approvedBy ? approvedBy.email : ''}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase block">Completed Date</label>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-gray-400" /> {formatDate(transfer.completed_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
