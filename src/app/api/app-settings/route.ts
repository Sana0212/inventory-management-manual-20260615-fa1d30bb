import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { appCollection } from '@/lib/firebase/collections';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
  createAppSettings,
} from '@/lib/firestore/app-writes';

export async function GET(req: Request) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const db = getAdminFirestore();
    const snapshot = await appCollection(db, 'app_settings').get();
    const settings = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    const setting = await createAppSettings(body);
    return NextResponse.json({ success: true, setting });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
