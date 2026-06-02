import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Liveness/readiness probe for load balancers and uptime monitors.
 *
 * Always reports the service as live. If `DATABASE_URL` is configured it also
 * runs a fast `SELECT 1` and reports the DB as a readiness check — but a DB
 * outage degrades to `status: "degraded"` with HTTP 200 rather than failing the
 * whole probe, since the static `/p` profiles serve without a database.
 */
async function checkDb(): Promise<'up' | 'down' | 'skipped'> {
  if (!process.env.DATABASE_URL) return 'skipped';
  try {
    const { prisma } = await import('@signet/db');
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ]);
    return 'up';
  } catch {
    return 'down';
  }
}

export async function GET() {
  const db = await checkDb();
  const status = db === 'down' ? 'degraded' : 'ok';
  return NextResponse.json(
    {
      status,
      service: 'signet-web',
      ts: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      checks: { db },
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
