import { NextResponse } from 'next/server';
import { createChallenge } from '@/lib/auth';
import { isValidStellarAddress } from '@/lib/stellar-address';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { address } = (await req.json().catch(() => ({}))) as { address?: string };
  if (!address || !isValidStellarAddress(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }
  return NextResponse.json({ message: createChallenge(address) }, { headers: { 'cache-control': 'no-store' } });
}
