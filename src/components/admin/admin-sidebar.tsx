'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Settings,
  Flag,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/ai-usage', label: 'AI Usage', icon: BarChart3 },
  { href: '/admin/feature-flags', label: 'Feature Flags', icon: Flag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border-subtle bg-background-surface">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary tracking-tight">Admin Panel</p>
          <p className="text-2xs text-text-tertiary">IRON Creator OS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent-subtle text-accent'
                  : 'text-text-secondary hover:bg-background-card hover:text-text-primary',
              )}
            >
              {isActive && (
                <MotionDiv
                  layoutId="admin-active"
                  className="absolute left-0 h-6 w-0.5 rounded-r-full bg-accent"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {/* Badge indicators */}
              {item.href === '/admin/users' && (
                <span className="ml-auto rounded-full bg-accent-subtle px-1.5 py-0.5 text-2xs text-accent">
                  8
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle p-3">
        <div className="rounded-lg bg-background-card p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <p className="text-2xs text-text-secondary">System Status: Operational</p>
          </div>
          <p className="mt-1 text-2xs text-text-tertiary">v0.1.0 • Build 2024.07.22</p>
        </div>
      </div>
    </aside>
  );
}
