/**
 * Cheap shape guard for a Stellar public key (G… StrKey, base32, 56 chars).
 * Not a checksum validation — `Keypair.fromPublicKey` does the real check
 * downstream and throws on a bad key.
 */
const G_ADDRESS = /^G[A-Z2-7]{55}$/;

export function isValidStellarAddress(address: string): boolean {
  return G_ADDRESS.test(address);
}
