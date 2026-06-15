'use client';

import React from 'react';
import { SalesOrderCreateForm } from '@/components/forms/SalesOrderCreateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateSalesOrderPage() {
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
          <h1 className="text-2xl font-bold text-slate-900">Create Sales Order</h1>
          <p className="text-sm text-slate-500">Record a new sales order, select line items and dispatch locations.</p>
        </div>
      </div>

      <SalesOrderCreateForm />
    </div>
  );
}
