import { DashboardClient } from '@/components/dashboard';

export default function DashboardPage() {
  // currentUser() requires clerkMiddleware which we can't use yet
  // Fall back to client-side auth via Clerk hooks in DashboardClient
  return <DashboardClient userName="Creator" />;
}
