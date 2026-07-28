'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { formatCurrency } from '@/lib/stripe/helpers';
import type { BillingHistoryItem } from './types';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_VARIANTS } from './types';

interface BillingHistoryProps {
  invoices: BillingHistoryItem[];
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No billing history"
        description="Your invoices and payment history will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-subtle bg-background-surface">
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
              Description
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-text-secondary">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
              Amount
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, i) => (
            <motion.tr
              key={invoice.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
              className="border-b border-border-subtle hover:bg-background-surface/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-text-secondary tabular-nums">
                {new Date(invoice.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3 text-sm text-text-primary">
                {invoice.description}
              </td>
              <td className="hidden sm:table-cell px-4 py-3">
                <Badge
                  variant={INVOICE_STATUS_VARIANTS[invoice.status]}
                  className="text-2xs"
                >
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-text-primary tabular-nums">
                {formatCurrency(invoice.amount, invoice.currency)}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={invoice.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
