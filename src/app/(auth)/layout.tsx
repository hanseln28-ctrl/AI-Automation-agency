import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const ClientClerkProvider = dynamic(
  () =>
    import('@/components/layout/client-clerk-provider').then(
      (mod) => mod.ClientClerkProvider
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex w-full max-w-md justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </div>
    ),
  }
);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientClerkProvider>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </ClientClerkProvider>
  );
}
