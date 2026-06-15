import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getDashboardData } from '@/lib/firestore/app-data';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
