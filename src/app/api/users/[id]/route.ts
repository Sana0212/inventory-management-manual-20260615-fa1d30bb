import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { getUser } from '@/lib/firestore/app-data';
import { updateUserRecord } from '@/lib/auth/user-store';
import { deleteUser } from '@/lib/firestore/app-writes';
import { userSchema } from '@/lib/validation/entities';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  if (auth.session.role !== 'admin') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const user = await getUser(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { password_hash, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve user' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  if (auth.session.role !== 'admin') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const body = await req.json();
    
    // Partial update validation
    const validated = userSchema.partial().parse(body);

    const patch: any = {
      full_name: validated.full_name,
      email: validated.email,
      role_key: validated.role_key,
      is_active: validated.is_active,
    };

    // If updating password
    if (body.password_hash) {
      patch.password_hash = hashPassword(body.password_hash);
    }

    await updateUserRecord(id, patch);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  if (auth.session.role !== 'admin') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    if (auth.session.userId === id) {
      return NextResponse.json({ error: 'Cannot delete your own administrator account' }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
