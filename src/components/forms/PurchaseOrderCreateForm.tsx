'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SupplierRecord, ProductRecord } from '@/data/types';

interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface OrderItemInput {
  product_id: string;
  quantity_ordered: number;
  unit_price: number;
}

export function PurchaseOrderCreateForm({ onSuccess, onCancel }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);

  const [formData, setFormData] = useState({
    po_number: '',
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_date: '',
    status: 'draft',
    currency: 'USD',
  });

  const [items, setItems] = useState<OrderItemInput[]>([
    { product_id: '', quantity_ordered: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    // Generate an automatic PO Number as default
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, po_number: `PO-${new Date().getFullYear()}-${rand}` }));

    // Load master data
    Promise.all([
      fetch('/api/suppliers').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([suppliersData, productsData]) => {
        setSuppliers(Array.isArray(suppliersData) ? suppliersData.filter(s => s.is_active) : []);
        setProducts(Array.isArray(productsData) ? productsData.filter(p => p.is_active) : []);
      })
      .catch(() => {
        setError('Failed to load master dataset of products or suppliers');
      });
  }, []);

  const handleItemProductChange = (index: number, productId: string) => {
    const selectedProd = products.find((p) => p.id === productId);
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          product_id: productId,
          unit_price: selectedProd ? selectedProd.cost_price || 0 : 0,
        };
      })
    );
  };

  const handleItemValueChange = (index: number, field: 'quantity_ordered' | 'unit_price', value: number) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: value };
      })
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { product_id: '', quantity_ordered: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.supplier_id) {
      setError('Please select a supplier');
      setLoading(false);
      return;
    }

    if (items.some((i) => !i.product_id)) {
      setError('Please make sure all items have a selected product');
      setLoading(false);
      return;
    }

    try {
      const total_amount = calculateTotal();
      const payload = {
        ...formData,
        total_amount,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity_ordered: Number(item.quantity_ordered),
          quantity_received: 0,
          unit_price: Number(item.unit_price),
          line_total: Number(item.quantity_ordered) * Number(item.unit_price),
        })),
      };

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create purchase order');
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/purchasing/purchase-orders');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Create Purchase Order</h3>
        <p className="text-sm text-slate-500">Draft a purchase request and specify nested items.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">PO Number *</label>
          <input
            type="text"
            name="po_number"
            required
            value={formData.po_number}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Supplier *</label>
          <select
            name="supplier_id"
            required
            value={formData.supplier_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
          <input
            type="date"
            name="expected_date"
            value={formData.expected_date}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="USD, EUR, GBP"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-slate-900">Line Items</h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
          >
            + Add Line Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-slate-500 mb-1">Product *</label>
                <select
                  required
                  value={item.product_id}
                  onChange={(e) => handleItemProductChange(index, e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity_ordered}
                  onChange={(e) => handleItemValueChange(index, 'quantity_ordered', Number(e.target.value))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none"
                />
              </div>

              <div className="w-32">
                <label className="block text-xs font-medium text-slate-500 mb-1">Unit Cost</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={item.unit_price}
                  onChange={(e) => handleItemValueChange(index, 'unit_price', Number(e.target.value))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none"
                />
              </div>

              <div className="w-28 py-2 text-sm text-slate-500 font-medium self-center mt-4">
                Total: {(item.quantity_ordered * item.unit_price).toFixed(2)}
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 p-2 mb-1.5"
                  title="Remove product"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 text-base font-bold text-slate-900 border-t border-slate-100 pt-3">
          Est. Grand Total: {formData.currency} {calculateTotal().toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/purchasing/purchase-orders'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </button>
      </div>
    </form>
  );
}
