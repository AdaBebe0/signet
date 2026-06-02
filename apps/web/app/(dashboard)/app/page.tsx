import { DashboardPanel } from '../../(dashboard)/layout';

export default function DashboardPage() {
  return (
    <DashboardPanel title="Overview">
      Connect a Stellar wallet to claim your handle and manage the Soroban
      contracts attributed to your identity. Wallet authentication is enabled in
      Phase 2 via the on-chain Identity Registry — until then, browse the live
      curated profiles at <code className="text-[#b8b5a8]">/p/&#123;handle&#125;</code>.
    </DashboardPanel>
  );
}
