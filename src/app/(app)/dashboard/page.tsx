'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  Plus,
  Loader2,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  lowStockProducts: any[];
  openPurchaseOrders: any[];
  todaySalesCount: number;
  todaySalesAmount: number;
  warehouseStock: any[];
}

export default function DashboardPage() {
  const { user } = useSession();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          throw new Error('Failed to retrieve dashboard aggregated values.');
        }
        const body = await res.json();
        setData(body);
      } catch (err: any) {
        setError(err.message || 'Error occurred querying API.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Aggregating warehouse operations stats...</p>
        </div>
      </div>
    );
  }

  // Fallback defaults if no backend seeded or empty returned tables
  const stats = data || {
    lowStockProducts: [],
    openPurchaseOrders: [],
    todaySalesCount: 0,
    todaySalesAmount: 0,
    warehouseStock: []
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] items-center font-bold tracking-widest text-indigo-600 uppercase">Interactive Terminal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Hello, {user?.fullName || 'Active Operator'}</h1>
          <p className="text-sm text-slate-550 mt-1">
            Monitoring active stocks allocation logs and material dispatch cycles.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/inventory/products/create"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product SKU</span>
          </Link>
          <Link
            href="/purchasing/purchase-orders/create"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 active:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <span>Issue Purchase PO</span>
          </Link>
        </div>
      </div>

      {/* CORE KPI SUMMARY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI: Sales Order Values */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 rounded-full bg-emerald-500/5" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today&apos;s Contracts</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              ${stats.todaySalesAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>{stats.todaySalesCount} orders allocated today</span>
            </p>
          </div>
        </div>

        {/* KPI: Active POs count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 rounded-full bg-blue-500/5" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Open Purchase Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.openPurchaseOrders.length}
            </h3>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              Supplier fulfillment logs pending entry
            </p>
          </div>
        </div>

        {/* KPI: Shortages and alarms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 rounded-full bg-rose-500/5" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical Reorder Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.lowStockProducts.length}
            </h3>
            <p className="text-xs text-rose-600 font-semibold mt-1">
              SKUs residing below calculated buffer
            </p>
          </div>
        </div>

      </div>

      {/* CORE DATA LOGS COLLATIVE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table/List: Low Stock Products alert list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Low Stock SKU Buffers</h2>
              <p className="text-[11px] text-slate-500">Products requiring procurement receipt action.</p>
            </div>
            <Link 
              href="/inventory/stock-levels" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              <span>Audit Levels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
            {stats.lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package className="w-10 h-10 text-slate-350 mx-auto mb-2" />
                <p className="text-xs font-medium">All item units meet threshold targets.</p>
              </div>
            ) : (
              stats.lowStockProducts.map((p: any) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">SKU: {p.sku} • Min Limit: {p.reorder_level}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-100">
                      On Hand: {p.on_hand}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Warehouse stock allocations maps */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Physical Warehouses Footprint</h2>
              <p className="text-[11px] text-slate-500">Aggregated quantities in transit/staged storage.</p>
            </div>
            <Link 
              href="/inventory/warehouses" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              <span>Hub Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 space-y-4">
            {stats.warehouseStock.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10 font-medium">No storage volumes found.</p>
            ) : (
              stats.warehouseStock.map((wh: any) => (
                <div key={wh.warehouseId} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{wh.warehouseName}</span>
                    <span className="text-slate-900">{wh.totalStock.toLocaleString()} Units</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(12, (wh.totalStock / 20000) * 100))}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RECENT OUTSTANDING PO ACTIONS CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Pending Procurement</h2>
            <p className="text-[11px] text-slate-500">Tracking draft, ordered and approved Purchase Orders before delivery receipt mapping.</p>
          </div>
          <Link 
            href="/purchasing/purchase-orders" 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>View All POs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th colSpan={1} className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">PO Reference</th>
                <th colSpan={1} className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fulfillment Status</th>
                <th colSpan={1} className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Created</th>
                <th colSpan={1} className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {stats.openPurchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400 font-medium">
                    No open Purchase Orders at this moment. Initialize a contract first.
                  </td>
                </tr>
              ) : (
                stats.openPurchaseOrders.map((po: any) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-800">{po.po_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        po.status === 'draft' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        po.status === 'ordered' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                        'bg-slate-50 text-slate-600 border border-slate-250'
                      }`}>
                        {po.status ? po.status.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {po.order_date || 'No Date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <Link 
                        href={`/purchasing/purchase-orders/${po.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-bold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
