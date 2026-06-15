import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getSalesOrder } from '@/lib/firestore/app-data';
import { updateSalesOrder, deleteSalesOrder } from '@/lib/firestore/app-writes';
import { salesOrderSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const order = await getSalesOrder(id);
    if (!order) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get sales order' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = salesOrderSchema.parse(body);
    const result = await updateSalesOrder(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update sales order' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteSalesOrder(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete sales order' }, { status: 500 });
  }
}
