import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listSuppliers } from '@/lib/firestore/app-data';
import { createSupplier } from '@/lib/firestore/app-writes';
import { supplierSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const suppliers = await listSuppliers();
    return NextResponse.json(suppliers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list suppliers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = supplierSchema.parse(body);
    const result = await createSupplier(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create supplier' }, { status: 400 });
  }
}
