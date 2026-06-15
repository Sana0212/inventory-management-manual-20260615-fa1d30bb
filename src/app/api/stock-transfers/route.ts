import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listStockTransfers } from '@/lib/firestore/app-data';
import { createStockTransfer } from '@/lib/firestore/app-writes';
import { stockTransferSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const transfers = await listStockTransfers();
    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list stock transfers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = stockTransferSchema.parse(body);
    const result = await createStockTransfer({
      ...validated,
      requested_by_user_id: auth.session.userId,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create stock transfer' }, { status: 400 });
  }
}
