'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ShieldCheck } from 'lucide-react';

export default function StakeholderTutorPerformanceReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Aggregate Tutor Performance Snapshots"
        subtitle="Locked monthly aggregate performance snapshots across platform tutors (raw per-student ratings hidden)."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Reports' },
          { label: 'Tutor Performance' },
        ]}
      />

      <div className="flex items-center gap-3 rounded-xl border border-info/30 bg-info-subtle p-4 text-xs text-info">
        <ShieldCheck className="size-5 shrink-0 text-info" />
        <div>
          <strong>Privacy Scope:</strong> Tutor performance reporting displays aggregate `TutorPerformanceSnapshot` metrics computed monthly at 01:00 UTC. Raw individual student/parent ratings stay exclusive to assigned Case Admins.
        </div>
      </div>

      <Panel title="Locked Monthly Tutor Performance Snapshots" description="Period: July 2026">
        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
            <div>
              <span className="font-bold text-foreground text-sm block">Dr. Alan Turing</span>
              <span className="text-muted-foreground">Subject: Mathematics HL</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-foreground">4.8 / 5.0 Rating</span>
              <span className="text-success font-bold">98% On-Time</span>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                <Download className="size-3.5" /> CSV
              </Button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
            <div>
              <span className="font-bold text-foreground text-sm block">Prof. Ada Lovelace</span>
              <span className="text-muted-foreground">Subject: Physics</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-foreground">4.6 / 5.0 Rating</span>
              <span className="text-success font-bold">95% On-Time</span>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                <Download className="size-3.5" /> CSV
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
