'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { mainNav, secondaryNav, settingsNav, byRoleNav, NavItemItem } from '@/components/app/navConfig';
import { LogOut, LayoutGrid, Menu, X, ArrowLeftRight, UserCheck } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const userRole = user?.role || 'admin';
  const roleRules = byRoleNav[userRole] || byRoleNav.admin;

  const isAllowed = (item: NavItemItem, type: 'main' | 'settings') => {
    // Check path prefix matches or is inside allowed lists
    if (type === 'main') {
      return roleRules.main.some(p => item.route.startsWith(p) || p.startsWith(item.route));
    } else {
      return roleRules.settings.some(p => item.route.startsWith(p) || p.startsWith(item.route));
    }
  };

  const filteredMain = mainNav.filter(item => isAllowed(item, 'main'));
  const filteredSecondary = secondaryNav.filter(item => isAllowed(item, 'main'));
  const filteredSettings = settingsNav.filter(item => isAllowed(item, 'settings'));

  const isActive = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(route);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 bg-slate-950 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-sm text-slate-100">Inventory Hub</span>
          <span className="text-[10px] text-slate-400 font-medium">Business ERP</span>
        </div>
      </div>

      {/* User Bio Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-semibold text-sm">
          {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-slate-200">{user?.fullName || 'Active User'}</p>
          <div className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400 capitalize truncate font-medium">
              {user?.role ? user.role.replace('_', ' ') : 'Administrator'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
            Core Logistics
          </span>
          <nav className="mt-2 space-y-1">
            {filteredMain.map((item) => {
              const active = isActive(item.route);
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {filteredSecondary.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Master Data
            </span>
            <nav className="mt-2 space-y-1">
              {filteredSecondary.map((item) => {
                const active = isActive(item.route);
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {filteredSettings.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              System Configuration
            </span>
            <nav className="mt-2 space-y-1">
              {filteredSettings.map((item) => {
                const active = isActive(item.route);
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Nav Action */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors py-1 px-2 rounded-md hover:bg-rose-500/10 w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </div>
  );
}
