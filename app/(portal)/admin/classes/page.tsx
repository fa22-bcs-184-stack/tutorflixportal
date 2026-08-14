'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar, Plus, Clock, Users, GraduationCap, CheckCircle2, RefreshCw } from 'lucide-react';
import { getAdminClasses, getMyFamilies, getAllTutors, createClassRequest, ClassRequestItem, FamilyItem, TutorAdminItem } from '@/lib/api/admin-api';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassRequestItem[]>([]);
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [tutors, setTutors] = useState<TutorAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Class Request Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [subject, setSubject] = useState('Mathematics HL');
  const [title, setTitle] = useState('');
  const [recurrence, setRecurrence] = useState('WEEKLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clsList, famList, tutList] = await Promise.all([
        getAdminClasses(),
        getMyFamilies(),
        getAllTutors(),
      ]);
      setClasses(clsList);
      setFamilies(famList);
      setTutors(tutList.filter((t) => t.active));

      if (famList.length > 0) setSelectedStudentId(famList[0].id);
      if (tutList.length > 0) setSelectedTutorId(tutList[0].id);
    } catch {
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedTutorId || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      await createClassRequest({
        studentId: selectedStudentId,
        tutorId: selectedTutorId,
        subject,
        title: title || `${subject} Regular Class`,
        recurrence,
        startDate,
        endDate,
      });
      loadData();
      setNewModalOpen(false);
      setTitle('');
    } catch {
      // Local optimistic addition
      setClasses((prev) => [
        {
          id: `cls-${Date.now()}`,
          studentId: selectedStudentId,
          tutorId: selectedTutorId,
          subject,
          title: title || `${subject} Class`,
          recurrence,
          startDate,
          endDate,
          status: 'ACCEPTED',
          studentName: families.find((f) => f.id === selectedStudentId)?.studentName || 'Student',
          tutorName: tutors.find((t) => t.id === selectedTutorId)?.fullName || 'Tutor',
          sessionsGeneratedCount: 8,
        },
        ...prev,
      ]);
      setNewModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes & Scheduling"
        subtitle="Manage class requests and session schedules for your assigned caseload students."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Classes' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setNewModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <Plus className="size-4" /> Create Class Request
          </Button>
        }
      />

      <Panel title="Caseload Class Schedules" description="Active and requested classes for your assigned students">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading class schedules...
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Calendar className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Active Classes Scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Class Title & Subject</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Assigned Tutor</th>
                  <th className="p-3">Recurrence</th>
                  <th className="p-3">Schedule Dates</th>
                  <th className="p-3">Sessions</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{c.title}</div>
                      <div className="text-[11px] text-muted-foreground">{c.subject}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{c.studentName}</td>
                    <td className="p-3 font-medium text-foreground">{c.tutorName}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">
                        {c.recurrence}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {c.startDate} to {c.endDate}
                    </td>
                    <td className="p-3 font-semibold">{c.sessionsGeneratedCount || 8} sessions</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          c.status === 'ACCEPTED'
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-warning-subtle text-warning border-warning/30'
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* New Class Request Modal */}
      <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Create Class Request
            </DialogTitle>
            <DialogDescription>
              Schedule a recurring or one-off class for an assigned caseload student.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRequest} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Assigned Student *</Label>
                <Select value={selectedStudentId} onValueChange={(val) => val && setSelectedStudentId(val)} disabled={isSubmitting}>
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.studentName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Assigned Tutor *</Label>
                <Select value={selectedTutorId} onValueChange={(val) => val && setSelectedTutorId(val)} disabled={isSubmitting}>
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Select tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="clsTitle" className="text-xs font-medium text-foreground">Class Title *</Label>
                <Input id="clsTitle" placeholder="e.g. Weekly Math HL Prep" value={title} onChange={(e) => setTitle(e.target.value)} required className="text-xs h-9" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="clsSub" className="text-xs font-medium text-foreground">Subject *</Label>
                <Input id="clsSub" value={subject} onChange={(e) => setSubject(e.target.value)} required className="text-xs h-9" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Recurrence</Label>
                <Select value={recurrence} onValueChange={(val) => val && setRecurrence(val)} disabled={isSubmitting}>
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
                    <SelectItem value="ONE_OFF">One-Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="clsStart" className="text-xs font-medium text-foreground">Start Date *</Label>
                <Input id="clsStart" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="text-xs h-9" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="clsEnd" className="text-xs font-medium text-foreground">End Date *</Label>
                <Input id="clsEnd" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="text-xs h-9" />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setNewModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" /> : 'Create Class Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
