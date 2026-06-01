import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '@/lib/server/trpc';

export const runtime = 'nodejs';

const handler = (req: Request) => {
  const requestId = req.headers.get('x-request-id') ?? globalThis.crypto.randomUUID();
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ resHeaders }) => {
      resHeaders.set('x-request-id', requestId);
      const headers = new Headers(req.headers);
      headers.set('x-request-id', requestId);
      return createContext(headers);
    },
  });
};

export { handler as GET, handler as POST };
