'use client';

import React from 'react';
import { SupplierEditForm } from '@/components/forms/SupplierEditForm';
import { useParams } from 'next/navigation';

export function SupplierEditModule() {
  const { id } = useParams() as { id: string };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 transition-all">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update Supplier</h1>
        <p className="text-sm text-slate-500 mt-1">Make corrections to supplier master values.</p>
      </div>

      <SupplierEditForm id={id} />
    </div>
  );
}
