'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Warehouse, 
  Boxes, 
  CheckCircle, 
  Lock, 
  Mail, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password_hash: password }), 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      await refreshSession();
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden">
      
      {/* LEFT DESIGN SIDEBAR - Primary Brand & Information Panel */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between p-12 relative bg-cover bg-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white border-r border-slate-800">
        
        {/* Soft floating background light shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

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
        <div className="my-auto max-w-xl relative z-10">
          <span className="text-sm font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            Core Operations Framework
          </span>
          <h2 className="text-4xl xl:text-5xl font-black mt-6 tracking-tight leading-tight">
            Streamline your stock, suppliers, and order workflows.
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed font-normal">
            A comprehensive terminal built for operations departments to optimize order throughput, monitor real-time warehouse allocations, and manage material supply schedules.
          </p>

          {/* Key Value bullet items */}
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Continuous Stock Allocation</h4>
                <p className="text-xs text-slate-400 mt-0.5">Auto-reserve inventory against valid customer contracts instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Warehouse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 font-medium">Multi-Warehouse Transfers</h4>
                <p className="text-xs text-slate-400 mt-0.5">Track shipping actions and accept stock receipt increments seamlessly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Automated Reorder Levels</h4>
                <p className="text-xs text-slate-400 mt-0.5">Visual low-stock alerts that keep procurement pipelines on trace.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="text-xs text-slate-500 flex justify-between relative z-10 mt-6 pt-6 border-t border-slate-800">
          <span>&copy; {new Date().getFullYear()} MonstarX Corp. All rights reserved.</span>
          <span>Security Certified TLS 1.3</span>
        </div>
      </div>

      {/* RIGHT LOGIN FORM SIDE - Light Comfortable UX Card Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-slate-50 text-slate-950">
        <div className="w-full max-w-md mx-auto">
          
          {/* Logo badge displayed only on mobile viewports */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Inventory Hub</h1>
              <p className="text-xs text-slate-500">Warehouse Operations</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Security Login</h2>
            <p className="text-sm text-slate-500 mt-2">Enter credentials permitted by your administrator.</p>
          </div>

          {/* Form validation alert notification banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Authentication Error</span>
                <span className="text-xs mt-0.5 block">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest">
                  Secure Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Forgot your credentials?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Validating session...</span>
                </>
              ) : (
                <span>Access Dashboard System</span>
              )}
            </button>
          </form>

          {/* Create multi auth links option */}
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm">
            <span className="text-slate-500">Need an account inside the system? </span>
            <Link
              href="/register"
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
