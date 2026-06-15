'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { ProductRecord, WarehouseRecord } from '@/data/types';

interface ProductsTableProps {
  products: ProductRecord[];
  warehouses: WarehouseRecord[];
}

export default function ProductsTable({ products, warehouses }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [sortField, setSortField] = useState<'sku' | 'name' | 'sales_price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const handleSort = (field: 'sku' | 'name' | 'sales_price') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = !categoryFilter || p.category === categoryFilter;

      let matchActive = true;
      if (activeFilter === 'active') matchActive = p.is_active !== false;
      if (activeFilter === 'inactive') matchActive = p.is_active === false;

      return matchSearch && matchCategory && matchActive;
    })
    .sort((a, b) => {
      let aVal: any = a[sortField] || '';
      let bVal: any = b[sortField] || '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getWarehouseName = (id?: string) => {
    if (!id) return '-';
    const wh = warehouses.find((w) => w.id === id);
    return wh ? `${wh.name} (${wh.code})` : id;
  };

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this product template? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const body = await res.json();
        alert(body.error || 'Failed to delete product');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by code, name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border text-slate-900 border-slate-300 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="border text-slate-900 border-slate-300 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center sm:p-12">
            <p className="text-slate-500 font-medium">No inventory master items matched your query criteria.</p>
            <Link
              href="/inventory/products/create"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Add first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('sku')}>
                    <span className="flex items-center gap-1">
                      SKU <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                  </th>
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">
                      Name <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                  </th>
                  <th className="p-3">Category</th>
                  <th className="p-3">UOM</th>
                  <th className="p-3">Default Warehouse</th>
                  <th className="p-3">Reorder level</th>
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('sales_price')}>
                    <span className="flex items-center gap-1">
                      Sales Price <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                  </th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-900 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-medium text-slate-600">{p.sku}</td>
                    <td className="p-3 font-semibold text-slate-905">{p.name}</td>
                    <td className="p-3 text-slate-500">{p.category || 'Uncategorized'}</td>
                    <td className="p-3 text-slate-500">{p.unit_of_measure}</td>
                    <td className="p-3 text-slate-600 text-xs">{getWarehouseName(p.default_warehouse_id)}</td>
                    <td className="p-3 font-mono font-medium text-amber-700">{p.reorder_level ?? 0}</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">${p.sales_price?.toFixed(2) || '0.00'}</td>
                    <td className="p-3">
                      {p.is_active !== false ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/inventory/products/${p.id}`}
                        className="inline-flex p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/inventory/products/${p.id}/edit`}
                        className="inline-flex p-1.5 rounded text-amber-600 hover:bg-amber-50"
                        title="Edit catalog data"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex p-1.5 rounded text-red-600 hover:bg-red-50"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
