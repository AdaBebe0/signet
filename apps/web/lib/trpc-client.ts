import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/trpc';

/**
 * Browser tRPC client for the authenticated dashboard surface.
 *
 * `AppRouter` is imported as a type only, so none of the server modules (fs,
 * crypto, Prisma) are pulled into the client bundle. The session cookie is sent
 * automatically on same-origin requests, which is what authorizes the
 * `account.*` procedures.
 */
export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
});
