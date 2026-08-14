'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { CreateSalesMemberModal } from '@/components/hod/create-sales-member-modal';
import {
  Users,
  UserCheck,
  TrendingUp,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  UserPlus,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import {
  getHodDashboard,
  getAdminActivityFeed,
  getSchedulerActivityFeed,
  HodDashboardData,
  ActivityFeedItem,
} from '@/lib/api/hod-api';

export default function HodDashboardPage() {
  const [data, setData] = useState<HodDashboardData | null>(null);
  const [adminActivity, setAdminActivity] = useState<ActivityFeedItem[]>([]);
  const [schedulerActivity, setSchedulerActivity] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [createSalesModalOpen, setCreateSalesModalOpen] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashData, admFeed, schFeed] = await Promise.all([
        getHodDashboard(),
        getAdminActivityFeed(),
        getSchedulerActivityFeed(),
      ]);
      setData(dashData);
      setAdminActivity(admFeed);
      setSchedulerActivity(schFeed);
    } catch {
      setData({
        totalPipelineLeads: 42,
        activeSalesMembersCount: 5,
        leadConversionRate: 68,
        activeSchedulersCount: 4,
        pendingModerationReviewsCount: 2,
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
        title="HOD Executive Oversight"
        subtitle="Departmental oversight across lead conversion pipelines, sales member CRUD, and admin/scheduler activity feeds."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Overview' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateSalesModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <UserPlus className="size-4" /> Create Sales Member
          </Button>
        }
      />

      {/* Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pipeline Leads"
          value={String(data?.totalPipelineLeads || 42)}
          icon={Briefcase}
          accent="chart-1"
          hint="Across all Intro Schedulers"
        />

        <StatCard
          label="Active Sales Members"
          value={String(data?.activeSalesMembersCount || 5)}
          icon={Users}
          accent="chart-2"
          hint="Off-platform call managers"
        />

        <StatCard
          label="Lead Conversion Rate"
          value={`${data?.leadConversionRate || 68}%`}
          icon={TrendingUp}
          accent="chart-3"
          hint="Trial-to-Student ratio"
        />

        <StatCard
          label="Pending Moderation Flags"
          value={String(data?.pendingModerationReviewsCount || 2)}
          icon={ShieldAlert}
          accent="chart-4"
          hint="Message safety reviews"
        />
      </div>

      {/* Operational Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/hod/leads">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4 text-primary" /> Lead Pipeline Oversight
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Read-only pipeline view across every Intro Scheduler's leads.
            </p>
          </div>
        </Link>

        <Link href="/hod/sales-members">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" /> Manage Sales Members
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Full CRUD: create, edit, activate/deactivate Sales Members.
            </p>
          </div>
        </Link>

        <Link href="/hod/reports">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-4 text-primary" /> Lead Conversion Report
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              HOD & Stakeholder exclusive lead conversion metrics report.
            </p>
          </div>
        </Link>
      </div>

      {/* Dual Activity Summary Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Activity Feed */}
        <Panel title="Recent Admin Caseworker Activity" description="Payment approvals, tutor assignments, and class scheduling">
          <div className="space-y-3 pt-2">
            {adminActivity.map((act) => (
              <div key={act.id} className="p-3 rounded-xl border border-border bg-card flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{act.actorName}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">{act.action}</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{act.details}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Scheduler Activity Feed */}
        <Panel title="Recent Intro Scheduler Activity" description="Call logging, trial scheduling, and lead conversions">
          <div className="space-y-3 pt-2">
            {schedulerActivity.map((act) => (
              <div key={act.id} className="p-3 rounded-xl border border-border bg-card flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{act.actorName}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">{act.action}</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{act.details}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Create Sales Member Modal */}
      <CreateSalesMemberModal
        open={createSalesModalOpen}
        onOpenChange={setCreateSalesModalOpen}
        onSuccess={loadDashboard}
      />
    </div>
  );
}
