import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appRouter, createContext } from './trpc.ts';
import { __resetRateLimit } from '../rate-limit.ts';

// Integration test over the full API stack: input validation → rate-limit +
// logging middleware → profile data layer. Uses the synthetic testnet fixtures
// in public/data (cwd is apps/web when the test runs).
function caller(ip: string) {
  return appRouter.createCaller(createContext(new Headers({ 'x-forwarded-for': ip })));
}

test('profile.byHandle returns the profile with computed on-chain stats', async () => {
  __resetRateLimit();
  const res = await caller('10.0.0.1').profile.byHandle({ handle: 'aquawolf' });
  assert.ok(res, 'expected a profile');
  assert.equal(res!.handle, 'aquawolf');
  assert.match(res!.profile.wallet, /^G[A-Z0-9]{55}$/);
  assert.ok(res!.stats.invocations >= 1);
  assert.ok(res!.stats.uniqueFunctions >= 1);
});

test('profile.byHandle rejects a malformed handle', async () => {
  __resetRateLimit();
  await assert.rejects(() => caller('10.0.0.2').profile.byHandle({ handle: 'BAD HANDLE!' }));
});

test('profile.list includes the curated handles', async () => {
  __resetRateLimit();
  const list = await caller('10.0.0.3').profile.list();
  assert.ok(list.includes('aquawolf'));
  assert.ok(list.length >= 3);
});

test('health procedure reports ok', async () => {
  __resetRateLimit();
  const res = await caller('10.0.0.4').health();
  assert.equal(res.ok, true);
});

test('rate limiter blocks a caller after the window max', async () => {
  __resetRateLimit();
  const c = caller('10.0.0.99');
  let blocked = false;
  for (let i = 0; i < 65; i++) {
    try {
      await c.health();
    } catch {
      blocked = true;
      break;
    }
  }
  assert.ok(blocked, 'expected rate limiting to trigger within 65 calls');
});
