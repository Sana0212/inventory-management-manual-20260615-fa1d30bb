'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  Sliders
} from 'lucide-react';

export default function InventorySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [inventory, setInventory] = useState({
    autoReserveSales: true,
    strictNegativeStock: false,
    defaultUom: 'pcs',
  });

  useEffect(() => {
    async function loadAppSettingData() {
      try {
        const res = await fetch('/api/app-settings');
        if (res.ok) {
          const data = await res.json();
          const reserve = data.find((s: any) => s.key === 'auto_reserve')?.value;
          const strict = data.find((s: any) => s.key === 'strict_negative')?.value;
          const uom = data.find((s: any) => s.key === 'default_uom')?.value;

          setInventory({
            autoReserveSales: reserve === 'true',
            strictNegativeStock: strict === 'true',
            defaultUom: uom || 'pcs'
          });
        }
      } catch (err: any) {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadAppSettingData();
  }, []);

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const inventoryPayload = [
        { key: 'auto_reserve', value: String(inventory.autoReserveSales), description: 'Auto-reserve inventory levels toggle' },
        { key: 'strict_negative', value: String(inventory.strictNegativeStock), description: 'Strict negative quantity block rule' },
        { key: 'default_uom', value: inventory.defaultUom, description: 'Standard base SKU unit allocation prefix' }
      ];

      for (const item of inventoryPayload) {
        await fetch('/api/app-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }

      setMessage('Inventory logic metrics applied successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error occurred registering system variables.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium font-sans">Extracting inventory rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Inventory Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-sans">
          Manage operational inventory logic, stock validation rules, and default units of measure.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex gap-3 text-sm animate-in fade-in duration-155 font-sans">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Settings Applied</span>
            <span className="text-xs mt-0.5 block">{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-155 font-sans">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Transaction Blocked</span>
            <span className="text-xs mt-0.5 block">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl font-sans">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/40 flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-indigo-650" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Logic & Allocation Controls</h2>
            <p className="text-[11px] text-slate-500">Configure parameters checking the status of stock-levels.</p>
          </div>
        </div>

        <form onSubmit={handleSaveInventory} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="autoReserveSales"
                  type="checkbox"
                  checked={inventory.autoReserveSales}
                  onChange={(e) => setInventory({ ...inventory, autoReserveSales: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-650"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="autoReserveSales" className="font-medium text-slate-800 select-none">
                  Auto-allocate Sales Orders
                </label>
                <p className="text-[11px] text-slate-450 mt-0.5">
                  Automatically move matching items to allocated status upon registration of a draft sales request.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="strictNegativeStock"
                  type="checkbox"
                  checked={inventory.strictNegativeStock}
                  onChange={(e) => setInventory({ ...inventory, strictNegativeStock: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-650"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="strictNegativeStock" className="font-medium text-slate-800 select-none">
                  Strict Stock Validations
                </label>
                <p className="text-[11px] text-slate-450 mt-0.5">
                  Block physical sales receipts, transfers, or delivery steps if available warehouse balances drop below zero.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Default Base Unit allocation
            </label>
            <input
              type="text"
              value={inventory.defaultUom}
              onChange={(e) => setInventory({ ...inventory, defaultUom: e.target.value })}
              className="block w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
              placeholder="e.g. pcs, boxes, kgs"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Fallback unit applied automatically when creating custom stock catalog items.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying Rules...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Inventory Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
