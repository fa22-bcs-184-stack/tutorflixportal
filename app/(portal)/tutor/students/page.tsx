'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  Clock,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { getAssignedStudents, TutorStudentItem } from '@/lib/api/tutor-api';

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<TutorStudentItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState<TutorStudentItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getAssignedStudents();
      setStudents(data);
    } catch {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      !search ||
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenProfile = (student: TutorStudentItem) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Students"
        subtitle="View your assigned student roster, remaining hours counters, curriculum, and next class schedules."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Students' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchStudents} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Roster
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assigned student or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>
      </div>

      <Panel title="Assigned Students Roster" description="Active students assigned to your teaching load">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading student roster...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Users className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Assigned Students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student & Parent</th>
                  <th className="p-3">Subject & Curriculum</th>
                  <th className="p-3">Remaining Hours</th>
                  <th className="p-3">Next Scheduled Class</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((s) => {
                  const isHoursLow = s.remainingHours <= 2;

                  return (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-foreground">{s.studentName}</div>
                        <div className="text-[11px] text-muted-foreground">{s.parentName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">{s.subject}</div>
                        <div className="text-[10px] text-muted-foreground">{s.curriculum || 'Standard'} ({s.grade || 'High School'})</div>
                      </td>
                      <td className="p-3 font-semibold">
                        <span className={isHoursLow ? 'text-danger font-bold flex items-center gap-1' : 'text-foreground'}>
                          {isHoursLow && <AlertTriangle className="size-3.5" />}
                          {s.remainingHours} hrs left
                        </span>
                        <span className="text-[10px] text-muted-foreground block">of {s.totalHoursPurchased} hrs</span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {s.nextClassTime ? new Date(s.nextClassTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'None scheduled'}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            s.status === 'ACTIVE'
                              ? 'bg-success-subtle text-success border-success/30'
                              : 'bg-danger-subtle text-danger border-danger/30'
                          }`}
                        >
                          {s.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenProfile(s)}
                          className="text-xs h-8"
                        >
                          View Student Profile
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Student Profile & Remaining Hours Warning Modal */}
      {selectedStudent && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                {selectedStudent.studentName} — Profile & Hours Counter
              </DialogTitle>
              <DialogDescription>Parent: {selectedStudent.parentName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Remaining Hours Depletion Warning */}
              {selectedStudent.remainingHours <= 2 && (
                <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-subtle p-3 text-xs text-danger">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Low Hours Warning:</strong> Student has only <strong className="font-bold">{selectedStudent.remainingHours} hour(s)</strong> remaining. Inform caseworker/parent before holding next class.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-card border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Subject</span>
                  <p className="font-bold text-foreground text-sm">{selectedStudent.subject}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Curriculum / Grade</span>
                  <p className="font-bold text-foreground text-sm">{selectedStudent.curriculum || 'Standard'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Remaining Hours</span>
                  <p className="font-bold text-foreground text-sm">{selectedStudent.remainingHours} / {selectedStudent.totalHoursPurchased} hrs</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Account Status</span>
                  <p className="font-bold text-foreground text-sm">{selectedStudent.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
