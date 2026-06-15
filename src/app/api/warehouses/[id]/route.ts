import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getWarehouse } from '@/lib/firestore/app-data';
import { updateWarehouse, deleteWarehouse } from '@/lib/firestore/app-writes';
import { warehouseSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const warehouse = await getWarehouse(id);
    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json(warehouse);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get warehouse' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = warehouseSchema.parse(body);
    const result = await updateWarehouse(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update warehouse' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteWarehouse(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete warehouse' }, { status: 500 });
  }
}
