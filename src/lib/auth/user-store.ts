import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';
import * as crypto from 'crypto';

/** Firestore users row — supports first_name/last_name or full_name/displayName across apps. */
export type AuthUserRecord = {
  id?: string;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  displayName?: string;
  role_key?: string;
  role?: string;
  department?: string;
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function authUserFullName(user: AuthUserRecord, fallback = ''): string {
  const fromNames = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
  return fromNames || user.full_name?.trim() || user.displayName?.trim() || fallback;
}

export function authUserRole(user: AuthUserRecord, fallback = 'user'): string {
  return user.role_key ?? user.role ?? fallback;
}

function omitUndefined<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'users')
    .where('email', '==', normalizeEmail(email))
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<AuthUserRecord, 'id'>) };
}

export async function createUserRecord(input: {
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role_key?: string;
  department?: string;
  is_active?: boolean;
}): Promise<string> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'users').doc();
  const timestamp = new Date().toISOString();
  await ref.set(
    omitUndefined({
      ...input,
      email: normalizeEmail(input.email),
      role_key: input.role_key ?? 'employee',
      is_active: input.is_active ?? true,
      created_at: timestamp,
    }),
  );
  return ref.id;
}

export async function updateUserRecord(
  id: string,
  patch: Partial<Omit<AuthUserRecord, 'id'>>,
): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const next = { ...patch };
  if (next.email) next.email = normalizeEmail(next.email);
  await appCollection(db, 'users').doc(id).update(omitUndefined(next));
}
