'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2, Calendar, DollarSign, Tag, User, Warehouse as WarehouseIcon, Package, Loader2, AlertCircle } from 'lucide-react';
import type { SalesOrderRecord, SalesOrderItemRecord, CustomerRecord, ProductRecord, WarehouseRecord } from '@/data/types';

export default function SalesOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<SalesOrderRecord | null>(null);
  const [items, setItems] = useState<SalesOrderItemRecord[]>([]);
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        // Load Order
        const orderRes = await fetch(`/api/sales-orders/${id}`);
        if (!orderRes.ok) throw new Error('Sales order details not found');
        const orderData = await orderRes.json() as SalesOrderRecord;
        setOrder(orderData);

        // Load Related Elements
        const [itemsRes, custRes, productsRes, whsRes] = await Promise.all([
          fetch('/api/sales-order-items'),
          fetch(`/api/customers/${orderData.customer_id}`).catch(() => null),
          fetch('/api/products').catch(() => null),
          fetch('/api/warehouses').catch(() => null),
        ]);

        if (itemsRes.ok) {
          const allItems = await itemsRes.json() as SalesOrderItemRecord[];
          const relevant = allItems.filter((i) => i.sales_order_id === orderData.id);
          setItems(relevant);
        }

        if (custRes && custRes.ok) setCustomer(await custRes.json());
        if (productsRes && productsRes.ok) setProducts(await productsRes.json());
        if (whsRes && whsRes.ok) setWarehouses(await whsRes.json());

      } catch (err: any) {
        setError(err.message || 'Error occurred retrieving sales order');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDetail();
    }
  }, [id]);

  const getProductName = (pId: string) => {
    const prod = products.find((p) => p.id === pId);
    return prod ? `${prod.name} (${prod.sku})` : 'Unknown Product';
  };

  const getWarehouseName = (wId: string) => {
    const wh = warehouses.find((w) => w.id === wId);
    return wh ? wh.name : 'Unknown Warehouse';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-650" />
          <p className="text-sm text-slate-500 font-medium">Loading sales order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Unable to Load Order</h3>
            <p className="text-sm mt-1">{error || 'The requested order details could not be found.'}</p>
            <Link href="/sales/sales-orders" className="text-sm underline mt-3 inline-block font-semibold">
              Return to Sales Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/sales/sales-orders"
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{order.so_number}</h1>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                order.status === 'shipped' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                order.status === 'approved' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                'bg-yellow-50 text-yellow-700 ring-yellow-600/10'
              }`}>
                {order.status || 'draft'}
              </span>
            </div>
            <p className="text-sm text-slate-500">Sales order details and linked record statistics.</p>
          </div>
        </div>

        <Link
          href={`/sales/sales-orders/${order.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          <Edit2 className="h-4 w-4" /> Edit Sales Order
        </Link>
      </div>

      {/* Main cards layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Order Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Sales Order Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block line-clamp-1">Order Date</span>
                <span className="font-medium text-slate-800">{order.order_date ? order.order_date.split('T')[0] : '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block line-clamp-1">Required By</span>
                <span className="font-medium text-slate-800">{order.required_date ? order.required_date.split('T')[0] : '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block line-clamp-1">Total Amount ({order.currency || 'USD'})</span>
                <span className="font-mono font-bold text-slate-800">{(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block line-clamp-1 font-mono">Sys Created ID</span>
                <span className="font-mono text-xs text-slate-800">{order.created_by_user_id || 'system'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Column */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Customer Profile Details</h2>
          {customer ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block">Customer Name</span>
                  <span className="font-semibold text-slate-850 text-sm">{customer.name}</span>
                </div>
              </div>
              <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <p><span className="text-slate-400">Code:</span> <span className="font-bold">{customer.code}</span></p>
                {customer.email && <p><span className="text-slate-400">Email:</span> <span className="font-medium">{customer.email}</span></p>}
                {customer.phone && <p><span className="text-slate-400">Phone:</span> <span className="font-medium">{customer.phone}</span></p>}
              </div>
              <div>
                <span className="text-slate-400 text-xs block mb-1">Shipping Terminal Destination</span>
                <p className="text-xs text-slate-650 bg-slate-50/50 p-2 border border-dashed border-slate-200 rounded">
                  {customer.shipping_address || 'No custom shipping route specified.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs py-4">No linked customer profile resolved.</div>
          )}
        </div>

        {/* Status Actions panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Operational Tasks</h2>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              Approved state reserves target stock. Shipped state releases it. Make sure levels are adjusted.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/inventory/stock-levels"
                className="w-full text-center px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                Inspect Stock Availability
              </Link>
              <button
                onClick={() => router.push(`/sales/sales-orders/${order.id}/edit`)}
                className="w-full text-center px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-semibold text-indigo-750 transition"
              >
                Change Fulfillment Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Inventory Listing elements */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-150 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Line Items Allocation</h2>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 p-8 text-center font-medium">No details lines designated to this sales order.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-205 text-left text-xs font-normal">
              <thead className="bg-slate-50/70 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">Product Definition</th>
                  <th className="px-6 py-3">Allocation Depot</th>
                  <th className="px-6 py-3 text-right">Quantity Demanded</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Extended Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                {items.map((itm) => (
                  <tr key={itm.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400 shrink-0" />
                      {getProductName(itm.product_id)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <WarehouseIcon className="w-3.5 h-3.5 text-slate-400" />
                        {getWarehouseName(itm.warehouse_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                      {itm.quantity_ordered}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      {itm.unit_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-950">
                      {itm.line_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
