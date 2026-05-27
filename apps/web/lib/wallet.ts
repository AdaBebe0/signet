'use client';

/**
 * Stellar Wallets Kit integration.
 *
 * Wraps `@creit.tech/stellar-wallets-kit` (Freighter, xBull, Albedo, …) behind
 * a small, lazily-loaded API. The kit is browser-only, so it is imported on
 * first use rather than at module scope — this keeps it out of the server
 * bundle and avoids SSR crashes.
 */

const NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet').toLowerCase();

export const NETWORK_PASSPHRASE =
  NETWORK === 'mainnet' || NETWORK === 'public'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015';

// Minimal shape of the kit surface we use — avoids leaking the full type.
interface WalletKit {
  openModal(opts: {
    onWalletSelected: (option: { id: string }) => void | Promise<void>;
    onClosed?: (err: Error) => void;
  }): Promise<void>;
  setWallet(id: string): void;
  getAddress(): Promise<{ address: string }>;
  signTransaction(
    xdr: string,
    opts: { address?: string; networkPassphrase?: string },
  ): Promise<{ signedTxXdr: string; signerAddress?: string }>;
  signMessage(
    message: string,
    opts: { address?: string },
  ): Promise<{ signedMessage: string; signerAddress?: string }>;
  disconnect(): Promise<void>;
}

let kitPromise: Promise<WalletKit> | null = null;

async function getKit(): Promise<WalletKit> {
  if (typeof window === 'undefined') {
    throw new Error('[wallet] wallet kit is browser-only');
  }
  if (!kitPromise) {
    kitPromise = (async () => {
      const mod = await import('@creit.tech/stellar-wallets-kit');
      const { StellarWalletsKit, WalletNetwork, allowAllModules } = mod;
      const network =
        NETWORK === 'mainnet' || NETWORK === 'public'
          ? WalletNetwork.PUBLIC
          : WalletNetwork.TESTNET;
      return new StellarWalletsKit({
        network,
        modules: allowAllModules(),
      }) as unknown as WalletKit;
    })();
  }
  return kitPromise;
}

const STORAGE_KEY = 'signet:wallet-id';

/** Open the wallet-selection modal and return the connected G… address. */
export async function connectWallet(): Promise<string> {
  const kit = await getKit();
  return new Promise<string>((resolve, reject) => {
    kit
      .openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            window.localStorage.setItem(STORAGE_KEY, option.id);
            const { address } = await kit.getAddress();
            resolve(address);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        },
        onClosed: (err) => reject(err ?? new Error('Wallet selection cancelled')),
      })
      .catch(reject);
  });
}

/** Restore a previously-selected wallet and return its address, if any. */
export async function getConnectedAddress(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) return null;
  try {
    const kit = await getKit();
    kit.setWallet(id);
    const { address } = await kit.getAddress();
    return address;
  } catch {
    return null;
  }
}

export async function disconnectWallet(): Promise<void> {
  window.localStorage.removeItem(STORAGE_KEY);
  try {
    const kit = await getKit();
    await kit.disconnect();
  } catch {
    /* already disconnected */
  }
}

/** Sign a base64 transaction envelope with the connected wallet. */
export async function signTransaction(xdr: string, address: string): Promise<string> {
  const kit = await getKit();
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    address,
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  return signedTxXdr;
}

/** Sign an arbitrary message; returns the base64 signature. */
export async function signMessage(message: string, address: string): Promise<string> {
  const kit = await getKit();
  const { signedMessage } = await kit.signMessage(message, { address });
  return signedMessage;
}

/**
 * Sign-In With Stellar: connect (if needed), fetch a server challenge, sign it,
 * and exchange it for a session cookie. Returns the authenticated address.
 */
export async function signIn(): Promise<string> {
  const address = (await getConnectedAddress()) ?? (await connectWallet());

  const chalRes = await fetch('/api/auth/challenge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  if (!chalRes.ok) throw new Error('Could not start sign-in');
  const { message } = (await chalRes.json()) as { message: string };

  const signature = await signMessage(message, address);

  const verifyRes = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, message, signature }),
  });
  if (!verifyRes.ok) {
    const { error } = (await verifyRes.json().catch(() => ({}))) as { error?: string };
    throw new Error(error ?? 'Sign-in verification failed');
  }
  return address;
}

export async function signOut(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
  await disconnectWallet();
}
