'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';

export default function StakeholderAttendanceReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Attendance Report"
        subtitle="Platform-wide attendance consistency percentage and session metrics."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Reports' },
          { label: 'Attendance' },
        ]}
      />

      <Panel title="Platform Attendance Progress" description="Overall attendance metrics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Overall Attendance Consistency</span>
            <p className="font-bold text-foreground text-2xl">96.2%</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Completed Classes</span>
            <p className="font-bold text-foreground text-2xl">142</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Cancelled Classes</span>
            <p className="font-bold text-foreground text-2xl">6</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
