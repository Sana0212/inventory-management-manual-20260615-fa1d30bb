'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import LayoutShell from '@/components/shell/layout';
import { Loader2 } from 'lucide-react';

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-semibold tracking-wide text-slate-400">Restoring auth gateway...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <LayoutShell>{children}</LayoutShell>;
}
