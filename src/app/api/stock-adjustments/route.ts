import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listStockAdjustments } from '@/lib/firestore/app-data';
import { createStockAdjustment } from '@/lib/firestore/app-writes';
import { stockAdjustmentSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const adjustments = await listStockAdjustments();
    return NextResponse.json(adjustments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list stock adjustments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = stockAdjustmentSchema.parse(body);
    const result = await createStockAdjustment({
      ...validated,
      created_by_user_id: auth.session.userId,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create stock adjustment' }, { status: 400 });
  }
}
