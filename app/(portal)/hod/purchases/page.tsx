'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { CreditCard } from 'lucide-react';

export default function HodPurchasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases & Audit Ledgers"
        subtitle="Departmental oversight of student purchases and stored remaining hour ledgers."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Purchases' },
        ]}
      />

      <Panel title="Student Purchase Audit Ledgers" description="Stored remaining hours and transaction ledgers">
        <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
          <CreditCard className="size-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="font-semibold text-foreground text-sm">Purchase Ledgers Oversight</p>
          <p className="text-[11px] text-muted-foreground mt-1">Audit ledgers for package top-ups and hour deductions.</p>
        </div>
      </Panel>
    </div>
  );
}
