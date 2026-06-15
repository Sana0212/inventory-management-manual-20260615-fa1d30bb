'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, Shield, LogOut, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Overview';
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ')).join(' / ');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left side: Hamburger button + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-4">
        {/* Security Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span className="capitalize">{user?.role ? user.role.replace('_', ' ') : 'Guest'}</span>
        </div>

        {/* Separator line */}
        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">{user?.fullName || 'Active User'}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay background to close the dropdown when clicking outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/settings/general');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>General Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50/50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
