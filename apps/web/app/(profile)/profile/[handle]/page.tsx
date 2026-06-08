import { permanentRedirect } from 'next/navigation';

/**
 * `/profile/{handle}` is a legacy alias. The canonical, database-free profile
 * surface is `/p/{handle}` (see `app/p/[handle]/page.tsx`). Redirect so there
 * is exactly one profile implementation and no route depends on Postgres at
 * request time.
 */
export default async function LegacyProfileRedirect({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  permanentRedirect(`/p/${handle.toLowerCase()}`);
}
