import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getPurchaseOrder } from '@/lib/firestore/app-data';
import { updatePurchaseOrder, deletePurchaseOrder } from '@/lib/firestore/app-writes';
import { purchaseOrderSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const purchaseOrder = await getPurchaseOrder(id);
    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }
    return NextResponse.json(purchaseOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get purchase order' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = purchaseOrderSchema.parse(body);
    const result = await updatePurchaseOrder(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update purchase order' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deletePurchaseOrder(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete purchase order' }, { status: 500 });
  }
}
