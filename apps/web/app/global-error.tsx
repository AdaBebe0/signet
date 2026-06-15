'use client';

// Catches errors in the root layout itself. Must render its own <html>/<body>.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#0a0908',
          color: '#f5f4ee',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 32 }}>Signet is temporarily unavailable</h1>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 24,
            border: '1px solid #8b1a1a',
            background: 'transparent',
            color: '#f5f4ee',
            padding: '12px 24px',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
