import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getPurchaseReceipt } from '@/lib/firestore/app-data';
import { updatePurchaseReceipt, deletePurchaseReceipt } from '@/lib/firestore/app-writes';
import { purchaseReceiptSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const purchaseReceipt = await getPurchaseReceipt(id);
    if (!purchaseReceipt) {
      return NextResponse.json({ error: 'Purchase receipt not found' }, { status: 404 });
    }
    return NextResponse.json(purchaseReceipt);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get purchase receipt' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = purchaseReceiptSchema.parse(body);
    const result = await updatePurchaseReceipt(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update purchase receipt' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deletePurchaseReceipt(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete purchase receipt' }, { status: 500 });
  }
}
