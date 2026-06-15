import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Keypair } from '@stellar/stellar-sdk';
import {
  issueSession,
  verifySession,
  createChallenge,
  verifyChallenge,
  verifySignature,
} from './auth.ts';

test('session token round-trips to its address', () => {
  const token = issueSession('GWALLET');
  assert.equal(verifySession(token), 'GWALLET');
});

test('tampered or garbage session is rejected', () => {
  const token = issueSession('GWALLET');
  const [data] = token.split('.');
  assert.equal(verifySession(`${data}.deadbeef`), null);
  assert.equal(verifySession('not-a-token'), null);
  assert.equal(verifySession(undefined), null);
});

test('sessions issued before valid-after are revoked', () => {
  const token = issueSession('GWALLET');
  assert.equal(verifySession(token), 'GWALLET');
  process.env.SIGNET_SESSIONS_VALID_AFTER = String(Date.now() + 1000);
  try {
    assert.equal(verifySession(token), null);
  } finally {
    delete process.env.SIGNET_SESSIONS_VALID_AFTER;
  }
});

test('challenge verifies and is bound to the address', () => {
  const msg = createChallenge('GWALLET');
  assert.ok(verifyChallenge('GWALLET', msg));
  assert.ok(!verifyChallenge('GOTHER', msg));
});

test('tampered challenge (forged nonce) is rejected', () => {
  const forged = createChallenge('GWALLET').replace(/Nonce: \w+/, 'Nonce: 0000');
  assert.ok(!verifyChallenge('GWALLET', forged));
});

test('verifySignature accepts a genuine signature and rejects a bad one', async () => {
  const kp = Keypair.random();
  const address = kp.publicKey();
  const message = createChallenge(address);
  const goodSig = kp.sign(Buffer.from(message, 'utf8')).toString('base64');

  assert.equal(await verifySignature(address, message, goodSig), true);
  assert.equal(
    await verifySignature(address, message, Buffer.from('wrong').toString('base64')),
    false,
  );
  // A signature from a different key must not validate.
  const otherSig = Keypair.random().sign(Buffer.from(message)).toString('base64');
  assert.equal(await verifySignature(address, message, otherSig), false);
});
