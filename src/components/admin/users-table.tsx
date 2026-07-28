'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/shared/empty-state';
import { PLAN_CONFIG, STATUS_CONFIG } from './types';
import type { AdminUser, AdminUserPlan, AdminUserStatus } from './types';

interface UsersTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UsersTable({ users, onView, onEdit, onSuspend, onDelete }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState<AdminUserPlan | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<AdminUserStatus | 'all'>('all');
  const [expandedUserId, setExpandedUserId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      if (planFilter !== 'all' && u.plan !== planFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (
        search &&
        !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [users, search, planFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as AdminUserPlan | 'all')}
            className="rounded-lg border border-border bg-background-surface px-3 py-1.5 text-xs text-text-secondary focus:border-accent focus:outline-none"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="agency">Agency</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminUserStatus | 'all')}
            className="rounded-lg border border-border bg-background-surface px-3 py-1.5 text-xs text-text-secondary focus:border-accent focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="trial">Trial</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No users found"
          description={search ? 'Try adjusting your search terms' : 'No users match the selected filters'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-background-surface">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                  Status
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                  Joined
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                  Clips
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <React.Fragment key={user.id}>
                  <MotionTr
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className={cn(
                      'border-b border-border-subtle transition-colors hover:bg-background-surface/50',
                      expandedUserId === user.id && 'bg-background-surface/30',
                    )}
                  >
                    <td className="px-4 py-3">
                      <button
                        className="flex items-center gap-3 text-left"
                        onClick={() =>
                          setExpandedUserId(expandedUserId === user.id ? null : user.id)
                        }
                      >
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-background-elevated text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                        </div>
                        {expandedUserId === user.id ? (
                          <ChevronUp className="ml-1 h-4 w-4 text-text-tertiary shrink-0" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4 text-text-tertiary shrink-0" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn('text-2xs', PLAN_CONFIG[user.plan].badgeClass)}
                      >
                        {PLAN_CONFIG[user.plan].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_CONFIG[user.status].variant} className="text-2xs">
                        {STATUS_CONFIG[user.status].label}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3">
                      <span className="text-xs text-text-tertiary">
                        {new Date(user.joinedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className="text-xs text-text-secondary tabular-nums">
                        {user.clipsGenerated.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(user)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSuspend(user)}>
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-danger"
                              onClick={() => onDelete(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </MotionTr>

                  {/* Expanded detail row */}
                  {expandedUserId === user.id && (
                    <tr className="border-b border-border-subtle bg-background-surface/20">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg bg-background-card p-3">
                            <p className="text-2xs text-text-tertiary">Clips Generated</p>
                            <p className="text-sm font-semibold text-text-primary">
                              {user.clipsGenerated.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-background-card p-3">
                            <p className="text-2xs text-text-tertiary">Streams Imported</p>
                            <p className="text-sm font-semibold text-text-primary">
                              {user.streamsImported.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-background-card p-3">
                            <p className="text-2xs text-text-tertiary">Posts Scheduled</p>
                            <p className="text-sm font-semibold text-text-primary">
                              {user.postsScheduled.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-background-card p-3">
                            <p className="text-2xs text-text-tertiary">Total Spend</p>
                            <p className="text-sm font-semibold text-text-primary">
                              ${user.totalSpend.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            View Full Profile
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
