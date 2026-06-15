import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listProducts } from '@/lib/firestore/app-data';
import { createProduct } from '@/lib/firestore/app-writes';
import { productSchema } from '@/lib/validation/entities';

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const products = await listProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const validated = productSchema.parse(body);
    const result = await createProduct(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 400 });
  }
}
