import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listPurchaseOrders } from '@/lib/firestore/app-data';
import { createPurchaseOrder } from '@/lib/firestore/app-writes';
import { purchaseOrderSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const purchaseOrders = await listPurchaseOrders();
    return NextResponse.json(purchaseOrders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list purchase orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = purchaseOrderSchema.parse(body);
    const result = await createPurchaseOrder(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create purchase order' }, { status: 400 });
  }
}
