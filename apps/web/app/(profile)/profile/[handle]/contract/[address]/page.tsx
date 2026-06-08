import { permanentRedirect } from 'next/navigation';

/**
 * Legacy per-contract route. Contract detail now lives inline on the profile;
 * redirect to the canonical profile page until a dedicated view is built.
 */
export default async function LegacyContractRedirect({
  params,
}: {
  params: Promise<{ handle: string; address: string }>;
}) {
  const { handle } = await params;
  permanentRedirect(`/p/${handle.toLowerCase()}`);
}
