import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listSalesOrders } from '@/lib/firestore/app-data';
import { createSalesOrder } from '@/lib/firestore/app-writes';
import { salesOrderSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const orders = await listSalesOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list sales orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = salesOrderSchema.parse(body);
    const result = await createSalesOrder(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create sales order' }, { status: 400 });
  }
}
