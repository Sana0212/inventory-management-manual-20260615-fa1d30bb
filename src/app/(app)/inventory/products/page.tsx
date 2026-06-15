import React from 'react';
import Link from 'next/link';
import { listProducts, listWarehouses } from '@/lib/firestore/app-data';
import ProductsTable from '@/components/tables/ProductsTable';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsListPage() {
  const [products, warehouses] = await Promise.all([
    listProducts(),
    listWarehouses()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Product Catalog' }]} />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Catalog Master</h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain SKU definitions, base cost and pricing profiles, reorder alerts and tracking variables.
          </p>
        </div>
        <Link
          href="/inventory/products/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Define New SKU
        </Link>
      </div>

      <ProductsTable products={products} warehouses={warehouses} />
    </div>
  );
}
