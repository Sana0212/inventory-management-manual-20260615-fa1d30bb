import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getStockTransfer } from '@/lib/firestore/app-data';
import { updateStockTransfer, deleteStockTransfer } from '@/lib/firestore/app-writes';
import { stockTransferSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const transfer = await getStockTransfer(id);
    if (!transfer) {
      return NextResponse.json({ error: 'Stock transfer not found' }, { status: 404 });
    }
    return NextResponse.json(transfer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get stock transfer' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = stockTransferSchema.parse(body);
    const payload: any = { ...validated };
    if (body.status === 'completed' && !validated.approved_by_user_id) {
      payload.approved_by_user_id = auth.session.userId;
      payload.completed_at = new Date().toISOString();
    }
    const result = await updateStockTransfer(id, payload);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update stock transfer' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteStockTransfer(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete stock transfer' }, { status: 500 });
  }
}
