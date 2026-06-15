'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  CheckCircle,
  Warehouse,
  Boxes
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshSession } = useSession();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    roleKey: 'admin', // default to admin or first permitted role as specified
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          role_key: form.roleKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Registration failed. Try again.');
      }

      await refreshSession();
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden">
      
      {/* LEFT DESIGN PANEL - consistent brand layout block */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between p-12 relative bg-cover bg-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white border-r border-slate-800">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        {/* Brand Top Identifier */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 font-bold border border-indigo-500">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Inventory Hub</h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise Warehouse System</p>
          </div>
        </div>

        {/* Feature Context Content */}
        <div className="my-auto max-w-lg relative z-10">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            Collaborative Access
          </span>
          <h2 className="text-3xl xl:text-4xl font-black mt-6 tracking-tight leading-tight text-white">
            Define roles to direct your team workflows.
          </h2>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            Assign unique capabilities to Logistics Managers, Purchasing Clerks, and Sales Operations representatives to protect business inventories and limit manual adjustment errors.
          </p>

          <div className="mt-8 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-300"><strong className="text-slate-100">Audit-Safe Logging:</strong> Trace adjusting entries back to original register user records automatically.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Warehouse className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-300"><strong className="text-slate-100">Isolated Segments:</strong> Permit warehouse staff access to designated zones uniquely.</p>
            </div>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="text-xs text-slate-500 relative z-10 pt-6 border-t border-slate-800">
          &copy; {new Date().getFullYear()} MonstarX Corp. Security Certified.
        </div>
      </div>

      {/* RIGHT REGISTER FORM - Light Comfortable UI Card Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 bg-slate-50 text-slate-950 overflow-y-auto py-12">
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Enlist New Account</h2>
            <p className="text-xs text-slate-500 mt-1">Configure profile data and state your designated function.</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Registration Denied</span>
                <span className="mt-0.5 block">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Initial Assignment Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <select
                  value={form.roleKey}
                  onChange={(e) => setForm({ ...form, roleKey: e.target.value })}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors appearance-none"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="inventory_manager">Inventory Manager (Stock Adjustments)</option>
                  <option value="purchasing_clerk">Purchasing Clerk (PO & Suppliers)</option>
                  <option value="sales_clerk">Sales Clerk (Sales Orders)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Configuring workspace...</span>
                </>
              ) : (
                <span>Register Account Profile</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs">
            <span className="text-slate-500">Already registered with us? </span>
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Access credentials log
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
