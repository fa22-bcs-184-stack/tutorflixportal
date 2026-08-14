'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { ShieldCheck } from 'lucide-react';

export default function HodAuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Departmental Audit Logs"
        subtitle="Audit trail tracking staff actions across leads, sales members, scheduling, and caseworkers."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Audit Logs' },
        ]}
      />

      <Panel title="System Event Audit Log" description="Departmental event logs">
        <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
          <ShieldCheck className="size-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="font-semibold text-foreground text-sm">Departmental Audit Trail</p>
          <p className="text-[11px] text-muted-foreground mt-1">Audit log records for lead operations, sales member management, and caseworker events.</p>
        </div>
      </Panel>
    </div>
  );
}
