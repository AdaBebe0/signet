import { DashboardPanel } from '../../../(dashboard)/layout';

export default function WalletsPage() {
  return (
    <DashboardPanel title="Wallets">
      Link the deployment wallets you control. Each link is a signed proof of
      ownership written to the on-chain Identity Registry, so the contracts a
      wallet has deployed can be attributed to your handle. Wallet linking opens
      in Phase 2.
    </DashboardPanel>
  );
}
