import { cookies } from 'next/headers';
import { verifySession, SESSION_COOKIE } from '../auth.ts';

/**
 * Resolve the signed-in wallet address from the session cookie, server-side.
 * Returns null when there is no valid session. Used by dashboard server
 * components (the `(dashboard)` layout already gates rendering on this).
 */
export async function currentAddress(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
