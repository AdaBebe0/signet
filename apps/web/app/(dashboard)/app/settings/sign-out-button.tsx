'use client';

import { useState } from 'react';
import { signOut } from '@/lib/wallet';

/** Ends the session (clears the cookie) and disconnects the wallet, then reloads. */
export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      className="bg-[#f5f4ee] px-7 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[#0a0908] transition-all duration-300 hover:bg-[#c2410c] hover:text-[#f5f4ee] disabled:opacity-60"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
