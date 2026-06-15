import { getCustomer, listSalesOrders } from '@/lib/firestore/app-data';
import Link from 'next/link';
import { ArrowLeft, Edit, Mail, Phone, MapPin, User, Receipt } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  const allOrders = await listSalesOrders();
  const customerOrders = allOrders.filter((o) => o.customer_id === id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 font-sans">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/sales/customers"
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <p className="text-sm font-mono text-slate-500 mt-0.5">Customer Code: {customer.code}</p>
          </div>
        </div>

        <Link
          href={`/sales/customers/${customer.id}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">Contact & Address Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Primary Contact</div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">{customer.contact_name || '—'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase text-slate-400">Email Address</div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">{customer.email || '—'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Phone Number</div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">{customer.phone || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Billing Address</div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5 whitespace-pre-wrap">{customer.billing_address || '—'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Shipping Address</div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5 whitespace-pre-wrap">{customer.shipping_address || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-semibold text-slate-950 flex items-center justify-between">
              <span>Customer Sales History</span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-bold">
                {customerOrders.length} Order(s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-700 border-b">
                  <tr>
                    <th className="px-6 py-3">Order Number</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {customerOrders.map((so) => (
                    <tr key={so.id} className="hover:bg-slate-50/20">
                      <td className="px-6 py-4 font-mono font-medium text-blue-600">
                        <Link href={`/sales/sales-orders/${so.id}`} className="hover:underline">
                          {so.so_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono">
                        {so.order_date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {so.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-950 font-mono">
                        {so.currency || 'USD'} {so.total_amount?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                  {customerOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                        No sales orders registered for this customer yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 pb-2 border-b">Account Details</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
              {customer.is_active !== false ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                  Inactive
                </span>
              )}
            </div>

            <div className="pt-2 border-t flex flex-col gap-1">
              <div className="text-xs font-semibold text-slate-400 uppercase">Customer ID</div>
              <div className="text-xs font-mono text-slate-500 break-all">{customer.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
