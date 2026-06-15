import { DashboardPanel } from '../../../(dashboard)/layout';
import { ProfileEditor } from './profile-editor';

export default function ProfileSettingsPage() {
  return (
    <DashboardPanel title="Edit profile">
      <ProfileEditor />
    </DashboardPanel>
  );
}
