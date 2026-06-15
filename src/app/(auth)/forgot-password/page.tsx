'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Mail, 
  AlertCircle, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Unable to process request under specified email.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        
        {/* Brand identity */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 font-bold border border-indigo-500 mb-4">
            <ArrowLeftRight className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Inventory Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Recovery Protocol</p>
        </div>

        {/* Action card */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 p-8 shadow-2xl">
          
          <h2 className="text-lg font-semibold text-slate-100">Reset Security Credentials</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Specify the registered corporate email below. Systems will verify the user records and issue further procedural authorizations.
          </p>

          {success ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-2 text-xs">
              <div className="flex gap-2 font-semibold text-sm items-center">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Dispatch Completed</span>
              </div>
              <p className="leading-relaxed">
                If the record exists within the data pools, password reset parameters were generated. Check your inbox folders.
              </p>
              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Return to credential entry
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex gap-2 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying details...</span>
                  </>
                ) : (
                  <span>Request Reset Link</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-xs">
            <span className="text-slate-400">Remembered parameters? </span>
            <Link
              href="/login"
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Sign back in
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
