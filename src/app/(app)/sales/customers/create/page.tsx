'use client';

import React from 'react';
import { CustomerCreateForm } from '@/components/forms/CustomerCreateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomerCreatePage() {
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/sales/customers"
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Customer</h1>
          <p className="text-sm text-slate-500">Register a new client profile in the system.</p>
        </div>
      </div>

      <CustomerCreateForm />
    </div>
  );
}
