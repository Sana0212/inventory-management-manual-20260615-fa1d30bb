import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getStockLevel } from '@/lib/firestore/app-data';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const stockLevel = await getStockLevel(id);
    if (!stockLevel) {
      return NextResponse.json({ error: 'Stock level not found' }, { status: 404 });
    }
    return NextResponse.json(stockLevel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get stock level' }, { status: 500 });
  }
}
