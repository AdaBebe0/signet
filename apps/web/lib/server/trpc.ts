import { initTRPC } from '@trpc/server';
import { getProfile, getOperations, listHandles, isValidHandle, computeStats } from '../profiles.ts';
import { logger } from '../logger.ts';
import { rateLimit } from '../rate-limit.ts';

/**
 * tRPC server setup.
 *
 * The context carries request-derived data shared by every procedure: the
 * incoming headers, a per-request id for tracing, and the caller's ip (for
 * rate limiting). Profile data is read lazily inside resolvers via
 * `@/lib/profiles`, so the API works with or without Postgres.
 */
export interface Context {
  headers: Headers;
  requestId: string;
  ip: string;
}

export function createContext(headers: Headers): Context {
  const requestId = headers.get('x-request-id') ?? globalThis.crypto.randomUUID();
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown';
  return { headers, requestId, ip };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;

/** Logs each call (path, type, duration, outcome) with the request id. */
const observed = t.procedure.use(async ({ ctx, path, type, next }) => {
  const start = Date.now();
  const res = await next();
  logger.info(
    { requestId: ctx.requestId, path, type, ok: res.ok, durationMs: Date.now() - start },
    'trpc.request',
  );
  return res;
});

/** Per-ip rate limit on top of logging. */
const publicProcedure = observed.use(async ({ ctx, path, next }) => {
  const { ok, remaining } = rateLimit(`${ctx.ip}:${path}`);
  if (!ok) {
    logger.warn({ requestId: ctx.requestId, path, ip: ctx.ip }, 'trpc.rateLimited');
    throw new Error('Too many requests');
  }
  void remaining;
  return next();
});

export { publicProcedure };

/** Lightweight validator: ensures a well-formed handle without a schema lib. */
function handleInput(raw: unknown): { handle: string } {
  const handle = String((raw as { handle?: unknown })?.handle ?? '').toLowerCase();
  if (!isValidHandle(handle)) throw new Error('Invalid handle');
  return { handle };
}

/** Procedures backing the public-facing profile surface. */
const profileRouter = router({
  list: publicProcedure.query(() => listHandles()),

  byHandle: publicProcedure.input(handleInput).query(async ({ input }) => {
    const profile = await getProfile(input.handle);
    if (!profile) return null;
    const operations = await getOperations(input.handle);
    return {
      handle: input.handle,
      profile,
      stats: computeStats(operations),
      operations,
    };
  }),
});

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true, service: 'signet', ts: Date.now() })),
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
