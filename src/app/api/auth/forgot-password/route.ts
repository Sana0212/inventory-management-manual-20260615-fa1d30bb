import { NextResponse } from 'next/server';
import { findUserByEmail, normalizeEmail } from '@/lib/auth/user-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, password reset instructions have been sent.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
