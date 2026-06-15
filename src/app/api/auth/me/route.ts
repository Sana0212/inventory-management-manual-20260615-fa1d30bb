import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify-request';
import { authUserFullName, authUserRole, findUserByEmail } from '@/lib/auth/user-store';

export async function GET() {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const user = await findUserByEmail(authVal.session.email);
  if (!user) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      userId: user.id!,
      email: user.email,
      role: authUserRole(user, authVal.session.role),
      fullName: authUserFullName(user, authVal.session.fullName),
      ...(user.department ? { department: user.department } : {}),
    },
  });
}
