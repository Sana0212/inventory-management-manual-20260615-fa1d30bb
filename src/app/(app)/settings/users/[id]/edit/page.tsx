'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only update if specified
  const [roleKey, setRoleKey] = useState('inventory_manager');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error('Could not retrieve requested user details record');
        }
        const user = await res.json();
        setFullName(user.full_name || '');
        setEmail(user.email || '');
        setRoleKey(user.role_key || 'inventory_manager');
        setIsActive(user.is_active ?? true);
      } catch (err: any) {
        setError(err.message || 'Error occurred pulling user definitions.');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        full_name: fullName,
        email,
        role_key: roleKey,
        is_active: isActive,
      };

      if (password) {
        payload.password_hash = password;
      }

      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update selected user account');
      }

      router.push(`/settings/users/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Error updating database record parameters.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Extracting user account descriptors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Return link */}
      <div>
        <Link 
          href={`/settings/users/${id}`} 
          className="inline-flex items-center gap-1.5 text-xs text-slate-550 hover:text-indigo-650 font-bold transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Profile Details
        </Link>
      </div>

      {/* Header section */}
      <div>
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-650" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configure User Profile</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Adjust structural key roles, name fields, account access states, or rotate their authentication password below.
        </p>
      </div>

      {/* Error notification window */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 text-rose-605 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Commit Terminated</span>
            <span className="text-xs mt-0.5 block">{error}</span>
          </div>
        </div>
      )}

      {/* EDIT CONFIG DETAILS FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-205 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
        
        <div className="p-6 space-y-5">
          <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Personnel Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                User Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full py-2 px-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Corporate Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-2 px-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm placeholder-slate-400 text-slate-900 font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Security Parameters</h2>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">Optional Update</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rotate Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave completely blank to keep password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-2 pl-3 pr-10 rounded-xl border border-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-650 text-sm string text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-405 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Operational System Role
              </label>
              <select
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                className="block w-full py-2 px-3 border border-slate-205 bg-white rounded-xl text-sm text-slate-805 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-semibold"
                required
              >
                <option value="admin">Administrator (Universal terminal context)</option>
                <option value="inventory_manager">Inventory Manager (Stock levels management)</option>
                <option value="purchasing_clerk">Purchasing Clerk (Manage suppliers invoices)</option>
                <option value="sales_clerk">Sales Clerk (Route orders lines)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-850 uppercase tracking-widest text-slate-400">Authorization Logic</h2>

          <div className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 gap-3.5">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-slate-350 rounded focus:ring-indigo-500 mt-1"
            />
            <div className="text-sm">
              <label htmlFor="isActive" className="font-bold text-slate-900 select-none">
                Maintain User Authorization Access Status
              </label>
              <p className="text-xs text-slate-550 mt-0.5">
                Revoke this option immediately to suspend this user's ability to login or execute active API queries.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="px-6 py-4 bg-slate-50/70 flex items-center justify-end gap-3.5">
          <Link
            href={`/settings/users/${id}`}
            className="px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded-xl text-sm text-slate-650 font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Applying updates...
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Commit Variable Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
