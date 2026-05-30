import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit, __resetRateLimit } from './rate-limit.ts';

test('allows up to the max then blocks within the window', () => {
  __resetRateLimit();
  const key = 'ip:test';
  for (let i = 0; i < 5; i++) {
    assert.equal(rateLimit(key, 5).ok, true, `call ${i + 1} should pass`);
  }
  assert.equal(rateLimit(key, 5).ok, false, '6th call should be blocked');
});

test('decrements remaining', () => {
  __resetRateLimit();
  assert.equal(rateLimit('k', 3).remaining, 2);
  assert.equal(rateLimit('k', 3).remaining, 1);
  assert.equal(rateLimit('k', 3).remaining, 0);
});

test('separate keys have independent budgets', () => {
  __resetRateLimit();
  rateLimit('a', 1);
  assert.equal(rateLimit('a', 1).ok, false);
  assert.equal(rateLimit('b', 1).ok, true);
});

test('window resets after expiry', () => {
  __resetRateLimit();
  assert.equal(rateLimit('w', 1, 1).ok, true); // 1ms window
  const past = Date.now() + 5;
  while (Date.now() < past) {
    /* spin briefly past the 1ms window */
  }
  assert.equal(rateLimit('w', 1, 1).ok, true);
});
