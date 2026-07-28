'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Tv,
  Scissors,
  Send,
  BarChart3,
  Briefcase,
  DollarSign,
  MessagesSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/streams', label: 'Streams', icon: Tv },
  { href: '/clips', label: 'Clips', icon: Scissors },
  { href: '/publishing', label: 'Publishing', icon: Send },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/sponsorships', label: 'Sponsorships', icon: Briefcase },
  { href: '/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/community', label: 'Community', icon: MessagesSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-background-surface transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-text-primary">
              IRON<span className="text-accent">Creator</span>
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-6 w-6 text-text-tertiary hover:text-text-primary"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-subtle text-accent'
                  : 'text-text-secondary hover:bg-background-card hover:text-text-primary',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-card hover:text-text-primary',
            collapsed && 'justify-center px-2',
          )}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Usage Bar */}
        {!collapsed && (
          <div className="mt-2 rounded-md bg-background-card p-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Free tier</span>
              <span className="text-text-secondary">0/5 clips</span>
            </div>
            <div className="h-1.5 rounded-full bg-background-elevated">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: '0%' }}
              />
            </div>
            <Link
              href="/settings/billing"
              className="mt-2 block text-center text-xs font-medium text-accent hover:text-accent-hover"
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
