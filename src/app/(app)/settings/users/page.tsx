'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserPlus, 
  Search, 
  ChevronRight, 
  Shield, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Edit2,
  Trash2,
  Lock
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

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to retrieve user listing');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Error occurred retrieving users data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || 'Error occurred during deletion cycle.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role_key === roleFilter : true;
    const matchesStatus = 
      activeFilter === 'active' ? u.is_active === true :
      activeFilter === 'inactive' ? u.is_active === false : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Extracting users directory registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-800" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Accounts</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure credential details, specific roles key, and authorization status across internal personnel.
          </p>
        </div>
        <Link 
          href="/settings/users/create"
          className="inline-flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Create New User
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Error Loading Directory</span>
            <span className="text-xs mt-0.5 block">{error}</span>
          </div>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-205 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-205 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-650 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:w-80">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-slate-205 bg-white rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-medium"
          >
            <option value="">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="inventory_manager">Inventory Manager</option>
            <option value="purchasing_clerk">Purchasing Clerk</option>
            <option value="sales_clerk">Sales Clerk</option>
          </select>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-slate-205 bg-white rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Suspended</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE PANEL */}
      <div className="bg-white border border-slate-205 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/70">
              <tr>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Personnel Identity
                </th>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assigned Key Role
                </th>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Access Status
                </th>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Last Synchronization
                </th>
                <th scope="col" className="relative px-6 py-4.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 divide-dashed">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                    No active account registers match the selected parameters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-sm">
                          {user.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                          <Link href={`/settings/users/${user.id}`} className="font-semibold text-slate-900 text-sm hover:underline block">
                            {user.full_name}
                          </Link>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        {user.role_key === 'admin' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-indigo-700 border border-purple-100 gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            Administrator
                          </span>
                        )}
                        {user.role_key === 'inventory_manager' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            Inventory Manager
                          </span>
                        )}
                        {user.role_key === 'purchasing_clerk' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            Purchasing Clerk
                          </span>
                        )}
                        {user.role_key === 'sales_clerk' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Sales Clerk
                          </span>
                        )}
                        {!['admin', 'inventory_manager', 'purchasing_clerk', 'sales_clerk'].includes(user.role_key) && (
                          <span className="text-slate-500 text-xs tracking-wide uppercase font-bold text-center">
                            {user.role_key}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-850 bg-emerald-50">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Authorized
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-rose-850 bg-rose-50">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {user.last_login_at ? (
                        new Date(user.last_login_at).toLocaleString()
                      ) : (
                        <span className="text-slate-300 italic">Never logged in</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/settings/users/${user.id}`}
                          className="p-1 px-2.5 border border-slate-205 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/settings/users/${user.id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-indigo-650 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE DIALOG MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Destroy User Account?</h3>
              <p className="text-sm text-slate-500 mt-1">
                This action reverses user session allocations instantly and blocks access permanently.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-slate-550 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                disabled={isDeleting}
              >
                No, Keep
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Remove Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
