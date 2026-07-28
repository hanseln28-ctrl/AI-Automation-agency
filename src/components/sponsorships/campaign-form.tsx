'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Deliverable, DeliverableType, DeliverableStatus } from './types';
import { DELIVERABLE_TYPE_CONFIG } from './types';

interface NewDeliverable {
  title: string;
  type: DeliverableType;
  platform: string;
  dueDate: string;
}

interface CampaignFormProps {
  onSubmit?: (data: {
    brandName: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    budget: string;
    notes: string;
    deliverables: NewDeliverable[];
  }) => void;
  onCancel?: () => void;
}

export function CampaignForm({ onSubmit, onCancel }: CampaignFormProps) {
  const [brandName, setBrandName] = React.useState('');
  const [campaignName, setCampaignName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [deliverables, setDeliverables] = React.useState<NewDeliverable[]>([
    { title: '', type: 'video', platform: 'youtube', dueDate: '' },
  ]);

  const addDeliverable = () => {
    setDeliverables((prev) => [
      ...prev,
      { title: '', type: 'video', platform: 'youtube', dueDate: '' },
    ]);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDeliverable = (index: number, field: keyof NewDeliverable, value: string) => {
    setDeliverables((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      brandName,
      campaignName,
      startDate,
      endDate,
      budget,
      notes,
      deliverables,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Brand Name</label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Razer"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Campaign Name</label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Kraken V4 Launch"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Budget ($)</label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 15000"
              min="0"
              step="100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Campaign notes, requirements, special instructions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deliverables</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addDeliverable}>
            <Plus className="mr-1 h-4 w-4" />
            Add Deliverable
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliverables.map((deliverable, index) => (
            <div
              key={index}
              className="rounded-lg border border-border-subtle bg-background-surface p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  Deliverable #{index + 1}
                </span>
                {deliverables.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger"
                    onClick={() => removeDeliverable(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-text-secondary">Title</label>
                  <Input
                    value={deliverable.title}
                    onChange={(e) => updateDeliverable(index, 'title', e.target.value)}
                    placeholder="e.g. Unboxing & First Impressions"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Type</label>
                  <Select
                    value={deliverable.type}
                    onValueChange={(v) => updateDeliverable(index, 'type', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(DELIVERABLE_TYPE_CONFIG) as [DeliverableType, { label: string; icon: string }][]).map(
                        ([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Platform</label>
                  <Select
                    value={deliverable.platform}
                    onValueChange={(v) => updateDeliverable(index, 'platform', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitch">Twitch</SelectItem>
                      <SelectItem value="kick">Kick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Due Date</label>
                  <Input
                    type="date"
                    value={deliverable.dueDate}
                    onChange={(e) => updateDeliverable(index, 'dueDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button type="submit" size="lg">
          Create Campaign
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
