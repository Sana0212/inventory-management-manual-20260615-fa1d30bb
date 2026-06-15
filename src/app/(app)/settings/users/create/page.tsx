'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form input registers state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleKey, setRoleKey] = useState('inventory_manager');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        full_name: fullName,
        email,
        password_hash: password,
        role_key: roleKey,
        is_active: isActive,
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create user account');
      }

      router.push('/settings/users');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Error executing transactional request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Return link */}
      <div>
        <Link 
          href="/settings/users" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-550 hover:text-indigo-650 font-bold transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
      </div>

      {/* Header section */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-850" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Provision User Account</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Complete the security definitions form below to enable live environment terminal operations.
        </p>
      </div>

      {/* Alert flags */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 text-rose-605 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Execution Error</span>
            <span className="text-xs mt-0.5 block">{error}</span>
          </div>
        </div>
      )}

      {/* PROVISION FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-205 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
        
        <div className="p-6 space-y-5">
          <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Personnel Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Samuel Patterson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full py-2 px-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="sam@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-2 px-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Credentials & Privileges</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Logon Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters limit"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-2 pl-3 pr-10 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm text-slate-900 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                System Role Context
              </label>
              <select
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                className="block w-full py-2 px-3 border border-slate-205 bg-white rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-semibold"
                required
              >
                <option value="admin">Administrator (Full operational scope)</option>
                <option value="inventory_manager">Inventory Manager (Stock Levels control)</option>
                <option value="purchasing_clerk">Purchasing Clerk (Receive suppliers orders)</option>
                <option value="sales_clerk">Sales Clerk (Route Customers transactions)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Account Directives</h2>

          <div className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 gap-3.5">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-1"
            />
            <div className="text-sm">
              <label htmlFor="isActive" className="font-bold text-slate-900 select-none">
                Enable Immediate Terminal Access
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Disable this check to stage the user profile credentials while blocking network authorization sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Form bottom controls actions bar */}
        <div className="px-6 py-4 bg-slate-50/70 flex items-center justify-end gap-3.5">
          <Link
            href="/settings/users"
            className="px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded-xl text-sm text-slate-650 font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Staging Credentials...
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Create Live User
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
