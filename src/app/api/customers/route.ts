import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listCustomers } from '@/lib/firestore/app-data';
import { createCustomer } from '@/lib/firestore/app-writes';
import { customerSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const customers = await listCustomers();
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = customerSchema.parse(body);
    const result = await createCustomer(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create customer' }, { status: 400 });
  }
}
