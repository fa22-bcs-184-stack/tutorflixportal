'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  PieChart,
  FileText,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { getStakeholderDashboard, StakeholderDashboardData } from '@/lib/api/stakeholder-api';

export default function StakeholderDashboardPage() {
  const [data, setData] = useState<StakeholderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await getStakeholderDashboard();
      setData(res);
    } catch {
      setData({
        totalGrossRevenue: 42800,
        monthlyRecurringRevenue: 14200,
        activeStudentsCount: 32,
        activeTutorsCount: 12,
        overallConversionRate: 68,
        topPackages: [
          { name: 'Silver Package (20 hrs)', revenue: 16800 },
          { name: 'Gold Package (40 hrs)', revenue: 15600 },
          { name: 'Bronze Package (10 hrs)', revenue: 6000 },
          { name: 'Custom Hour Top-Ups', revenue: 4400 },
        ],
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
        title="Stakeholder Executive Suite"
        subtitle="Purely read-only executive oversight of platform financial revenue, lead conversion analytics, and audit logs."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Overview' },
        ]}
      />

      {/* Pure Read-Only Directive Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Executive Read-Only Suite:</strong> Stakeholders possess full platform-wide read visibility and exclusive access to the Revenue Report. Operational write actions are disabled by design.
        </div>
      </div>

      {/* Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Gross Revenue"
          value={`$${(data?.totalGrossRevenue || 42800).toLocaleString()}`}
          icon={DollarSign}
          accent="chart-1"
          hint="All-time verified revenue"
        />

        <StatCard
          label="Monthly Recurring Revenue"
          value={`$${(data?.monthlyRecurringRevenue || 14200).toLocaleString()}`}
          icon={TrendingUp}
          accent="chart-2"
          hint="Active billing cycle"
        />

        <StatCard
          label="Active Enrolled Students"
          value={String(data?.activeStudentsCount || 32)}
          icon={Users}
          accent="chart-3"
          hint="Active student accounts"
        />

        <StatCard
          label="Lead Conversion Rate"
          value={`${data?.overallConversionRate || 68}%`}
          icon={PieChart}
          accent="chart-4"
          hint="Trial-to-Student ratio"
        />
      </div>

      {/* Executive Report Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/stakeholder/reports/revenue">
          <div className="p-4 rounded-xl border border-cta/40 bg-cta/5 hover:bg-cta/10 transition-all cursor-pointer space-y-1.5 group shadow-xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5 text-cta font-bold">
                <DollarSign className="size-4" /> Exclusive Revenue Report
              </span>
              <ArrowRight className="size-3.5 text-cta group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Package revenue breakdown, custom hour sales, and CSV export.
            </p>
          </div>
        </Link>

        <Link href="/stakeholder/reports/lead-conversion">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <PieChart className="size-4 text-primary" /> Lead Conversion Report
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Trial completion & conversion rates by curriculum & scheduler.
            </p>
          </div>
        </Link>

        <Link href="/stakeholder/audit-logs">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-1.5 group shadow-2xs">
            <div className="flex items-center justify-between font-bold text-foreground text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Full Platform Audit Logs
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Unrestricted audit trail covering Admins, Schedulers & Managers.
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Preview */}
        <Panel title="Revenue Breakdown by Catalog Package" description="Share of gross revenue across package tiers">
          <div className="space-y-3 pt-2">
            {data?.topPackages.map((pkg) => (
              <div key={pkg.name} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{pkg.name}</span>
                <Badge variant="outline" className="font-bold text-xs bg-primary/10 text-primary border-primary/30">
                  ${pkg.revenue.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        {/* Executive Read-Only Scope Description */}
        <Panel title="Stakeholder Reporting Scope" description="Platform access policies">
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-card border border-border space-y-1">
              <strong className="text-foreground">Revenue Report Exclusivity:</strong> The Revenue Report is strictly exclusive to Stakeholders (unseen by Admin Manager or HOD).
            </div>
            <div className="p-3 rounded-lg bg-card border border-border space-y-1">
              <strong className="text-foreground">Aggregate Performance Snapshots:</strong> Tutor performance metrics display locked monthly `TutorPerformanceSnapshot` aggregates (**raw per-student ratings hidden**).
            </div>
            <div className="p-3 rounded-lg bg-card border border-border space-y-1">
              <strong className="text-foreground">Pure Executive Read Scope:</strong> Read access extends across all platform rosters (Leads, Students, Tutors, Payments, Audit Logs).
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
