import { getSupplier } from '@/lib/firestore/app-data';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/purchasing/suppliers"
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{supplier.name}</h1>
            <p className="text-sm font-mono text-slate-500 mt-0.5">Supplier Code: {supplier.code}</p>
          </div>
        </div>

        <Link
          href={`/purchasing/suppliers/${supplier.id}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Supplier
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-semibold text-slate-950">
          Supplier Summary Values
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Person</span>
            <span className="text-slate-900 mt-1 block font-medium">{supplier.contact_name || 'N/A'}</span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
            <span className="text-slate-900 mt-1 block font-medium font-mono">{supplier.email || 'N/A'}</span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone number</span>
            <span className="text-slate-900 mt-1 block font-medium">{supplier.phone || 'N/A'}</span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Supplier is Active</span>
            <span className="mt-1 block font-semibold">
              {supplier.is_active !== false ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs select-none">Yes</span>
              ) : (
                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs select-none">No (Disabled)</span>
              )}
            </span>
          </div>

          <div className="col-span-1 md:col-span-2 border-t pt-5">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Address</span>
            <span className="text-slate-900 mt-1 block font-medium leading-relaxed">
              {[supplier.address, supplier.city, supplier.country].filter(Boolean).join(', ') || 'No business address recorded.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
