'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  Globe
} from 'lucide-react';

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [general, setGeneral] = useState({
    companyName: 'Inventory Hub Corp',
    contactEmail: 'logistics@company.com',
    currency: 'USD',
  });

  useEffect(() => {
    async function loadAppSettingData() {
      try {
        const res = await fetch('/api/app-settings');
        if (res.ok) {
          const data = await res.json();
          const company = data.find((s: any) => s.key === 'company_name')?.value;
          const email = data.find((s: any) => s.key === 'contact_email')?.value;
          const currencyVal = data.find((s: any) => s.key === 'currency')?.value;
          
          setGeneral({
            companyName: company || 'Inventory Hub Corp',
            contactEmail: email || 'logistics@company.com',
            currency: currencyVal || 'USD'
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

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium font-sans">Extracting general parameters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">General Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-sans">
          Adjust corporate identifiers, primary default email, and transactional currency keys.
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
          <Globe className="w-5 h-5 text-indigo-650" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Enterprise Metadata</h2>
            <p className="text-[11px] text-slate-500">Universal branding parameters utilized in documents.</p>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Operational Unit Name
            </label>
            <input
              type="text"
              value={general.companyName}
              onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
              className="block w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm placeholder-slate-400 text-slate-900 font-medium"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">Appears on outputs like purchase and sales forms.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Contact Routing Mail
            </label>
            <input
              type="email"
              value={general.contactEmail}
              onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
              className="block w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm placeholder-slate-400 text-slate-900 font-medium"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">Standard target channel for supplier order outputs.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              System Base Currency
            </label>
            <select
              value={general.currency}
              onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
              className="block w-full py-2 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm text-slate-900 font-medium"
            >
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="CAD">CAD - Canadian Dollar (C$)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Reference denomination applied during purchase aggregates.</p>
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
                  Storing Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Apply General Properties
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
