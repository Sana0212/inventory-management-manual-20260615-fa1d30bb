import React from 'react';
import { listWarehouses } from '@/lib/firestore/app-data';
import ProductCreateForm from '@/components/forms/ProductCreateForm';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function ProductCreatePage() {
  const warehouses = await listWarehouses();

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Products', route: '/inventory/products' },
            { label: 'Create SKU Definition' }
          ]}
        />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create SKU Template</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set base metrics and global logistics characteristics for a new master item code.
        </p>
      </div>

      <ProductCreateForm warehouses={warehouses} />
    </div>
  );
}
