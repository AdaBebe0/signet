/**
 * In-memory fixed-window rate limiter.
 *
 * This is a per-instance best-effort limiter — good enough as a first line of
 * defense against abuse/bursts on a single server. For correctness across a
 * horizontally-scaled / serverless deployment, swap the `Map` for a shared
 * store (e.g. Upstash Redis) behind the same `rateLimit(key)` signature.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const MAX_KEYS = 10_000;

type Entry = { count: number; reset: number };
const hits = new Map<string, Entry>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  key: string,
  max = MAX_PER_WINDOW,
  windowMs = WINDOW_MS,
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  }

  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: max - 1, resetMs: windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, max - entry.count);
  return { ok: entry.count <= max, remaining, resetMs: entry.reset - now };
}

/** Test-only: clear all counters. */
export function __resetRateLimit(): void {
  hits.clear();
}
