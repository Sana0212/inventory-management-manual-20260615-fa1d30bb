'use client';

import React from 'react';
import { PurchaseReceiptCreateForm } from '@/components/forms/PurchaseReceiptCreateForm';

export function PurchaseReceiptNew() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Record Deliveries</h1>
        <p className="text-sm text-slate-500 mt-1">Accept and sign off parcel freight from suppliers.</p>
      </div>

      <PurchaseReceiptCreateForm />
    </div>
  );
}
