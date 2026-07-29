import { currentUser } from '@clerk/nextjs/server';
import { DashboardClient } from '@/components/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await currentUser();
  const userName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Creator';

  return <DashboardClient userName={userName} />;
}
