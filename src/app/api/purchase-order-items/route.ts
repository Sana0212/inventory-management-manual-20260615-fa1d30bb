import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { appCollection } from '@/lib/firebase/collections';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
  createPurchaseOrderItem,
} from '@/lib/firestore/app-writes';

export async function GET(req: Request) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const db = getAdminFirestore();
    const url = new URL(req.url);
    const purchaseOrderId = url.searchParams.get('purchase_order_id');

    let query: any = appCollection(db, 'purchase_order_items');
    if (purchaseOrderId) {
      query = query.where('purchase_order_id', '==', purchaseOrderId);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    const item = await createPurchaseOrderItem(body);
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
