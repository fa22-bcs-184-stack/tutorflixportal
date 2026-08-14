'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { TopUpHoursModal } from '@/components/student/topup-hours-modal';
import {
  Video,
  Clock,
  BookOpen,
  Calendar,
  ShoppingBag,
  ArrowRight,
  GraduationCap,
  Sparkles,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { getStudentDashboard, getStudentResources, StudentDashboardStats, StudentResourceItem } from '@/lib/api/student-api';

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardStats | null>(null);
  const [resources, setResources] = useState<StudentResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Top-Up Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashData, resData] = await Promise.all([
        getStudentDashboard(),
        getStudentResources(),
      ]);
      setData(dashData);
      setResources(resData);
    } catch {
      setData({
        studentName: 'Aarav Sharma',
        grade: 'Grade 10',
        curriculum: 'IB Diploma Programme',
        remainingHours: 14,
        totalHoursPurchased: 20,
        assignedTutorName: 'Dr. Alan Turing',
        assignedTutorSubject: 'Mathematics HL',
        liveClass: {
          id: 'sess-live-01',
          title: 'Weekly IB Math HL Calculus Prep',
          subject: 'Mathematics HL',
          tutorName: 'Dr. Alan Turing',
          scheduledAt: new Date(Date.now() + 1800000).toISOString(),
          zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
        },
        subjectBreakdown: [
          { subject: 'Mathematics HL', classesCount: 8, hoursCount: 8 },
          { subject: 'Physics', classesCount: 4, hoursCount: 6 },
          { subject: 'Chemistry', classesCount: 2, hoursCount: 2 },
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
        title={`Welcome back, ${data?.studentName || 'Student'}!`}
        subtitle={`${data?.grade || 'High School'} · ${data?.curriculum || 'Standard'}`}
        action={
          <Button
            size="sm"
            onClick={() => setTopUpModalOpen(true)}
            className="bg-cta text-cta-foreground hover:bg-cta-hover text-xs gap-1.5 font-semibold"
          >
            <ShoppingBag className="size-4" /> Top Up Hours
          </Button>
        }
      />

      {/* Live Class Hero Card */}
      {data?.liveClass && (
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-background p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="live-dot size-[6px]" />
              <Badge className="bg-primary text-primary-foreground text-[10px]">Upcoming Session</Badge>
              <span className="text-xs text-muted-foreground font-medium">Starts in 30 mins</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">{data.liveClass.title}</h3>
            <p className="text-xs text-muted-foreground">
              Tutor: <strong className="text-foreground">{data.liveClass.tutorName}</strong> ({data.liveClass.subject})
            </p>
          </div>

          <a href={data.liveClass.zoomUrl} target="_blank" rel="noreferrer">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-xs gap-2 shrink-0 shadow-lg">
              <Video className="size-4" /> Join Session Now
            </Button>
          </a>
        </div>
      )}

      {/* Remaining Hours & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Remaining Hours</span>
            <p className="font-bold text-foreground text-2xl">{data?.remainingHours || 14} <span className="text-xs font-normal text-muted-foreground">/ {data?.totalHoursPurchased || 20} hrs</span></p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setTopUpModalOpen(true)} className="text-xs border-cta/40 text-cta hover:bg-cta/10">
            Top Up
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Assigned Tutor</span>
          <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
            <GraduationCap className="size-4 text-primary" /> {data?.assignedTutorName}
          </p>
          <span className="text-[10px] text-muted-foreground">{data?.assignedTutorSubject}</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Classes Taken</span>
          <p className="font-bold text-foreground text-2xl">
            {data?.subjectBreakdown.reduce((acc, curr) => acc + curr.classesCount, 0) || 14}
          </p>
          <span className="text-[10px] text-muted-foreground">Completed sessions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown by Class Count (No Scores / Grades) */}
        <Panel title="Subject Breakdown by Class Count" description="Number of sessions completed per subject">
          <div className="space-y-3 pt-2">
            {data?.subjectBreakdown.map((sb) => (
              <div key={sb.subject} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground text-sm block">{sb.subject}</span>
                  <span className="text-muted-foreground">{sb.hoursCount} hours total</span>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-bold">
                  {sb.classesCount} Classes Taken
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        {/* Latest Student-Scoped Resources Preview */}
        <Panel title="Latest Learning Materials" description="Resources uploaded specifically for you by your tutor">
          <div className="space-y-3 pt-2">
            {resources.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center">No study materials uploaded yet.</p>
            ) : (
              resources.slice(0, 3).map((res) => (
                <div key={res.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block">{res.title}</span>
                      <span className="text-[10px] text-muted-foreground">{res.subject} · By {res.tutorName}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px]">{res.fileType}</Badge>
                </div>
              ))
            )}

            <Link href="/student/resources" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                View All Learning Resources <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </Panel>
      </div>

      {/* Top-Up Hours Modal */}
      <TopUpHoursModal
        open={topUpModalOpen}
        onOpenChange={setTopUpModalOpen}
        currentRemainingHours={data?.remainingHours || 14}
        onSuccess={loadDashboard}
      />
    </div>
  );
}
