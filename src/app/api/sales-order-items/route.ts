import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listSalesOrderItems } from '@/lib/firestore/app-data';
import { createSalesOrderItem } from '@/lib/firestore/app-writes';
import { salesOrderItemSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const items = await listSalesOrderItems();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list sales order items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = salesOrderItemSchema.parse(body);
    const result = await createSalesOrderItem(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create sales order item' }, { status: 400 });
  }
}
