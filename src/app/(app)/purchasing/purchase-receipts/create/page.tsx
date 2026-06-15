import React from 'react';
import { PurchaseReceiptCreateForm } from '@/components/forms/PurchaseReceiptCreateForm';

export const dynamic = 'force-dynamic';

export default function CreatePurchaseReceiptPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Receipt</h1>
        <p className="text-sm text-gray-500">Record a goods received note against an authorized supplier purchase order</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <PurchaseReceiptCreateForm />
      </div>
    </div>
  );
}
