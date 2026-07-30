import { ClientOnly } from '@/components/shared/client-only';
import { ClientClerkProvider } from '@/components/layout/client-clerk-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <ClientClerkProvider>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </ClientClerkProvider>
    </ClientOnly>
  );
}
