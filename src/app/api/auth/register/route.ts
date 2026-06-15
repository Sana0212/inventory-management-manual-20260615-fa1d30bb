import { NextResponse } from 'next/server';
import {
  authUserFullName,
  authUserRole,
  createUserRecord,
  findUserByEmail,
  hashPassword,
  normalizeEmail,
} from '@/lib/auth/user-store';
import { createSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const first_name = typeof body.first_name === 'string' ? body.first_name.trim() : '';
    const last_name = typeof body.last_name === 'string' ? body.last_name.trim() : '';
    const full_name =
      typeof body.full_name === 'string'
        ? body.full_name.trim()
        : `${first_name} ${last_name}`.trim();
    const department = typeof body.department === 'string' ? body.department.trim() : '';
    const role_key = typeof body.role_key === 'string' ? body.role_key : 'employee';

    if (!email || !password || (!full_name && !first_name && !last_name)) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const password_hash = hashPassword(password);
    const userId = await createUserRecord({
      email,
      password_hash,
      first_name: first_name || undefined,
      last_name: last_name || undefined,
      full_name: full_name || undefined,
      role_key,
      department: department || undefined,
      is_active: true,
    });

    const fullName = full_name || `${first_name} ${last_name}`.trim();
    const role = role_key;

    await createSession({
      userId,
      email,
      role,
      fullName,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, userId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
