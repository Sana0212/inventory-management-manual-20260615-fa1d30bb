'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  Globe,
  Database
} from 'lucide-react';

interface AppSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  module?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Active form structures
  const [general, setGeneral] = useState({
    companyName: 'Inventory Hub Corp',
    contactEmail: 'logistics@company.com',
    currency: 'USD',
  });

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
          setSettings(data);
          
          // Map to local forms
          const company = data.find((s: any) => s.key === 'company_name')?.value;
          const email = data.find((s: any) => s.key === 'contact_email')?.value;
          const currencyVal = data.find((s: any) => s.key === 'currency')?.value;
          
          const reserve = data.find((s: any) => s.key === 'auto_reserve')?.value;
          const strict = data.find((s: any) => s.key === 'strict_negative')?.value;
          const uom = data.find((s: any) => s.key === 'default_uom')?.value;

          if (company || email || currencyVal) {
            setGeneral({
              companyName: company || 'Inventory Hub Corp',
              contactEmail: email || 'logistics@company.com',
              currency: currencyVal || 'USD'
            });
          }

          if (reserve || strict || uom) {
            setInventory({
              autoReserveSales: reserve === 'true',
              strictNegativeStock: strict === 'true',
              defaultUom: uom || 'pcs'
            });
          }
        }
      } catch (err: any) {
        // Fallback gracefully if database table settings are not fully migrated yet
      } finally {
        setLoading(false);
      }
    }
    loadAppSettingData();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Post settings payload structured per schema app_settings
      const settingsPayload = [
        { key: 'company_name', value: general.companyName, description: 'Application organization identity' },
        { key: 'contact_email', value: general.contactEmail, description: 'Administrative routing contact' },
        { key: 'currency', value: general.currency, description: 'Default billing parameters denomination' }
      ];

      for (const item of settingsPayload) {
        await fetch('/api/app-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }

      setMessage('General configuration values updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error executing settings update cycle.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
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

      setMessage('Inventory logic metrics applied to active terminal parameters.');
    } catch (err: any) {
      setError(err?.message || 'Error occurred registering system variables.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Extracting app settings registers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Settings Top Banner context */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Application Configuration</h1>
        <p className="text-sm text-slate-550 mt-1">
          Adjust standard system variables, operational limitations rules, and default unit scales.
        </p>
      </div>

      {/* Global alert feedback messages lock */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex gap-3 text-sm animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Settings Applied</span>
            <span className="text-xs mt-0.5 block">{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Transaction Blocked</span>
            <span className="text-xs mt-0.5 block">{error}</span>
          </div>
        </div>
      )}

      {/* TWO PRIMARY COLUMN CONFIG PANEL GROUPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL A: GENERAL APP SETTINGS CONFIG - MODULE SETTINGS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/40 flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-indigo-650" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Enterprise Metadata</h2>
              <p className="text-[11px] text-slate-500">Universal branding parameters utilized in prints.</p>
            </div>
          </div>

          <form onSubmit={handleSaveGeneral} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-750 uppercase tracking-wider mb-2">
                Operational Unit Name
              </label>
              <input
                type="text"
                value={general.companyName}
                onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                className="block w-full py-2 px-3 rounded-lg border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Appears on outputs like Purchase Order declarations.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-750 uppercase tracking-wider mb-2">
                Contact Routing Mail
              </label>
              <input
                type="email"
                value={general.contactEmail}
                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                className="block w-full py-2 px-3 rounded-lg border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-755 uppercase tracking-wider mb-2">
                Denomination Currency
              </label>
              <select
                value={general.currency}
                onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                className="block w-full py-2 px-3 rounded-lg border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm text-slate-900 font-medium bg-white"
              >
                <option value="USD">USD ($) Standard Dollars</option>
                <option value="EUR">EUR (€) Unified Euro</option>
                <option value="GBP">GBP (£) Sterling Pounds</option>
                <option value="IDR">IDR (Rp) Indonesian Rupiah</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Update Metadata Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* PANEL B: INVENTORY BEHAVIOR AND RULES FORM */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/40 flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-650" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Logistics Rules Configuration</h2>
              <p className="text-[11px] text-slate-550">Configure behavioral constants inside terminal logic pools.</p>
            </div>
          </div>

          <form onSubmit={handleSaveInventory} className="p-6 space-y-5">
            <div className="space-y-4">
              
              {/* Option A Toggle */}
              <div className="flex items-start gap-3">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    checked={inventory.autoReserveSales}
                    onChange={(e) => setInventory({ ...inventory, autoReserveSales: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="text-xs">
                  <label className="font-bold text-slate-900 block">Strict Allocation Reservation</label>
                  <p className="text-slate-450 mt-0.5">
                    Automatically reserve matching on hand warehouse quantities when drafting contract sales items to prevent supply lock conflicts.
                  </p>
                </div>
              </div>

              {/* Option B Toggle */}
              <div className="flex items-start gap-3">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    checked={inventory.strictNegativeStock}
                    onChange={(e) => setInventory({ ...inventory, strictNegativeStock: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="text-xs">
                  <label className="font-bold text-slate-900 block">Restrict Negative On-Hand Stock</label>
                  <p className="text-slate-450 mt-0.5">
                    Rejects transaction post requests (sales invoice dispatch) when available storage counts reside below necessary allocation demands.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-755 uppercase tracking-wider mb-2">
                Standard UOM Assignment Base
              </label>
              <input
                type="text"
                value={inventory.defaultUom}
                onChange={(e) => setInventory({ ...inventory, defaultUom: e.target.value })}
                placeholder="pcs"
                className="block w-full py-2 px-3 rounded-lg border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Configures standard measurement increments on product additions.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Commit Rules Logic</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
// Server layout force dynamic to comply with NextJS static-compile rules where needed.
export const dynamic = 'force-dynamic';
