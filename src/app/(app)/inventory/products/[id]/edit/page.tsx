import React from 'react';
import { notFound } from 'next/navigation';
import { getProduct, listWarehouses } from '@/lib/firestore/app-data';
import ProductEditForm from '@/components/forms/ProductEditForm';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const [product, warehouses] = await Promise.all([
    getProduct(id),
    listWarehouses()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Products', route: '/inventory/products' },
            { label: product.name, route: `/inventory/products/${product.id}` },
            { label: 'Edit Definitions' }
          ]}
        />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Modify SKU Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Revise cost indicators, base retail value, units of measure or category grouping properties.
        </p>
      </div>

      <ProductEditForm product={product} warehouses={warehouses} />
    </div>
  );
}
