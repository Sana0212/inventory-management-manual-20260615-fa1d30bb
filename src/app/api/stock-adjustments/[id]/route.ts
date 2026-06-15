import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getStockAdjustment } from '@/lib/firestore/app-data';
import { updateStockAdjustment, deleteStockAdjustment } from '@/lib/firestore/app-writes';
import { stockAdjustmentSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const adjustment = await getStockAdjustment(id);
    if (!adjustment) {
      return NextResponse.json({ error: 'Stock adjustment not found' }, { status: 404 });
    }
    return NextResponse.json(adjustment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get stock adjustment' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = stockAdjustmentSchema.parse(body);
    const result = await updateStockAdjustment(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update stock adjustment' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteStockAdjustment(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete stock adjustment' }, { status: 500 });
  }
}
