import { NextResponse } from 'next/server';
import { createChallenge } from '@/lib/auth';
import { isValidStellarAddress } from '@/lib/stellar-address';
import { isSameOrigin } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
  }
  const { address } = (await req.json().catch(() => ({}))) as { address?: string };
  if (!address || !isValidStellarAddress(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }
  return NextResponse.json({ message: createChallenge(address) }, { headers: { 'cache-control': 'no-store' } });
}
