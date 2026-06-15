'use client';

import React from 'react';
import { SalesOrderEditForm } from '@/components/forms/SalesOrderEditForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditSalesOrderPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/sales/sales-orders"
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Sales Order</h1>
          <p className="text-sm text-slate-500">Update general header options, expected dates, and status values.</p>
        </div>
      </div>

      <SalesOrderEditForm id={id} />
    </div>
  );
}
