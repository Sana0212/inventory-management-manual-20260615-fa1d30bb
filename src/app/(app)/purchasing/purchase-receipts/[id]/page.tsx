import React from 'react';
import Link from 'next/link';
import { getPurchaseReceipt, getPurchaseOrder, getWarehouse, getUser, listPurchaseReceiptItems, listProducts } from '@/lib/firestore/app-data';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clipboard, MapPin, Calendar, FileText, User as UserIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseReceiptDetailPage({ params }: PageProps) {
  const { id } = await params;
  const receipt = await getPurchaseReceipt(id);

  if (!receipt) {
    notFound();
  }

  const purchaseOrder = await getPurchaseOrder(receipt.purchase_order_id);
  const warehouse = await getWarehouse(receipt.warehouse_id);
  const receivedBy = await getUser(receipt.received_by_user_id);

  // Fetch items list
  const receiptItems = await listPurchaseReceiptItems();
  const filteredReceiptItems = receiptItems.filter(item => item.purchase_receipt_id === id);
  const products = await listProducts();

  const enrichedItems = filteredReceiptItems.map((item) => {
    const product = products.find(p => p.id === item.product_id);
    return {
      ...item,
      sku: product?.sku || 'UNKNOWN',
      name: product?.name || 'Unknown Product',
    };
  });

  let receivedDisplay = 'N/A';
  if (receipt.received_at) {
    const d = typeof receipt.received_at.toDate === 'function' ? receipt.received_at.toDate() : new Date(receipt.received_at);
    receivedDisplay = d.toLocaleString();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/purchasing/purchase-receipts" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
            Receipt ID: {receipt.id}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Receipt: {receipt.receipt_number}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-500" /> Receipt Header
          </h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Receipt Number</label>
            <p className="text-sm font-bold text-gray-900 font-mono mt-0.5">{receipt.receipt_number}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Purchase Order Ref</label>
            <p className="text-sm font-semibold text-indigo-600 mt-0.5">
              <Link href={`/purchasing/purchase-orders/${receipt.purchase_order_id}`} className="hover:underline font-mono">
                {purchaseOrder?.po_number || 'Go to PO'}
              </Link>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Target Warehouse</label>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {warehouse?.name || 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Received By</label>
            <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-gray-400" /> {receivedBy?.full_name || 'System / Unlinked'}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Notes / Reference</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 whitespace-pre-wrap mt-1 text-xs">
              {receipt.notes || 'No notes added'}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block">Received Date</label>
            <p className="text-sm text-gray-700 flex items-center gap-1.5 mt-1 font-semibold text-xs">
              <Calendar className="w-4 h-4 text-gray-400" /> {receivedDisplay}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Received Items List ({enrichedItems.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product SKU</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Quantity Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {enrichedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold font-mono text-indigo-700">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-indigo-600">{item.quantity_received}</td>
                  </tr>
                ))}
                {enrichedItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                      No items registered in this Goods Receipt document snapshot.
                    </td>
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
