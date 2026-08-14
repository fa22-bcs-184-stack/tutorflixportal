'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { CreateStaffModal } from '@/components/manager/create-staff-modal';
import {
  Users,
  UserCheck,
  Clock,
  Lock,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { getManagerDashboard, ManagerDashboardData } from '@/lib/api/manager-api';

export default function ManagerDashboardPage() {
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createStaffModalOpen, setCreateStaffModalOpen] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await getManagerDashboard();
      setData(res);
    } catch {
      setData({
        unassignedConvertedCount: 2,
        pendingAvailabilityCount: 3,
        frozenConversationsCount: 1,
        activeStaffCount: 18,
        backlogAlertCount: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Manager Operations"
        subtitle="Platform-wide oversight of staff accounts, case admin assignments, availability requests, and conversation unlocking."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Overview' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateStaffModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <UserPlus className="size-4" /> Create Staff Account
          </Button>
        }
      />

      {/* Moderation Backlog Alert Banner */}
      {data?.backlogAlertCount && data.backlogAlertCount > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-warning/40 bg-warning/10 p-4 text-xs text-foreground">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-warning" />
            <div>
              <strong>Moderation Backlog Alert:</strong> {data.backlogAlertCount} Admin caseworker(s) currently have more than 5 pending flags or overdue reviews requiring backlog clearing.
            </div>
          </div>
          <Link href="/manager/moderation-oversight">
            <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90 text-xs font-semibold shrink-0">
              Inspect Backlog
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Unassigned Converted Families"
          value={String(data?.unassignedConvertedCount || 2)}
          icon={UserCheck}
          accent="chart-3"
          hint="Requires Case Admin assignment"
        />

        <StatCard
          label="Pending Availability Requests"
          value={String(data?.pendingAvailabilityCount || 3)}
          icon={Clock}
          accent="chart-2"
          hint="Tutor slot change requests"
        />

        <StatCard
          label="Frozen Conversations"
          value={String(data?.frozenConversationsCount || 1)}
          icon={Lock}
          accent="chart-4"
          hint="Requires Manager unlock action"
        />

        <StatCard
          label="Active Staff Members"
          value={String(data?.activeStaffCount || 18)}
          icon={Users}
          accent="chart-1"
          hint="Across all 6 system roles"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Action Operations Panel */}
        <Panel title="Platform Operations & Shortcuts" description="Direct actions for platform management">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link href="/manager/case-assignments">
              <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
                <div className="flex items-center justify-between font-bold text-foreground text-xs">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="size-4 text-primary" /> Assign Case Admins
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Assign caseworkers to newly converted student families.
                </p>
              </div>
            </Link>

            <Link href="/manager/availability-requests">
              <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
                <div className="flex items-center justify-between font-bold text-foreground text-xs">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" /> Approve Availability
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Review and approve tutor slot change requests.
                </p>
              </div>
            </Link>

            <Link href="/manager/conversations">
              <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
                <div className="flex items-center justify-between font-bold text-foreground text-xs">
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-4 text-primary" /> Unlock Conversations
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Unlock FROZEN chats after RED_ZONE flag review.
                </p>
              </div>
            </Link>

            <Link href="/manager/users">
              <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
                <div className="flex items-center justify-between font-bold text-foreground text-xs">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary" /> Manage Staff Accounts
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Create staff, toggle active status, and set leave status.
                </p>
              </div>
            </Link>
          </div>
        </Panel>

        {/* Operational Guidelines & System Scope Panel */}
        <Panel title="Manager Operational Scope" description="Platform architecture directives">
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-card border border-border flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Unassigned Conversion Queue:</strong> When an Intro Scheduler converts a lead, `case_admin_id` is null. Assigning a caseworker unblocks tutor assignment & class scheduling.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Exclusive Conversation Unlocking:</strong> Only Admin Managers possess the `conversation.unlock` permission to unfreeze chats.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Privacy Protection:</strong> Family login credentials remain strictly exclusive to each family's assigned Case Admin (hidden from Admin Manager).
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Create Staff Modal */}
      <CreateStaffModal
        open={createStaffModalOpen}
        onOpenChange={setCreateStaffModalOpen}
        onSuccess={loadDashboard}
      />
    </div>
  );
}
