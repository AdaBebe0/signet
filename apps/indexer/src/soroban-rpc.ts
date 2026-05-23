import { rpc } from '@stellar/stellar-sdk';

/** Soroban RPC client — used to read the Identity Registry's event stream. */
export function createSorobanRpcServer(rpcUrl: string): rpc.Server {
  return new rpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
}
