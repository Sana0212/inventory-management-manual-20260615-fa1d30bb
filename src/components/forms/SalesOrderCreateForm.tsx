'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomerRecord, ProductRecord, WarehouseRecord } from '@/data/types';
import { Plus, Trash } from 'lucide-react';

interface SalesOrderCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface OrderItemInput {
  product_id: string;
  warehouse_id: string;
  quantity_ordered: number;
  unit_price: number;
}

export function SalesOrderCreateForm({ onSuccess, onCancel }: SalesOrderCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);

  const [formData, setFormData] = useState({
    so_number: '',
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    required_date: '',
    status: 'draft',
    currency: 'USD',
  });

  const [items, setItems] = useState<OrderItemInput[]>([
    { product_id: '', warehouse_id: '', quantity_ordered: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [custRes, prodRes, whRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/products'),
          fetch('/api/warehouses'),
        ]);
        if (custRes.ok) setCustomers(await custRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
        if (whRes.ok) setWarehouses(await whRes.json());
      } catch (err) {
        console.error('Failed to load form lookup data', err);
      }
    }
    loadData();
    // Unique order number generator
    setFormData((prev) => ({
      ...prev,
      so_number: `SO-${Date.now().toString().slice(-6)}`,
    }));
  }, []);

  const handleAddField = () => {
    setItems([...items, { product_id: '', warehouse_id: '', quantity_ordered: 1, unit_price: 0 }]);
  };

  const handleRemoveField = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItemInput, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };

    if (field === 'product_id') {
      const selected = products.find((p) => p.id === val);
      if (selected && selected.sales_price) {
        next[index].unit_price = selected.sales_price;
      }
    }
    setItems(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter items without product code
    const validItems = items.filter((itm) => itm.product_id && itm.warehouse_id);
    if (!validItems.length) {
      setError('Please add at least one valid product line item with warehouse chosen.');
      setLoading(false);
      return;
    }

    try {
      const total_amount = validItems.reduce((sum, item) => sum + item.quantity_ordered * item.unit_price, 0);

      const payload = {
        ...formData,
        total_amount,
        created_by_user_id: 'sales_agent_session',
      };

      // Create Sales Order
      const response = await fetch('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Sales order creation failed');
      }

      const createdOrder = await response.json();

      // Create Sales Order Items
      await Promise.all(
        validItems.map((itm) => {
          return fetch('/api/sales-order-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sales_order_id: createdOrder.id,
              product_id: itm.product_id,
              warehouse_id: itm.warehouse_id,
              quantity_ordered: Number(itm.quantity_ordered),
              quantity_shipped: 0,
              unit_price: Number(itm.unit_price),
              line_total: Number(itm.quantity_ordered) * Number(itm.unit_price),
            }),
          });
        })
      );

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/sales/sales-orders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentTotal = items.reduce((sum, itm) => sum + (Number(itm.quantity_ordered) || 0) * (Number(itm.unit_price) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Create Sales Order</h3>
        <p className="text-sm text-slate-500">Draft a new sales quote or standard customer sales order.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SO Number *</label>
          <input
            type="text"
            name="so_number"
            required
            value={formData.so_number}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            placeholder="SO-730101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Customer *</label>
          <select
            name="customer_id"
            required
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Order Date *</label>
          <input
            type="date"
            name="order_date"
            required
            value={formData.order_date}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Required Deliver Date</label>
          <input
            type="date"
            name="required_date"
            value={formData.required_date}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="draft">Draft (Unreleased)</option>
            <option value="approved">Approved & Reserved</option>
            <option value="shipped">Completed & Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-slate-900">Line Items</h4>
          <button
            type="button"
            onClick={handleAddField}
            className="text-xs font-semibold px-2.5 py-1.5 text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-md transition"
          >
            + Add Product Line
          </button>
        </div>

        <div className="space-y-3">
          {items.map((row, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-slate-50 p-3 rounded-md border border-slate-200 relative">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-500 mb-1 md:hidden">Product</label>
                <select
                  value={row.product_id}
                  onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm bg-white"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku}) - Price Mode: {p.sales_price ? `${row.unit_price || p.sales_price} USD` : 'Needs Price'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-48">
                <label className="block text-xs font-semibold text-slate-500 mb-1 md:hidden">Ship From Warehouse</label>
                <select
                  value={row.warehouse_id}
                  onChange={(e) => handleItemChange(idx, 'warehouse_id', e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm bg-white"
                >
                  <option value="">-- Warehouse source --</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-28">
                <label className="block text-xs font-semibold text-slate-500 mb-1 md:hidden">Qty</label>
                <input
                  type="number"
                  placeholder="Qty"
                  min={1}
                  required
                  value={row.quantity_ordered}
                  onChange={(e) => handleItemChange(idx, 'quantity_ordered', Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                />
              </div>

              <div className="w-full md:w-32">
                <label className="block text-xs font-semibold text-slate-500 mb-1 md:hidden">Unit Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  step="any"
                  min={0}
                  required
                  value={row.unit_price}
                  onChange={(e) => handleItemChange(idx, 'unit_price', Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm font-mono"
                />
              </div>

              <div className="w-full md:w-32 text-right font-mono text-slate-700 font-semibold text-sm">
                <span>{(row.quantity_ordered * row.unit_price).toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveField(idx)}
                className="text-red-500 hover:bg-red-50 p-2 rounded transition"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6 text-right">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 w-full md:w-64 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase block">Total Sales Amount</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {formData.currency} {currentTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/sales/sales-orders'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Release Sales Order'}
        </button>
      </div>
    </form>
  );
}
