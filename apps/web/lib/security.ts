/**
 * Same-origin guard for state-changing (POST) requests — CSRF defense for the
 * cookie-based session. We compare the request's Origin/Referer host against
 * the app's own host(s). A state-changing request with no Origin/Referer is
 * rejected (browsers always send one on cross-site form/fetch POSTs).
 */
export function isSameOrigin(req: Request): boolean {
  return isSameOriginHeaders(req.headers);
}

/** Header-level same-origin check — usable wherever there's no full `Request`. */
export function isSameOriginHeaders(headers: Headers): boolean {
  const allowed = new Set<string>();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      allowed.add(new URL(appUrl).host);
    } catch {
      /* ignore malformed env */
    }
  }
  const host = headers.get('host');
  if (host) allowed.add(host);

  const source = headers.get('origin') ?? headers.get('referer');
  if (!source) return false;
  try {
    return allowed.has(new URL(source).host);
  } catch {
    return false;
  }
}
