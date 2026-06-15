import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listWarehouses } from '@/lib/firestore/app-data';
import { createWarehouse } from '@/lib/firestore/app-writes';
import { warehouseSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const warehouses = await listWarehouses();
    return NextResponse.json(warehouses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list warehouses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = warehouseSchema.parse(body);
    const result = await createWarehouse(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create warehouse' }, { status: 400 });
  }
}
