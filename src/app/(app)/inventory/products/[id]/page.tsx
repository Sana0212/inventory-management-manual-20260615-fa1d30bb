import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, listWarehouses, listStockLevels } from '@/lib/firestore/app-data';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Edit2, ShieldAlert, Boxes, Warehouse } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, warehouses, stockLevels] = await Promise.all([
    getProduct(id),
    listWarehouses(),
    listStockLevels()
  ]);

  if (!product) {
    notFound();
  }

  const defaultWarehouse = warehouses.find(w => w.id === product.default_warehouse_id);

  // Filter stock configurations for this specific product template
  const relevantStocks = stockLevels.filter(sl => sl.product_id === product.id).map(sl => {
    const wh = warehouses.find(w => w.id === sl.warehouse_id);
    return {
      ...sl,
      warehouseName: wh ? `${wh.name} (${wh.code})` : 'Unknown Warehouse',
    };
  });

  const totalOnHand = relevantStocks.reduce((sum, item) => sum + item.on_hand_quantity, 0);
  const totalAllocated = relevantStocks.reduce((sum, item) => sum + item.allocated_quantity, 0);
  const totalAvailable = relevantStocks.reduce((sum, item) => sum + item.available_quantity, 0);

  const isLowStock = product.reorder_level !== undefined && totalOnHand < (product.reorder_level || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Products', route: '/inventory/products' },
              { label: product.name }
            ]}
          />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {product.name}
            {isLowStock && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
                <ShieldAlert className="h-3 w-3" /> Low Stock Warning
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-1 font-semibold">{product.sku}</p>
        </div>

        <Link
          href={`/inventory/products/${product.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Edit2 className="h-4 w-4" /> Edit Profile Definitions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950 mb-3 border-b pb-2">Profile Matrix Reference</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Category segment</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{product.category || 'Standard'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Tracking Metrics Uom</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{product.unit_of_measure}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Default primary base</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {defaultWarehouse ? `${defaultWarehouse.name} (${defaultWarehouse.code})` : 'None Allocated'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Operational Status</p>
                <p className="mt-0.5">
                  {product.is_active !== false ? (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded">Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 mb-3 border-b pb-2">Description / Properties</h2>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-dashed border-slate-200">
              {product.description || 'No detailed specifications filed for this SKU module.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 mb-3 border-b pb-2">Base Cost Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-xs text-slate-500 font-medium">Acquisition Price</p>
                <p className="text-lg font-mono font-bold text-slate-900 mt-1">${product.cost_price?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-xs text-slate-500 font-medium">Base Outflow Retail</p>
                <p className="text-lg font-mono font-bold text-slate-900 mt-1">${product.sales_price?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-amber-50/50 p-3 rounded">
                <p className="text-xs text-amber-800 font-medium">Safety Level Min Threshold</p>
                <p className="text-lg font-mono font-bold text-amber-900 mt-1">{product.reorder_level || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-1.5">
              <Boxes className="h-5 w-5 text-indigo-600" /> Catalog Wide Stock Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-slate-500 font-medium">Aggregate On Hand Volume</span>
                <span className="font-mono font-extrabold text-slate-900 text-lg">{totalOnHand}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-slate-500 font-medium font-semibold text-indigo-700">Aggregate Sales Reserved</span>
                <span className="font-mono font-bold text-indigo-800">{totalAllocated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-505 font-bold text-teal-800">Aggregate Free Stock Available</span>
                <span className="font-mono font-black text-teal-900 text-xl">{totalAvailable}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
              <Warehouse className="h-4 w-4 text-emerald-600" /> Stock Split by Warehouse
            </h2>
            {relevantStocks.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium italic">No physical stock listings found for this SKU in any active warehouse slot.</p>
            ) : (
              <div className="space-y-3">
                {relevantStocks.map(sl => (
                  <div key={sl.id} className="text-xs bg-slate-50 p-2.5 rounded flex justify-between items-center border">
                    <div>
                      <p className="font-semibold text-slate-800">{sl.warehouseName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Updated: {new Date(sl.last_updated_at?._seconds ? sl.last_updated_at._seconds * 1000 : sl.last_updated_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span className="font-mono font-bold bg-slate-200 px-2 py-0.5 text-slate-900 rounded">{sl.on_hand_quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
