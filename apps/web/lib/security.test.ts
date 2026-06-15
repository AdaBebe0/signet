import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSameOrigin } from './security.ts';

function req(headers: Record<string, string>): Request {
  return { headers: new Headers(headers) } as unknown as Request;
}

test('allows a same-origin request (matches app url)', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://app.test';
  assert.ok(isSameOrigin(req({ origin: 'https://app.test' })));
});

test('allows a same-origin request via the host header', () => {
  delete process.env.NEXT_PUBLIC_APP_URL;
  assert.ok(isSameOrigin(req({ host: 'app.test', origin: 'https://app.test' })));
});

test('rejects a cross-origin request', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://app.test';
  assert.equal(isSameOrigin(req({ origin: 'https://evil.test' })), false);
});

test('rejects when no origin or referer is present', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://app.test';
  assert.equal(isSameOrigin(req({})), false);
});

test('falls back to the referer header', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://app.test';
  assert.ok(isSameOrigin(req({ referer: 'https://app.test/app' })));
});
