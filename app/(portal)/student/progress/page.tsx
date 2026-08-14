'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckSquare, Clock, BookOpen, MessageSquare, ShieldCheck, RefreshCw, Award } from 'lucide-react';
import { getStudentProgress, StudentProgressData } from '@/lib/api/student-api';

export default function StudentProgressPage() {
  const [progress, setProgress] = useState<StudentProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const data = await getStudentProgress();
      setProgress(data);
    } catch {
      setProgress({
        overallAttendanceRate: 94,
        totalStudyHours: 16,
        completedSessionsCount: 14,
        subjectAttendance: [
          { subject: 'Mathematics HL', presentCount: 8, lateCount: 0, absentCount: 0, cancelledCount: 0 },
          { subject: 'Physics', presentCount: 4, lateCount: 1, absentCount: 0, cancelledCount: 0 },
          { subject: 'Chemistry', presentCount: 2, lateCount: 0, absentCount: 0, cancelledCount: 0 },
        ],
        tutorNotes: [
          {
            id: 'tn-1',
            tutorName: 'Dr. Alan Turing',
            subject: 'Mathematics HL',
            date: 'August 8, 2026',
            noteText: 'Aarav demonstrated excellent grasp of integration by parts. Recommend practicing timed problem solving under exam conditions.',
          },
          {
            id: 'tn-2',
            tutorName: 'Prof. Ada Lovelace',
            subject: 'Physics',
            date: 'August 4, 2026',
            noteText: 'Strong analytical problem-solving in vector kinematics. We will cover wave optics in the upcoming session.',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Learning Progress"
        subtitle="Track your session attendance rates, completed study hours, and qualitative tutor reports."
        breadcrumbs={[
          { label: 'Student', href: '/student' },
          { label: 'Progress' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchProgress} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Progress
          </Button>
        }
      />

      {/* Exclusions Notice Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-info/30 bg-info-subtle p-4 text-xs text-info">
        <ShieldCheck className="size-5 shrink-0 text-info" />
        <div>
          <strong>Attendance Focus:</strong> Progress tracking focuses exclusively on attendance consistency, study hours, and qualitative tutor notes. Numerical ratings and test scores are reserved for parent/admin portals.
        </div>
      </div>

      {/* Key Attendance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <CheckSquare className="size-3.5 text-success" /> Overall Attendance Rate
          </span>
          <p className="font-bold text-foreground text-2xl">{progress?.overallAttendanceRate || 94}%</p>
          <span className="text-[10px] text-muted-foreground">Session attendance consistency</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <Clock className="size-3.5 text-primary" /> Total Completed Study Hours
          </span>
          <p className="font-bold text-foreground text-2xl">{progress?.totalStudyHours || 16} hrs</p>
          <span className="text-[10px] text-muted-foreground">Across all subjects</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <BookOpen className="size-3.5 text-cta" /> Completed Sessions
          </span>
          <p className="font-bold text-foreground text-2xl">{progress?.completedSessionsCount || 14}</p>
          <span className="text-[10px] text-muted-foreground">Held class sessions</span>
        </div>
      </div>

      {/* Attendance History Table */}
      <Panel title="Attendance Breakdown by Subject" description="Present, late, absent, and cancelled session counts">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading breakdown...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Present Count</th>
                  <th className="p-3">Late Count</th>
                  <th className="p-3">Absent Count</th>
                  <th className="p-3">Cancelled Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {progress?.subjectAttendance.map((sa) => (
                  <tr key={sa.subject} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{sa.subject}</td>
                    <td className="p-3 font-semibold text-success">{sa.presentCount} sessions</td>
                    <td className="p-3 text-warning font-medium">{sa.lateCount} late</td>
                    <td className="p-3 text-danger font-medium">{sa.absentCount} absent</td>
                    <td className="p-3 text-muted-foreground">{sa.cancelledCount} cancelled</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Qualitative Tutor Feedback Cards (Star Ratings Excluded) */}
      <Panel title="Qualitative Tutor Progress Reports" description="Feedback notes from your tutors (numeric ratings excluded)">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading reports...
          </div>
        ) : progress?.tutorNotes.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No tutor progress notes available.</p>
        ) : (
          <div className="space-y-4 pt-2">
            {progress?.tutorNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <span className="font-bold text-foreground text-sm">{note.tutorName}</span>
                    <span className="text-[11px] text-muted-foreground ml-2">({note.subject})</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{note.date}</span>
                </div>
                <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                  "{note.noteText}"
                </p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
