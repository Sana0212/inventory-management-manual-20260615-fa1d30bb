import { NextResponse } from 'next/server';
import {
  authUserFullName,
  authUserRole,
  findUserByEmail,
  hashPassword,
  normalizeEmail,
  updateUserRecord,
} from '@/lib/auth/user-store';
import { createSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.is_active === false) {
      return NextResponse.json({ error: 'Your account is disabled' }, { status: 403 });
    }

    const hashedPassword = hashPassword(password);
    if (!user.password_hash || user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const loginTime = new Date().toISOString();
    await updateUserRecord(user.id!, { last_login_at: loginTime });

    const fullName = authUserFullName(user);
    const role = authUserRole(user);

    await createSession({
      userId: user.id!,
      email: user.email,
      role,
      fullName,
      createdAt: loginTime,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
