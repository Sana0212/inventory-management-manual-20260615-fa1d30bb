'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomerEditForm } from '@/components/forms/CustomerEditForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomerEditPage() {
  const params = useParams();
  const id = params.id as string;

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
          <h1 className="text-2xl font-bold text-slate-900">Edit Customer</h1>
          <p className="text-sm text-slate-500">Update client organization or contact registry details.</p>
        </div>
      </div>

      {id && <CustomerEditForm id={id} />}
    </div>
  );
}
