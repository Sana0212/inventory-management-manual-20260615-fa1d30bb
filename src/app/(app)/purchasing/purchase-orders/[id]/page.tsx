import { getPurchaseOrder, getSupplier, listPurchaseOrderItems, listProducts } from '@/lib/firestore/app-data';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, DollarSign, Tag, User } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getPurchaseOrder(id);

  if (!order) {
    notFound();
  }

  const supplier = await getSupplier(order.supplier_id);
  const items = await listPurchaseOrderItems();
  const matchedItems = items.filter((i) => i.purchase_order_id === id);
  const products = await listProducts();

  const getProductName = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    return p ? `${p.name} (${p.sku})` : 'Unknown Product';
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    approved: 'bg-blue-50 text-indigo-700 border-indigo-200',
    ordered: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 font-sans">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/purchasing/purchase-orders"
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Purchase Order Details</h1>
            <p className="text-sm font-mono text-slate-500 mt-0.5">PO ID: {order.po_number}</p>
          </div>
        </div>

        <Link
          href={`/purchasing/purchase-orders/${order.id}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Order
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-semibold text-slate-950">
              Ordered Items List
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-700 border-b">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3 text-right">Qty Ord</th>
                    <th className="px-6 py-3 text-right">Qty Rec</th>
                    <th className="px-6 py-3 text-right">Unit Price</th>
                    <th className="px-6 py-3 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {matchedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/20">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {getProductName(item.product_id)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium">
                        {item.quantity_ordered}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-emerald-600 font-medium">
                        {item.quantity_received || 0}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {order.currency || 'USD'} {item.unit_price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-950 font-mono">
                        {order.currency || 'USD'} {item.line_total?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {matchedItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">
                        No ordered line items defined.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/10 p-6 flex flex-col items-end border-t border-slate-100">
              <div className="text-sm text-slate-500">Total Purchase Value</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {order.currency || 'USD'} {order.total_amount?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 pb-2 border-b">Status & History</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Current Status</span>
              <span className={`px-2.5 py-1 text-xs border font-semibold rounded-full ${statusColors[order.status] || 'bg-slate-100 text-slate-600/70 border-slate-300'}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Order date</span>
              <span className="text-sm font-medium text-slate-900 font-mono">{order.order_date}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Expected date</span>
              <span className="text-sm font-medium text-slate-900 font-mono">{order.expected_date || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Ordered by
              </span>
              <span className="text-xs font-mono text-slate-500">{order.created_by_user_id || 'system'}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 pb-2 border-b">Supplier Partnership</h3>
            
            {supplier ? (
              <div className="space-y-3">
                <div className="text-base font-semibold text-slate-800">{supplier.name}</div>
                <div className="text-xs text-slate-500 font-mono">CODE: {supplier.code}</div>
                
                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t">
                  <div>Contact: {supplier.contact_name || 'N/A'}</div>
                  <div>Email: {supplier.email || 'N/A'}</div>
                  <div>Phone: {supplier.phone || 'N/A'}</div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 italic text-sm">
                Supplier could not be determined.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
