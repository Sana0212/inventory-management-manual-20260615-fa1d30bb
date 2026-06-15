'use client';

import React from 'react';
import { PurchaseOrderCreateForm } from '@/components/forms/PurchaseOrderCreateForm';

export function PurchaseOrderNew() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Issue Purchase Request</h1>
        <p className="text-sm text-slate-500 mt-1">Specify warehouse, supplier details and requested item lines.</p>
      </div>

      <PurchaseOrderCreateForm />
    </div>
  );
}
