import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0908] px-6 text-center text-[#f5f4ee]">
      <p
        className="mb-3 text-[11px] uppercase tracking-[0.26em] text-[#8b1a1a]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        404
      </p>
      <h1 className="text-4xl font-bold tracking-[-0.025em]" style={{ fontFamily: 'var(--font-display)' }}>
        Not found
      </h1>
      <p className="mt-4 max-w-xs text-sm text-[#8a8779]">
        That page or handle doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[#8b1a1a] transition-colors hover:text-[#c2410c]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        ← Back to Signet
      </Link>
    </main>
  );
}
