'use client';

import React from 'react';
import { PurchaseOrderEditForm } from '@/components/forms/PurchaseOrderEditForm';
import { useParams } from 'next/navigation';

export function PurchaseOrderEditModule() {
  const { id } = useParams() as { id: string };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Revise Purchase Order</h1>
        <p className="text-sm text-slate-500 mt-1">Make amendments to the quantities ordered and unit cost calculations.</p>
      </div>

      <PurchaseOrderEditForm id={id} />
    </div>
  );
}
