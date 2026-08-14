'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { WeeklyCalendar } from '@/components/dashboard/weekly-calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CreateTutorClassModal } from '@/components/tutor/create-tutor-class-modal';
import { CancelSessionModal } from '@/components/tutor/cancel-session-modal';
import { MarkAttendanceModal } from '@/components/tutor/mark-attendance-modal';
import { AvailabilityRequestModal } from '@/components/tutor/availability-request-modal';
import { weekSessions, tutorAvailability } from '@/lib/data';
import {
  Plus,
  Clock,
  CheckSquare,
  XCircle,
  StickyNote,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getTutorClasses,
  getAssignedStudents,
  getTutorFocusNotes,
  saveTutorFocusNote,
  deleteTutorFocusNote,
  ClassSessionItem,
  TutorStudentItem,
  FocusNoteItem,
} from '@/lib/api/tutor-api';

export default function TutorCalendarPage() {
  const [classes, setClasses] = useState<ClassSessionItem[]>([]);
  const [students, setStudents] = useState<TutorStudentItem[]>([]);
  const [focusNotes, setFocusNotes] = useState<FocusNoteItem[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Reschedule requests mock state
  const [rescheduleRequests, setRescheduleRequests] = useState([
    {
      id: 'rr-1',
      student: 'Lena Müller',
      from: 'Tue 10:30 AM',
      to: 'Wed 2:00 PM',
      subject: 'Physics',
    },
    {
      id: 'rr-2',
      student: 'Diego Torres',
      from: 'Thu 4:00 PM',
      to: 'Fri 3:00 PM',
      subject: 'Mathematics',
    },
  ]);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);

  const [selectedSession, setSelectedSession] = useState<ClassSessionItem | null>(null);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [clsList, stList, notesList] = await Promise.all([
        getTutorClasses(),
        getAssignedStudents(),
        getTutorFocusNotes(),
      ]);
      setClasses(clsList);
      setStudents(stList);
      setFocusNotes(notesList);
    } catch {
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddFocusNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      const created = await saveTutorFocusNote(newNoteText.trim());
      setFocusNotes((prev) => [created, ...prev]);
    } catch {
      setFocusNotes((prev) => [
        { id: `fn-${Date.now()}`, noteText: newNoteText.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ]);
    } finally {
      setNewNoteText('');
    }
  };

  const handleDeleteFocusNote = async (id: string) => {
    try {
      await deleteTutorFocusNote(id);
      setFocusNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setFocusNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleAcceptReschedule = (id: string) => {
    setRescheduleRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeclineReschedule = (id: string) => {
    setRescheduleRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenCancel = (session?: ClassSessionItem) => {
    setSelectedSession(
      session ||
        classes[0] || {
          id: 'sess-101',
          classRequestId: 'cls-1',
          studentId: 'st-01',
          studentName: 'Aarav Sharma',
          subject: 'Mathematics HL',
          title: 'Weekly IB Math HL Prep',
          scheduledAt: new Date().toISOString(),
          durationMinutes: 60,
          status: 'SCHEDULED',
        }
    );
    setCancelModalOpen(true);
  };

  const handleOpenAttendance = (session?: ClassSessionItem) => {
    setSelectedSession(
      session ||
        classes[0] || {
          id: 'sess-101',
          classRequestId: 'cls-1',
          studentId: 'st-01',
          studentName: 'Aarav Sharma',
          subject: 'Mathematics HL',
          title: 'Weekly IB Math HL Prep',
          scheduledAt: new Date().toISOString(),
          durationMinutes: 60,
          status: 'SCHEDULED',
        }
    );
    setAttendanceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        subtitle="Manage your sessions, availability, and reschedule requests."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Schedule' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleOpenAttendance()}
              className="bg-success text-white hover:bg-success-hover text-xs gap-1.5 font-semibold"
            >
              <CheckSquare className="size-3.5" /> Mark Attendance
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenCancel()}
              className="text-xs text-danger border-danger/30 hover:bg-danger-subtle gap-1.5 font-semibold"
            >
              <XCircle className="size-3.5" /> Cancel Session
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
            >
              <Plus className="size-4" /> Add Session
            </Button>
          </div>
        }
      />

      {/* Main Grid Layout: Left Column = WeeklyCalendar; Right Column = Availability & Reschedule Panels */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_20rem]">
        {/* Left Column: Weekly Calendar Grid */}
        <div className="space-y-5">
          <WeeklyCalendar sessions={weekSessions} showStudent />

          {/* "In Focus This Week" Freeform Moodboard */}
          <Panel title="In Focus This Week" description="Personal organizational moodboard (not tied to business entities)">
            <div className="space-y-4 pt-1 text-xs">
              <form onSubmit={handleAddFocusNote} className="flex gap-2">
                <Input
                  placeholder="Add personal note for this week (e.g. Prepare IB Calculus past paper)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="text-xs h-9 bg-muted/30 flex-1"
                />
                <Button type="submit" size="sm" className="gap-1.5 h-9">
                  <StickyNote className="size-3.5" /> Add Note
                </Button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {focusNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-card border border-border flex items-start justify-between gap-2 shadow-2xs">
                    <p className="text-foreground leading-relaxed">{note.noteText}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFocusNote(note.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-danger shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-5">
          {/* Availability Panel */}
          <Panel title="Availability" description="Your open slots this week">
            <div className="flex flex-col gap-2.5">
              {tutorAvailability.map((day) => (
                <div key={day.day}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {day.day}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.slots.map((slot) => (
                      <button
                        key={slot}
                        className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/8 hover:text-primary"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAvailabilityModalOpen(true)}
              className="mt-3 w-full text-xs"
            >
              Edit Availability (Request Change)
            </Button>
          </Panel>

          {/* Reschedule Requests Panel */}
          <Panel title="Reschedule Requests" description="Pending changes from students">
            <div className="flex flex-col gap-2.5">
              {rescheduleRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">No pending reschedule requests.</p>
              ) : (
                rescheduleRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col gap-2 rounded-xl border border-warning/30 bg-warning/5 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{req.student}</p>
                      <Badge
                        variant="outline"
                        className="border-warning/30 text-warning text-[0.65rem]"
                      >
                        Pending
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{req.subject}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3 text-muted-foreground" />
                        {req.from}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium text-primary">{req.to}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineReschedule(req.id)}
                        className="flex-1 text-xs h-7"
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptReschedule(req.id)}
                        className="flex-1 text-xs h-7 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* Modals */}
      <CreateTutorClassModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        students={students}
        onSuccess={loadAll}
      />

      <AvailabilityRequestModal
        open={availabilityModalOpen}
        onOpenChange={setAvailabilityModalOpen}
        onSuccess={loadAll}
      />

      {selectedSession && (
        <CancelSessionModal
          open={cancelModalOpen}
          onOpenChange={setCancelModalOpen}
          sessionId={selectedSession.id}
          sessionTitle={selectedSession.title}
          studentName={selectedSession.studentName}
          onSuccess={loadAll}
        />
      )}

      {selectedSession && (
        <MarkAttendanceModal
          open={attendanceModalOpen}
          onOpenChange={setAttendanceModalOpen}
          sessionId={selectedSession.id}
          sessionTitle={selectedSession.title}
          studentName={selectedSession.studentName}
          durationMinutes={selectedSession.durationMinutes}
          onSuccess={loadAll}
        />
      )}
    </div>
  );
}
