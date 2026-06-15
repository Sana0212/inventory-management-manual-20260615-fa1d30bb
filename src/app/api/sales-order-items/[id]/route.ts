import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getSalesOrderItem } from '@/lib/firestore/app-data';
import { updateSalesOrderItem, deleteSalesOrderItem } from '@/lib/firestore/app-writes';
import { salesOrderItemSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const item = await getSalesOrderItem(id);
    if (!item) {
      return NextResponse.json({ error: 'Sales order item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get sales order item' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = salesOrderItemSchema.parse(body);
    const result = await updateSalesOrderItem(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update sales order item' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteSalesOrderItem(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete sales order item' }, { status: 500 });
  }
}
