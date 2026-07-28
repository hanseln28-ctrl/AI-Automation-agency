'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { toast } from 'sonner';
import {
  Globe,
  Shield,
  Sliders,
  HardDrive,
  Power,
  Key,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_SYSTEM_SETTINGS } from '@/components/admin/mock-data';

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState(MOCK_SYSTEM_SETTINGS);

  const handleToggleMaintenance = () => {
    setSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    toast(settings.maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled');
  };

  const handleToggleSignups = () => {
    setSettings((prev) => ({ ...prev, allowNewSignups: !prev.allowNewSignups }));
    toast(settings.allowNewSignups ? 'New signups disabled' : 'New signups enabled');
  };

  const handleOAuthToggle = (provider: keyof typeof settings.oauthProviders) => {
    setSettings((prev) => ({
      ...prev,
      oauthProviders: {
        ...prev.oauthProviders,
        [provider]: !prev.oauthProviders[provider],
      },
    }));
    toast(`${provider}: ${settings.oauthProviders[provider] ? 'Disabled' : 'Enabled'}`);
  };

  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PageHeader
        title="Settings"
        description="Platform configuration and system settings"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Config */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Globe className="h-4 w-4 text-accent" />
            Connected Platforms (OAuth)
          </h3>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Manage which OAuth providers users can connect
          </p>
          <div className="mt-4 space-y-3">
            {Object.entries(settings.oauthProviders).map(([provider, enabled]) => (
              <div
                key={provider}
                className="flex items-center justify-between rounded-lg bg-background-surface p-3"
              >
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary capitalize">{provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      enabled
                        ? 'text-2xs bg-success-subtle/30 text-success border-success/20'
                        : 'text-2xs bg-background-elevated text-text-disabled border-border'
                    }
                  >
                    {enabled ? 'Connected' : 'Disabled'}
                  </Badge>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() =>
                      handleOAuthToggle(provider as keyof typeof settings.oauthProviders)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Sliders className="h-4 w-4 text-accent" />
            System Settings
          </h3>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Rate limits, file size, and global controls
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-background-surface p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Rate Limit (per minute)</p>
                  <p className="text-2xs text-text-tertiary">API requests per user per minute</p>
                </div>
                <Input
                  type="number"
                  value={settings.rateLimitPerMinute}
                  className="w-20 h-8 text-xs text-center"
                  readOnly
                />
              </div>
            </div>
            <div className="rounded-lg bg-background-surface p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Max File Upload Size</p>
                  <p className="text-2xs text-text-tertiary">Stream upload size limit</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    {settings.maxFileSizeMB} MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Maintenance Mode */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Power className="h-4 w-4 text-warning" />
            Maintenance Mode
          </h3>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Takes the site offline for users while admins retain access
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-background-surface p-3">
              <div>
                <p className="text-sm text-text-secondary">Maintenance Mode</p>
                <Badge
                  variant="outline"
                  className={
                    settings.maintenanceMode
                      ? 'text-2xs bg-warning-subtle/30 text-warning border-warning/20 mt-1'
                      : 'text-2xs bg-success-subtle/30 text-success border-success/20 mt-1'
                  }
                >
                  {settings.maintenanceMode ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={handleToggleMaintenance} />
            </div>
            {settings.maintenanceMode && (
              <div className="rounded-lg bg-background-surface p-3">
                <p className="text-xs text-text-secondary mb-1">Maintenance Message</p>
                <Input
                  value={settings.maintenanceMessage}
                  className="h-8 text-xs"
                  readOnly
                />
              </div>
            )}
          </div>
        </Card>

        {/* Registration Controls */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Shield className="h-4 w-4 text-accent" />
            Registration & Access
          </h3>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Control who can sign up for the platform
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between rounded-lg bg-background-surface p-3">
              <div>
                <p className="text-sm text-text-secondary">Allow New Signups</p>
                <Badge
                  variant="outline"
                  className={
                    settings.allowNewSignups
                      ? 'text-2xs bg-success-subtle/30 text-success border-success/20 mt-1'
                      : 'text-2xs bg-warning-subtle/30 text-warning border-warning/20 mt-1'
                  }
                >
                  {settings.allowNewSignups ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <Switch checked={settings.allowNewSignups} onCheckedChange={handleToggleSignups} />
            </div>
          </div>
        </Card>
      </div>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-danger/30 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-danger">
          <Shield className="h-4 w-4" />
          Danger Zone
        </h3>
        <p className="mt-0.5 text-xs text-text-tertiary">
          Irreversible actions. Proceed with extreme caution.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-danger border-danger/30 hover:bg-danger-subtle text-xs"
            onClick={() => toast.error('This action requires confirmation')}
          >
            Reset All Rate Limits
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-danger border-danger/30 hover:bg-danger-subtle text-xs"
            onClick={() => toast.error('This action requires confirmation')}
          >
            Clear AI Cache
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-danger border-danger/30 hover:bg-danger-subtle text-xs"
            onClick={() => toast.error('This action requires confirmation')}
          >
            Revoke All API Keys
          </Button>
        </div>
      </Card>
    </MotionDiv>
  );
}
