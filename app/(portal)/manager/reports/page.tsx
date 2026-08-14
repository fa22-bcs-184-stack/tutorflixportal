'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, ShieldCheck, Star, Users, CheckCircle2 } from 'lucide-react';

export default function ManagerReportsPage() {
  const [activeTab, setActiveTab] = useState('tutor-snapshots');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aggregate System Reports"
        subtitle="Platform-wide aggregate tutor performance snapshots and attendance reports."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Reports' },
        ]}
      />

      {/* Scope Guard Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-info/30 bg-info-subtle p-4 text-xs text-info">
        <ShieldCheck className="size-5 shrink-0 text-info" />
        <div>
          <strong>Report Scope & Privacy Directive:</strong> Shows locked monthly aggregate snapshots (`TutorPerformanceSnapshot`) and attendance progress. Raw per-student `TutorRating`s remain exclusive to each student's Case Admin. Revenue (Stakeholder) and Lead Conversion (HOD/Stakeholder) reports are excluded.
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border p-1 rounded-xl">
          <TabsTrigger value="tutor-snapshots" className="text-xs font-semibold px-4 py-1.5">
            Tutor Performance Snapshots
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-semibold px-4 py-1.5">
            Student Attendance Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutor-snapshots">
          <Panel title="Locked Monthly Tutor Performance Snapshots" description="Aggregate performance metrics computed monthly at 01:00 UTC">
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">Dr. Alan Turing</span>
                    <Badge variant="outline" className="text-[10px]">Mathematics</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Snapshot Period: July 2026</div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-bold text-foreground block">4.8 / 5.0</span>
                    <span className="text-[10px] text-muted-foreground">Aggregate Rating</span>
                  </div>
                  <div>
                    <span className="font-bold text-success block">98%</span>
                    <span className="text-[10px] text-muted-foreground">On-Time Attendance</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                    <Download className="size-3.5" /> CSV
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">Prof. Ada Lovelace</span>
                    <Badge variant="outline" className="text-[10px]">Physics</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Snapshot Period: July 2026</div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-bold text-foreground block">4.6 / 5.0</span>
                    <span className="text-[10px] text-muted-foreground">Aggregate Rating</span>
                  </div>
                  <div>
                    <span className="font-bold text-success block">95%</span>
                    <span className="text-[10px] text-muted-foreground">On-Time Attendance</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                    <Download className="size-3.5" /> CSV
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="attendance">
          <Panel title="Platform Student Attendance Progress" description="Overall attendance consistency breakdown">
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Overall Attendance Rate</span>
                  <p className="font-bold text-foreground text-2xl">96.2%</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Classes Held</span>
                  <p className="font-bold text-foreground text-2xl">142</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Student Cancelled Sessions</span>
                  <p className="font-bold text-foreground text-2xl">6</p>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
