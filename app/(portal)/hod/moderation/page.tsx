'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { ShieldAlert } from 'lucide-react';

export default function HodModerationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Moderation Review Queue"
        subtitle="Departmental oversight of message safety flags and caseworker review outcomes."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Moderation Queue' },
        ]}
      />

      <Panel title="Message Moderation Safety Flags" description="Flagged messages awaiting or reviewed by caseworkers">
        <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
          <ShieldAlert className="size-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="font-semibold text-foreground text-sm">Moderation Queue Oversight</p>
          <p className="text-[11px] text-muted-foreground mt-1">Synchronous moderation flags (hard-block phone/email vs soft-flag URL/profanity).</p>
        </div>
      </Panel>
    </div>
  );
}
