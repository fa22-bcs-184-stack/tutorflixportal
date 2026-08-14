'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ChildSwitcher } from '@/components/parent/child-switcher';
import { TopUpHoursModal } from '@/components/student/topup-hours-modal';
import { RateTutorModal } from '@/components/parent/rate-tutor-modal';
import {
  Users,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  ArrowRight,
  ShoppingBag,
  Star,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { getParentDashboard, getParentClasses, ParentDashboardData, ParentClassSession } from '@/lib/api/parent-api';

export default function ParentDashboardPage() {
  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [classes, setClasses] = useState<ParentClassSession[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [rateTutorModalOpen, setRateTutorModalOpen] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashData, clsData] = await Promise.all([
        getParentDashboard(),
        getParentClasses(selectedChildId),
      ]);
      setData(dashData);
      setClasses(clsData);
    } catch {
      setData({
        parentName: 'Priya Sharma',
        linkedChildren: [
          {
            id: 'st-01',
            studentName: 'Aarav Sharma',
            grade: 'Grade 10',
            curriculum: 'IB Diploma Programme',
            assignedTutorName: 'Dr. Alan Turing',
            assignedTutorSubject: 'Mathematics HL',
            caseAdminId: 'usr-demo-01',
            remainingHours: 14,
            totalHoursPurchased: 20,
          },
          {
            id: 'st-02',
            studentName: 'Maya Sharma',
            grade: 'Grade 8',
            curriculum: 'IGCSE',
            assignedTutorName: 'Prof. Ada Lovelace',
            assignedTutorSubject: 'Physics',
            caseAdminId: 'usr-demo-01',
            remainingHours: 8,
            totalHoursPurchased: 10,
          },
        ],
        reportsSubmittedThisMonthCount: 3,
        totalReportsExpectedThisMonthCount: 4,
        nextClass: {
          id: 'sess-live-01',
          studentId: 'st-01',
          studentName: 'Aarav Sharma',
          title: 'Weekly IB Math HL Calculus Prep',
          subject: 'Mathematics HL',
          tutorName: 'Dr. Alan Turing',
          scheduledAt: new Date(Date.now() + 3600000).toISOString(),
          zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
        },
        paymentsSummary: {
          totalSpent: 1200,
          pendingCount: 1,
          dueAmount: 0,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedChildId]);

  const activeChildren =
    selectedChildId === 'ALL'
      ? data?.linkedChildren || []
      : data?.linkedChildren.filter((c) => c.id === selectedChildId) || [];

  const totalRemainingHours = activeChildren.reduce((acc, c) => acc + c.remainingHours, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${data?.parentName || 'Parent'}!`}
        subtitle="Monitor your children's learning schedules, tutor reports, payments, and progress."
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRateTutorModalOpen(true)}
              className="text-xs border-warning/40 text-warning hover:bg-warning/10 font-semibold gap-1.5"
            >
              <Star className="size-3.5 fill-warning" /> Rate Tutor
            </Button>
            <Button
              size="sm"
              onClick={() => setTopUpModalOpen(true)}
              className="bg-cta text-cta-foreground hover:bg-cta-hover text-xs gap-1.5 font-semibold"
            >
              <ShoppingBag className="size-4" /> Top Up Hours
            </Button>
          </div>
        }
      />

      {/* Multi-Child Switcher Selector */}
      {data?.linkedChildren && data.linkedChildren.length > 0 && (
        <ChildSwitcher
          childrenList={data.linkedChildren}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
        />
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Tutor Reports Submitted"
          value={`${data?.reportsSubmittedThisMonthCount || 3} of ${data?.totalReportsExpectedThisMonthCount || 4}`}
          icon={FileText}
          accent="chart-1"
          hint="Reports submitted this month"
        />

        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Remaining Hours</span>
            <p className="font-bold text-foreground text-2xl">
              {totalRemainingHours} <span className="text-xs font-normal text-muted-foreground">hrs</span>
            </p>
            <span className="text-[10px] text-muted-foreground">Across {activeChildren.length} child(ren)</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setTopUpModalOpen(true)} className="text-xs border-cta/40 text-cta hover:bg-cta/10">
            Top Up
          </Button>
        </div>

        <StatCard
          label="Pending Renewal Payments"
          value={String(data?.paymentsSummary.pendingCount || 1)}
          icon={CreditCard}
          accent="chart-3"
          hint="Receipt verification pending"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Class Details Card */}
        <Panel title="Upcoming Class Session" description="Earliest scheduled class">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
              <Spinner className="mr-2" /> Loading class details...
            </div>
          ) : data?.nextClass ? (
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{data.nextClass.title}</span>
                  <Badge variant="outline" className="text-[10px] bg-primary text-primary-foreground">
                    {data.nextClass.studentName}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tutor: <strong className="text-foreground">{data.nextClass.tutorName}</strong> ({data.nextClass.subject})
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    {new Date(data.nextClass.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  <Link href="/parent/classes">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      View Full Calendar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
              No upcoming classes scheduled.
            </div>
          )}
        </Panel>

        {/* Linked Children Caseload Card */}
        <Panel title="Linked Children Overview" description="Active student accounts in household">
          <div className="space-y-2.5 pt-2">
            {activeChildren.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-foreground">{c.studentName}</div>
                  <div className="text-muted-foreground">{c.grade} · {c.curriculum}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <GraduationCap className="size-3 text-primary" /> Tutor: {c.assignedTutorName} ({c.assignedTutorSubject})
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground block text-sm">{c.remainingHours} hrs left</span>
                  <span className="text-[10px] text-muted-foreground">of {c.totalHoursPurchased} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Top Up Hours Modal */}
      <TopUpHoursModal
        open={topUpModalOpen}
        onOpenChange={setTopUpModalOpen}
        currentRemainingHours={totalRemainingHours}
        onSuccess={loadDashboard}
      />

      {/* Rate Tutor Modal */}
      <RateTutorModal
        open={rateTutorModalOpen}
        onOpenChange={setRateTutorModalOpen}
        childrenList={data?.linkedChildren || []}
        onSuccess={loadDashboard}
      />
    </div>
  );
}
