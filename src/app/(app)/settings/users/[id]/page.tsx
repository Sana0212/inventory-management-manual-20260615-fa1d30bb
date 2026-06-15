'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role_key: string;
  is_active: boolean;
  last_login_at?: string;
  created_at?: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadUserDetail() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error('User account does not exist or has been removed');
        }
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Error occurred retrieving profile detail definitions.');
      } finally {
        setLoading(false);
      }
    }
    loadUserDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to execute profile deletion process.');
      }
      router.push('/settings/users');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'An unexpected error interrupted database execution.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Extracting specific profile parameters...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Detail Retrieval Interrupted</h2>
          <p className="text-sm text-slate-500 mt-1">{error || 'The requested user could not be located.'}</p>
        </div>
        <Link 
          href="/settings/users" 
          className="inline-flex items-center gap-1.5 text-xs text-indigo-650 font-bold uppercase tracking-wider hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Return button link */}
      <div className="flex items-center justify-between">
        <Link 
          href="/settings/users" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-550 hover:text-indigo-650 font-bold transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
        
        <div className="flex items-center gap-2.5">
          <Link
            href={`/settings/users/${id}/edit`}
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-3.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold py-1.5 px-3.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-205 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Banner details layout header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{user.full_name}</h1>
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-850 bg-emerald-50 border border-emerald-100 uppercase tracking-wide">
                    Authorized Access
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-850 bg-rose-50 border border-rose-100 uppercase tracking-wide">
                    Suspended
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold text-slate-600">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl border border-slate-205/60 shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-650" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role</span>
              <span className="block text-xs font-extrabold text-slate-800">
                {user.role_key === 'admin' ? 'Administrator' : 
                 user.role_key === 'inventory_manager' ? 'Inventory Manager' : 
                 user.role_key === 'purchasing_clerk' ? 'Purchasing Clerk' : 
                 user.role_key === 'sales_clerk' ? 'Sales Clerk' : user.role_key}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed parameters records grid */}
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-4">Metadata parameters logs</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="flex items-start gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Synchronization</span>
                <span className="block text-sm font-semibold text-slate-800 mt-0.5">
                  {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'No active session verified.'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Registered At</span>
                <span className="block text-sm font-semibold text-slate-800 mt-0.5">
                  {user.created_at ? new Date(user.created_at).toLocaleString() : 'Original setup migration period.'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CONFIRMATION DESTRUCTIVE ACTION DIALOG */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Destroy User Account?</h3>
              <p className="text-sm text-slate-500 mt-1">
                This transaction breaks and terminates active session parameters instantly. This workflow cannot be reversed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-slate-550 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                disabled={isDeleting}
              >
                No, Keep Account
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Destroying...
                  </>
                ) : (
                  'Yes, Remove Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
