'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerItem } from '@/lib/utils/animations';
import type { Transaction } from './types';
import { MOCK_TRANSACTIONS } from './mock-data';
import { REVENUE_SOURCE_CONFIG } from './types';

interface TransactionsTableProps {
  transactions?: Transaction[];
}

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

export function TransactionsTable({ transactions = MOCK_TRANSACTIONS }: TransactionsTableProps) {
  return (
    <MotionDiv variants={staggerItem}>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-text-tertiary">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const sourceConfig = REVENUE_SOURCE_CONFIG[txn.source];
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-border-subtle/50 hover:bg-background-elevated/30 transition-colors"
                    >
                      <td className="py-3 text-text-secondary">
                        {new Date(txn.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: sourceConfig?.color ?? '#6C5CE7' }}
                          />
                          <span className="font-medium text-text-primary">
                            {sourceConfig?.label ?? txn.source}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-text-secondary max-w-[200px] truncate">
                        {txn.description}
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-text-primary">
                        ${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={statusBadgeVariant[txn.status] ?? 'ghost'}>
                          {txn.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
