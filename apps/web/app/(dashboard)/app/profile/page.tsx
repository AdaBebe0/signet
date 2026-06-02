import { DashboardPanel } from '../../../(dashboard)/layout';

export default function ProfileSettingsPage() {
  return (
    <DashboardPanel title="Edit profile">
      Set the display name and bio shown on your public{' '}
      <code className="text-[#b8b5a8]">/p/&#123;handle&#125;</code> page. Your
      handle and linked wallets are governed on-chain; everything else here is
      presentation. Editing opens in Phase 2.
    </DashboardPanel>
  );
}
