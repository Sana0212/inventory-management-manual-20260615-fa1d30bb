'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import { StockLevelRecord, ProductRecord, WarehouseRecord } from '@/data/types';

interface StockLevelsTableProps {
  stockLevels: StockLevelRecord[];
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function StockLevelsTable({ stockLevels, products, warehouses }: StockLevelsTableProps) {
  const [search, setSearch] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [alertFilter, setAlertFilter] = useState('all');

  const getProduct = (id: string) => products.find((p) => p.id === id);
  const getWarehouse = (id: string) => warehouses.find((w) => w.id === id);

  const flatStock = stockLevels.map((sl) => {
    const prod = getProduct(sl.product_id);
    const wh = getWarehouse(sl.warehouse_id);
    const isLow = prod?.reorder_level !== undefined && sl.on_hand_quantity < (prod.reorder_level || 0);

    return {
      ...sl,
      productName: prod?.name || 'Unknown Item',
      productSku: prod?.sku || 'UNKNOWN',
      reorderLevel: prod?.reorder_level || 0,
      uom: prod?.unit_of_measure || 'pcs',
      warehouseName: wh ? `${wh.name} (${wh.code})` : 'Unknown Warehouse',
      isLow,
    };
  });

  const filtered = flatStock.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(term) ||
      item.productSku.toLowerCase().includes(term) ||
      item.warehouseName.toLowerCase().includes(term);

    const matchesWarehouse = !warehouseId || item.warehouse_id === warehouseId;

    let matchesAlert = true;
    if (alertFilter === 'low') matchesAlert = item.isLow;
    if (alertFilter === 'ok') matchesAlert = !item.isLow;

    return matchesSearch && matchesWarehouse && matchesAlert;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock by item name, SKU or warehouse code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="border text-slate-905 border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="border text-slate-905 border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Stocks</option>
            <option value="low">🚨 Low Stock Only</option>
            <option value="ok font-bold">Good Levels Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            No stock listings match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold uppercase text-slate-500">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Warehouse Location</th>
                  <th className="p-3">On Hand Qty</th>
                  <th className="p-3">Qty Allocated (Reserved)</th>
                  <th className="p-3">Qty Available</th>
                  <th className="p-3">Min Safety Threshold</th>
                  <th className="p-3">Status Indicator</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-900 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-medium text-slate-600">{item.productSku}</td>
                    <td className="p-3 font-semibold text-slate-950">{item.productName}</td>
                    <td className="p-3 font-medium text-slate-600">{item.warehouseName}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {item.on_hand_quantity} <span className="text-slate-400 font-normal">{item.uom}</span>
                    </td>
                    <td className="p-3 font-mono font-medium text-indigo-700">
                      {item.allocated_quantity} <span className="text-slate-400 font-normal">{item.uom}</span>
                    </td>
                    <td className="p-3 font-mono font-extrabold text-teal-800">
                      {item.available_quantity} <span className="text-slate-400 font-normal">{item.uom}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{item.reorderLevel}</td>
                    <td className="p-3">
                      {item.isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/inventory/stock-levels/${item.id}`}
                        className="inline-flex p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
                        title="Display stock ledger"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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
