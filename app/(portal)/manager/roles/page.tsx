'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock } from 'lucide-react';

const RBAC_ROLES = [
  {
    role: 'ADMIN',
    name: 'Admin (Caseworker)',
    description: 'Caseload-scoped operations: family profile management, tutor assignments, class scheduling, renewal payment approvals, and moderation reviews.',
    permissions: ['student.read.caseload', 'student.credentials.view', 'payment.verify', 'scheduling.manage', 'chat.monitor', 'moderation.review'],
  },
  {
    role: 'TUTOR',
    name: 'Tutor',
    description: 'Assigned student instruction: weekly calendar, trial feedback submission, resource uploads, availability change requests, and earnings tracking.',
    permissions: ['class.attend', 'tutor.availability.request', 'resource.upload', 'trial.feedback'],
  },
  {
    role: 'SCHEDULER',
    name: 'Intro Scheduler',
    description: 'Lead pipeline management: trial booking, trial scheduling with Teams link, sales member call logs, and single-step lead conversion (`lead.status.convert`).',
    permissions: ['lead.read.assigned', 'lead.status.convert', 'trial.schedule'],
  },
  {
    role: 'HOD',
    name: 'Head of Department (HOD)',
    description: 'Departmental oversight: full lead pipeline visibility, Sales Member CRUD, all-schedulers activity logs, and Lead Conversion reports.',
    permissions: ['lead.read.all', 'sales_member.manage', 'report.view.lead_conversion'],
  },
  {
    role: 'STAKEHOLDER',
    name: 'Stakeholder',
    description: 'Executive oversight: read-only access to platform-wide summaries and exclusive Revenue report access.',
    permissions: ['report.view.revenue', 'report.view.tutor_performance'],
  },
  {
    role: 'MANAGER',
    name: 'Admin Manager',
    description: 'Platform operation leader: staff account management, case-admin assignments, availability approvals, conversation unlocking, and full audit logging.',
    permissions: ['user.manage', 'case_admin.assign', 'conversation.unlock', 'audit.view.all'],
  },
];

export default function ManagerRolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions (RBAC Matrix)"
        subtitle="Fixed, migration-seeded system roles and permission sets (view only, no runtime mutation allowed)."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Roles & Permissions' },
        ]}
      />

      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Fixed Security Hierarchy:</strong> System roles and permissions are deterministically seeded in database migrations per foundation architecture. Edit UI is disabled by design.
        </div>
      </div>

      <Panel title="Role Permission Matrix" description="System role definitions and capabilities">
        <div className="space-y-4 pt-2">
          {RBAC_ROLES.map((r) => (
            <div key={r.role} className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{r.name}</span>
                  <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary">
                    {r.role}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-[9px] bg-muted/50 text-muted-foreground">
                  Migration Seeded
                </Badge>
              </div>

              <p className="text-muted-foreground text-xs">{r.description}</p>

              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider">Key Granted Permissions</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {r.permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-md bg-muted/40 border border-border font-mono text-[10px] text-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
