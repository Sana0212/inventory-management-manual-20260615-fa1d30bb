import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getCustomer } from '@/lib/firestore/app-data';
import { updateCustomer, deleteCustomer } from '@/lib/firestore/app-writes';
import { customerSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const customer = await getCustomer(id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get customer' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = customerSchema.parse(body);
    const result = await updateCustomer(id, validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update customer' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await props.params;

  try {
    await deleteCustomer(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete customer' }, { status: 500 });
  }
}
