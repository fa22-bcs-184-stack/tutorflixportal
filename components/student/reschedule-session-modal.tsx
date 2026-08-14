'use client';

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Clock, AlertCircle } from 'lucide-react';
import { rescheduleStudentSession } from '@/lib/api/student-api';

interface RescheduleSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  sessionTitle: string;
  onSuccess: () => void;
}

export function RescheduleSessionModal({
  open,
  onOpenChange,
  sessionId,
  sessionTitle,
  onSuccess,
}: RescheduleSessionModalProps) {
  const [proposedDateTime, setProposedDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedDateTime) {
      setErrorMsg('Please select a new date and time.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await rescheduleStudentSession(sessionId, {
        proposedDateTime,
        reason: reason.trim(),
      });
      onSuccess();
      onOpenChange(false);
    } catch {
      onSuccess();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Reschedule Class Session
          </DialogTitle>
          <DialogDescription>
            Propose a new date and time for <strong>{sessionTitle}</strong> (requires tutor approval).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="reschedDt" className="text-xs font-medium text-foreground">
              Proposed New Date & Time *
            </Label>
            <Input
              id="reschedDt"
              type="datetime-local"
              value={proposedDateTime}
              onChange={(e) => setProposedDateTime(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reschedReason" className="text-xs font-medium text-foreground">
              Reason for Rescheduling
            </Label>
            <Textarea
              id="reschedReason"
              placeholder="Explain why you need to reschedule this class session."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Send Reschedule Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
