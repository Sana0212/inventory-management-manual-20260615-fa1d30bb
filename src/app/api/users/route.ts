import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { listUsers } from '@/lib/firestore/app-data';
import { createUserRecord, hashPassword, findUserByEmail } from '@/lib/auth/user-store';
import { userSchema } from '@/lib/validation/entities';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  // Let's restrict listing users to admin-only if desired, but we can verify role or allow verified users
  if (auth.session.role !== 'admin') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const users = await listUsers();
    // Return users without sensitive password_hash
    const safeUsers = users.map(({ password_hash, ...u }) => u);
    return NextResponse.json(safeUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  if (auth.session.role !== 'admin') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = userSchema.parse(body);

    const existingUser = await findUserByEmail(validated.email);
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    if (!body.password_hash) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const hashedPassword = hashPassword(body.password_hash);

    const newUserId = await createUserRecord({
      email: validated.email,
      password_hash: hashedPassword,
      full_name: validated.full_name,
      role_key: validated.role_key,
      is_active: validated.is_active,
    });

    return NextResponse.json({ id: newUserId, email: validated.email, full_name: validated.full_name, role_key: validated.role_key });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 400 });
  }
}
