'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Video, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getActiveTutors, scheduleTrial, markTrialNotified, TutorItem } from '@/lib/api/scheduler-api';

interface ScheduleTrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  studentName: string;
  preferredSubject?: string;
  onSuccess: () => void;
}

export function ScheduleTrialModal({
  open,
  onOpenChange,
  leadId,
  studentName,
  preferredSubject = 'Mathematics',
  onSuccess,
}: ScheduleTrialModalProps) {
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [subject, setSubject] = useState(preferredSubject || 'Mathematics');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  // Three manual notification checkboxes
  const [tutorNotified, setTutorNotified] = useState(false);
  const [parentNotified, setParentNotified] = useState(false);
  const [salesMemberNotified, setSalesMemberNotified] = useState(false);

  const [isLoadingTutors, setIsLoadingTutors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIsLoadingTutors(true);
      getActiveTutors()
        .then((res) => {
          setTutors(res);
          if (res.length > 0) setSelectedTutorId(res[0].id);
        })
        .finally(() => setIsLoadingTutors(false));

      // Generate a mock Teams meeting link stub
      const randomUuid = Math.random().toString(36).substring(2, 10);
      setMeetingLink(`https://teams.microsoft.com/l/meetup-join/tutorflix-trial-${randomUuid}`);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTutorId) {
      setErrorMsg('Please select a tutor.');
      return;
    }

    if (!scheduledAt) {
      setErrorMsg('Please pick a trial date and time.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Create Trial
      const trial = await scheduleTrial({
        leadId,
        tutorId: selectedTutorId,
        subject,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: `Meeting Link: ${meetingLink}`,
      });

      // 2. Log notification audit timestamps if checked
      if (tutorNotified || parentNotified || salesMemberNotified) {
        await markTrialNotified(trial.id || 'trial-id', {
          tutorNotified,
          parentNotified,
          salesMemberNotified,
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule trial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            Schedule Trial Lesson
          </DialogTitle>
          <DialogDescription>
            Assign a tutor and schedule trial for <strong className="text-foreground">{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Tutor Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Assigned Tutor <span className="text-danger">*</span>
            </Label>
            {isLoadingTutors ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 border rounded-md">
                <Spinner size="sm" /> Loading tutors...
              </div>
            ) : (
              <Select value={selectedTutorId} onValueChange={(val) => val && setSelectedTutorId(val)} disabled={isSubmitting}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder="Select a tutor" />
                </SelectTrigger>
                <SelectContent>
                  {tutors.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.user?.fullName || `Tutor (${t.id})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Subject & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="trialSubject" className="text-xs font-medium text-foreground">
                Subject <span className="text-danger">*</span>
              </Label>
              <Input
                id="trialSubject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="trialDate" className="text-xs font-medium text-foreground">
                Scheduled Date & Time <span className="text-danger">*</span>
              </Label>
              <Input
                id="trialDate"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={isSubmitting}
                required
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Teams Meeting Link Auto-Gen */}
          <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border border-border">
            <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Video className="size-3.5 text-primary" /> Generated Teams Meeting Link
            </Label>
            <Input
              readOnly
              value={meetingLink}
              className="text-xs h-8 bg-card font-mono text-muted-foreground select-all"
            />
          </div>

          {/* Manual Notification Audit Checkboxes */}
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Manual Notification Status
              </Label>
              <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <ShieldAlert className="size-3 text-warning" /> Off-platform logging only
              </span>
            </div>

            <div className="space-y-2 rounded-lg bg-card p-3 border border-border text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyTutor"
                  checked={tutorNotified}
                  onCheckedChange={(checked: boolean) => setTutorNotified(checked)}
                />
                <label htmlFor="notifyTutor" className="text-xs font-medium leading-none cursor-pointer">
                  Mark Tutor as Notified (Off-platform)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyParent"
                  checked={parentNotified}
                  onCheckedChange={(checked: boolean) => setParentNotified(checked)}
                />
                <label htmlFor="notifyParent" className="text-xs font-medium leading-none cursor-pointer">
                  Mark Parent as Notified (Off-platform)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifySales"
                  checked={salesMemberNotified}
                  onCheckedChange={(checked: boolean) => setSalesMemberNotified(checked)}
                />
                <label htmlFor="notifySales" className="text-xs font-medium leading-none cursor-pointer">
                  Mark Sales Member as Notified (Off-platform)
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cta text-cta-foreground hover:bg-cta-hover font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Booking Trial...
                </>
              ) : (
                'Schedule Trial'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
