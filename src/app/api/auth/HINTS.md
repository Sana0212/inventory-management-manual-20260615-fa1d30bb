# Auth — already wired in the base template

**Do not recreate** these files. They are cloned from `Full_App_Template` and shared by every app.

| Path | Method | Role |
|------|--------|------|
| `login/route.ts` | POST | Email/password → session cookie |
| `register/route.ts` | POST | Create user in Firestore `users` table + session |
| `logout/route.ts` | POST | Clear session cookie |
| `me/route.ts` | GET | Return `{ user: { userId, email, role, fullName } }` for useSession |
| `forgot-password/route.ts` | POST | Email lookup (no email provider) |
| `reset-password/route.ts` | POST | `{ email, password }` → update `password_hash` |

## Supporting files (already wired)

```text
src/lib/auth/session.ts
src/lib/auth/user-store.ts    — findUserByEmail, createUserRecord, hashPassword, normalizeEmail
src/lib/auth/verify-request.ts
src/hooks/useSession.tsx
```

## GET /api/auth/me — critical

`useSession` calls `setUser(body.user ?? null)`. Response **must** be:

```json
{
  "user": {
    "userId": "doc-id",
    "email": "user@example.com",
    "role": "employee",
    "fullName": "Jane Doe"
  }
}
```

## API phase rule

The API agent implements **CRUD + dashboard only**. Do **not** rewrite auth routes or `user-store.ts` unless fixing a listed contract violation.

## Protecting feature APIs

```ts
import { requireAuth } from '@/lib/auth/verify-request';

export async function GET() {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;
  const { session } = authVal;
  // session.userId, session.email, session.role, session.fullName
}
```

Auth is **shared** across all templates. Feature APIs (`documents`, `invoices`, …) are **per product**.
