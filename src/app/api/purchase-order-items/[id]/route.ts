import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import {
  updatePurchaseOrderItem,
  deletePurchaseOrderItem,
} from '@/lib/firestore/app-writes';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const db = getAdminFirestore();
    const doc = await appCollection(db, 'purchase_order_items').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ item: { id: doc.id, ...doc.data() } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const body = await req.json();
    const item = await updatePurchaseOrderItem(id, body);
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    await deletePurchaseOrderItem(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
