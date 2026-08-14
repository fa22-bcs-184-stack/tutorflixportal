'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RequestSessionModal } from '@/components/student/request-session-modal';
import { RescheduleSessionModal } from '@/components/student/reschedule-session-modal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Calendar, Plus, Clock, Video, XCircle, RefreshCw } from 'lucide-react';
import { getStudentClasses, cancelStudentSession, StudentClassSession } from '@/lib/api/student-api';

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<StudentClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [selectedSession, setSelectedSession] = useState<StudentClassSession | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await getStudentClasses();
      setClasses(data);
    } catch {
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenReschedule = (session: StudentClassSession) => {
    setSelectedSession(session);
    setRescheduleModalOpen(true);
  };

  const handleOpenCancel = (session: StudentClassSession) => {
    setSelectedSession(session);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSession) return;
    setIsCancelling(true);
    try {
      await cancelStudentSession(selectedSession.id, 'Cancelled by student');
      fetchClasses();
      setCancelDialogOpen(false);
    } catch {
      setClasses((prev) =>
        prev.map((c) => (c.id === selectedSession.id ? { ...c, status: 'CANCELLED' } : c))
      );
      setCancelDialogOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Class Schedule"
        subtitle="View upcoming sessions, attendance history, request new classes, or reschedule existing sessions."
        breadcrumbs={[
          { label: 'Student', href: '/student' },
          { label: 'Classes' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setRequestModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <Plus className="size-4" /> Request a Session
          </Button>
        }
      />

      <Panel title="Class Sessions Timetable" description="Scheduled, completed, and cancelled sessions">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading class schedule...
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Calendar className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Class Sessions Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Session Title & Subject</th>
                  <th className="p-3">Assigned Tutor</th>
                  <th className="p-3">Scheduled Date & Time</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Attendance / Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{cls.title}</div>
                      <div className="text-[11px] text-muted-foreground">{cls.subject}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{cls.tutorName}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(cls.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-3 font-medium">{cls.durationMinutes} mins</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          cls.status === 'DONE'
                            ? 'bg-success-subtle text-success border-success/30'
                            : cls.status === 'CANCELLED'
                            ? 'bg-danger-subtle text-danger border-danger/30'
                            : 'bg-primary/10 text-primary border-primary/30'
                        }`}
                      >
                        {cls.status === 'DONE' ? cls.attendanceStatus || 'PRESENT' : cls.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {cls.status === 'SCHEDULED' && (
                        <>
                          {cls.zoomUrl && (
                            <a href={cls.zoomUrl} target="_blank" rel="noreferrer">
                              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs h-8 gap-1">
                                <Video className="size-3.5" /> Join
                              </Button>
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReschedule(cls)}
                            className="text-xs h-8 gap-1"
                          >
                            <Clock className="size-3.5" /> Reschedule
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenCancel(cls)}
                            className="text-xs h-8 text-danger hover:bg-danger-subtle gap-1"
                          >
                            <XCircle className="size-3.5" /> Cancel
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Modals */}
      <RequestSessionModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        assignedTutorName="Dr. Alan Turing"
        onSuccess={fetchClasses}
      />

      {selectedSession && (
        <RescheduleSessionModal
          open={rescheduleModalOpen}
          onOpenChange={setRescheduleModalOpen}
          sessionId={selectedSession.id}
          sessionTitle={selectedSession.title}
          onSuccess={fetchClasses}
        />
      )}

      <ConfirmationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Session"
        description={`Are you sure you want to cancel ${selectedSession?.title}?`}
        confirmLabel="Cancel Session"
        variant="destructive"
        isSubmitting={isCancelling}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
