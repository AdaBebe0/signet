import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { isSameOrigin } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
