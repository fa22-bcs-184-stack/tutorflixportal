'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ChildSwitcher } from '@/components/parent/child-switcher';
import { FileText, Star, GraduationCap, RefreshCw } from 'lucide-react';
import { getParentReports, getParentDashboard, TutorReportItem, LinkedChildItem } from '@/lib/api/parent-api';

export default function ParentReportsPage() {
  const [reports, setReports] = useState<TutorReportItem[]>([]);
  const [childrenList, setChildrenList] = useState<LinkedChildItem[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashData, repData] = await Promise.all([
        getParentDashboard(),
        getParentReports(selectedChildId),
      ]);
      setChildrenList(dashData.linkedChildren || []);
      setReports(repData);
    } catch {
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedChildId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Progress Reports"
        subtitle="Review periodic tutor evaluation reports, progress notes, and learning recommendations for your children."
        breadcrumbs={[
          { label: 'Parent', href: '/parent' },
          { label: 'Reports' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Reports
          </Button>
        }
      />

      {/* Multi-Child Filter Switcher */}
      {childrenList.length > 0 && (
        <ChildSwitcher
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
        />
      )}

      <Panel title="Tutor Progress Evaluation Reports" description="Periodic progress reviews submitted by assigned tutors">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading tutor reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <FileText className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Tutor Reports Found</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{rep.studentName}</span>
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">
                        {rep.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Tutor: {rep.tutorName} · {rep.period}</p>
                  </div>

                  {/* Student Evaluation Rating Score (Tutor's rating of student's progress) */}
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-warning/10 border border-warning/30 text-warning shrink-0">
                    <Star className="size-4 fill-warning" />
                    <span className="font-bold text-sm text-foreground">{rep.ratingScore} / 5</span>
                    <span className="text-[10px] text-muted-foreground ml-1">Student Progress Rating</span>
                  </div>
                </div>

                {/* Progress Notes */}
                <div className="space-y-1">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider">Progress Evaluation Notes</span>
                  <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                    "{rep.progressNotes}"
                  </p>
                </div>

                {/* Tutor Recommendations */}
                <div className="space-y-1">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider">Tutor Recommendations</span>
                  <p className="text-foreground leading-relaxed bg-primary/5 p-3 rounded-lg border border-primary/20">
                    {rep.recommendations}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
