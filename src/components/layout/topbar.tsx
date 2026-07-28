'use client';

import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\[id\]/g, 'Detail');
    return { href, label };
  });
}

export function TopBar() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background-surface px-6">
      {/* Mobile menu trigger */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu size={18} />
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden items-center gap-1.5 text-sm sm:flex">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-text-tertiary">/</span>}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? 'font-medium text-text-primary'
                  : 'text-text-secondary'
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-text-secondary">
          <Bell size={18} />
        </Button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      </div>
    </header>
  );
}
