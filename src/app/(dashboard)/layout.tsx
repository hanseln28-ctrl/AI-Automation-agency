import nextDynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';

export const dynamic = 'force-dynamic';

const ClientClerkProvider = nextDynamic(
  () =>
    import('@/components/layout/client-clerk-provider').then(
      (mod) => mod.ClientClerkProvider
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    ),
  }
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientClerkProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
        </div>
      </div>
    </ClientClerkProvider>
  );
}
