import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  hashPassword,
  normalizeEmail,
  updateUserRecord,
} from '@/lib/auth/user-store';

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newHash = hashPassword(password);
    await updateUserRecord(user.id!, { password_hash: newHash });

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
