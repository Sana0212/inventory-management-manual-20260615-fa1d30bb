'use client';

import React from 'react';
import { SupplierCreateForm } from '@/components/forms/SupplierCreateForm';

export function SupplierNew() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Supplier</h1>
        <p className="text-sm text-slate-500 mt-1">Register a new trading partner in the warehouse ERP.</p>
      </div>

      <SupplierCreateForm />
    </div>
  );
}
