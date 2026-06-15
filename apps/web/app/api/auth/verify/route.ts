import { NextResponse } from 'next/server';
import { verifyChallenge, verifySignature, issueSession, SESSION_COOKIE } from '@/lib/auth';
import { isValidStellarAddress } from '@/lib/stellar-address';
import { isSameOrigin } from '@/lib/security';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
  }
  const { address, message, signature } = (await req.json().catch(() => ({}))) as {
    address?: string;
    message?: string;
    signature?: string;
  };

  if (!address || !message || !signature || !isValidStellarAddress(address)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  if (!verifyChallenge(address, message)) {
    return NextResponse.json({ error: 'Challenge invalid or expired' }, { status: 401 });
  }
  if (!(await verifySignature(address, message, signature))) {
    logger.warn({ address }, 'auth.signatureRejected');
    return NextResponse.json({ error: 'Bad signature' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, address });
  res.cookies.set(SESSION_COOKIE, issueSession(address), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  logger.info({ address }, 'auth.signedIn');
  return res;
}
