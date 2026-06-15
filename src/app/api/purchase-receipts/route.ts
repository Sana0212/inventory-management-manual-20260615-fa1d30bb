import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listPurchaseReceipts } from '@/lib/firestore/app-data';
import { createPurchaseReceipt } from '@/lib/firestore/app-writes';
import { purchaseReceiptSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const purchaseReceipts = await listPurchaseReceipts();
    return NextResponse.json(purchaseReceipts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list purchase receipts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = purchaseReceiptSchema.parse(body);
    const result = await createPurchaseReceipt(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create purchase receipt' }, { status: 400 });
  }
}
