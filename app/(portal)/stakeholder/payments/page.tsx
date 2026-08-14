'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { CreditCard } from 'lucide-react';
import { getStakeholderPayments, StakeholderPaymentItem } from '@/lib/api/stakeholder-api';

export default function StakeholderPaymentsPage() {
  const [payments, setPayments] = useState<StakeholderPaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getStakeholderPayments();
        setPayments(data);
      } catch {
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Read-Only Payments & Financial Ledger"
        subtitle="Platform-wide payment transaction history and verification statuses (read-only)."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Payments' },
        ]}
      />

      <Panel title="Platform Financial Ledger" description="Verified and pending package purchase payments">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading financial ledger...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Package / Hours</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-foreground">{p.id}</td>
                    <td className="p-3 font-bold text-foreground">{p.studentName}</td>
                    <td className="p-3 text-muted-foreground">{p.packageName}</td>
                    <td className="p-3 font-medium text-foreground">{p.paymentMethod}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          p.status === 'APPROVED'
                            ? 'bg-success-subtle text-success border-success/30'
                            : p.status === 'REJECTED'
                            ? 'bg-danger-subtle text-danger border-danger/30'
                            : 'bg-warning-subtle text-warning border-warning/30'
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3 font-bold text-foreground text-right text-sm">${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
