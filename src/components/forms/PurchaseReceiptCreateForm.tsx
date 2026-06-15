'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PurchaseOrderRecord, WarehouseRecord, ProductRecord } from '@/data/types';

interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ReceiptItemInput {
  purchase_order_item_id: string;
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_previously_received: number;
  quantity_received: number;
}

export function PurchaseReceiptCreateForm({ onSuccess, onCancel }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);

  const [formData, setFormData] = useState({
    purchase_order_id: '',
    receipt_number: '',
    warehouse_id: '',
    notes: '',
  });

  const [receiptItems, setReceiptItems] = useState<ReceiptItemInput[]>([]);

  useEffect(() => {
    // Generate automatic receipt number
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, receipt_number: `REC-${new Date().getFullYear()}-${rand}` }));

    // Load available orders, warehouses and products
    Promise.all([
      fetch('/api/purchase-orders').then((res) => res.json()),
      fetch('/api/warehouses').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([pos, whs, prods]) => {
        // filter only approved or ordered POS
        setPurchaseOrders(Array.isArray(pos) ? pos.filter((po) => po.status === 'ordered' || po.status === 'approved' || po.status === 'open') : []);
        setWarehouses(Array.isArray(whs) ? whs.filter(w => w.is_active) : []);
        setProducts(Array.isArray(prods) ? prods : []);
        setInitialLoading(false);
      })
      .catch(() => {
        setError('Failed to query warehouses, products & purchase orders');
        setInitialLoading(false);
      });
  }, []);

  // When PO changes, fetch its line items and autofill receipt quantities
  const handlePOChange = async (poId: string) => {
    setFormData((prev) => ({ ...prev, purchase_order_id: poId }));
    if (!poId) {
      setReceiptItems([]);
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/purchase-order-items?purchase_order_id=${poId}`);
      const items = await res.json();
      
      const filteredItems = Array.isArray(items) ? items.filter((i) => i.purchase_order_id === poId) : [];

      const formatted = filteredItems.map((i: any) => {
        const prod = products.find((p) => p.id === i.product_id);
        const name = prod ? `${prod.name} (${prod.sku})` : 'Unknown Product';
        const pending = Math.max(0, (i.quantity_ordered || 0) - (i.quantity_received || 0));
        return {
          purchase_order_item_id: i.id || '',
          product_id: i.product_id,
          product_name: name,
          quantity_ordered: i.quantity_ordered,
          quantity_previously_received: i.quantity_received || 0,
          quantity_received: pending, // default receive the remainder
        };
      });

      setReceiptItems(formatted);
    } catch {
      setError('Could not retrieve line items for the selected purchase order.');
    }
  };

  const handleItemQtyChange = (index: number, val: number) => {
    setReceiptItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, quantity_received: val };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.purchase_order_id) {
      setError('Please select a Purchase Order');
      setLoading(false);
      return;
    }

    if (!formData.warehouse_id) {
      setError('Please select a destination warehouse');
      setLoading(false);
      return;
    }

    if (receiptItems.length === 0) {
      setError('This purchase order has no valid line items to receive.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        items: receiptItems.map((ri) => ({
          purchase_order_item_id: ri.purchase_order_item_id,
          product_id: ri.product_id,
          quantity_received: Number(ri.quantity_received),
        })),
      };

      const response = await fetch('/api/purchase-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to complete receipt');
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/purchasing/purchase-receipts');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving purchase receipt');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Record New Purchase Receipt</h3>
        <p className="text-sm text-slate-500">Verify and enter quantities delivered by the supplier into virtual storage stock.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-200" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Number *</label>
          <input
            type="text"
            required
            value={formData.receipt_number}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_number: e.target.value }))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Purchase Order *</label>
          <select
            required
            value={formData.purchase_order_id}
            onChange={(e) => handlePOChange(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
          >
            <option value="">-- Choose active PO --</option>
            {purchaseOrders.map((po) => (
              <option key={po.id} value={po.id}>
                {po.po_number} (Total Amount: {po.total_amount?.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Destination Warehouse *</label>
          <select
            required
            value={formData.warehouse_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value }))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
          >
            <option value="">-- Choose target store --</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Notes / Comments</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none"
            placeholder="e.g. Received undamaged box items"
          />
        </div>
      </div>

      {receiptItems.length > 0 && (
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-base font-semibold text-slate-900 mb-3">Delivered Quantities Verification</h4>
          
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full border-collapse bg-white text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3 text-center">Ordered</th>
                  <th className="px-4 py-3 text-center">Already Rec.</th>
                  <th className="px-4 py-3 text-center w-36">Now Receiving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {receiptItems.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {item.quantity_ordered}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-amber-600">
                      {item.quantity_previously_received}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max={item.quantity_ordered - item.quantity_previously_received}
                        required
                        value={item.quantity_received}
                        onChange={(e) => handleItemQtyChange(index, Number(e.target.value))}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-center text-sm font-semibold"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/purchasing/purchase-receipts'))}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Filing Receipts...' : 'Post Goods Receipt'}
        </button>
      </div>
    </form>
  );
}
