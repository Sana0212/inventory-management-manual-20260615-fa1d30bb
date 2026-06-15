import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listStockLevels } from '@/lib/firestore/app-data';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const stockLevels = await listStockLevels();
    return NextResponse.json(stockLevels);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list stock levels' }, { status: 500 });
  }
}
