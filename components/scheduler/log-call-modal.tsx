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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { PhoneCall, Calendar, AlertCircle } from 'lucide-react';
import { logCallAndNote } from '@/lib/api/scheduler-api';

interface LogCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  studentName: string;
  currentStatus: string;
  onSuccess: () => void;
}

export function LogCallModal({
  open,
  onOpenChange,
  leadId,
  studentName,
  currentStatus,
  onSuccess,
}: LogCallModalProps) {
  const [noteText, setNoteText] = useState('');
  const [status, setStatus] = useState<string>(currentStatus === 'NEW' ? 'CONTACTED' : currentStatus);
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteText.trim()) {
      setErrorMsg('Please enter call outcome notes.');
      return;
    }

    if (!status) {
      setErrorMsg('A forced status update is required after logging a call.');
      return;
    }

    if (status === 'FOLLOW_UP' && !nextFollowUpAt) {
      setErrorMsg('Please select a follow-up date and time when setting status to Follow Up.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await logCallAndNote(leadId, {
        noteText: noteText.trim(),
        status,
        nextFollowUpAt: status === 'FOLLOW_UP' ? new Date(nextFollowUpAt).toISOString() : null,
      });
      onSuccess();
      onOpenChange(false);
      // Reset form
      setNoteText('');
      setNextFollowUpAt('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to log call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PhoneCall className="size-5 text-primary" />
            Log Call & Update Status
          </DialogTitle>
          <DialogDescription>
            Record call details for <strong className="text-foreground">{studentName}</strong>. A status update is mandatory.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Call Outcome Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="callNote" className="text-xs font-medium text-foreground">
              Call Outcome Notes <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="callNote"
              placeholder="e.g. Discussed curriculum options with parent. Parent requested follow-up next Tuesday afternoon."
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              disabled={isSubmitting}
              required
              className="text-xs"
            />
          </div>

          {/* Forced Status Update */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Forced Status Update <span className="text-danger">*</span>
            </Label>
            <Select value={status} onValueChange={(val) => val && setStatus(val)} disabled={isSubmitting}>
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue placeholder="Select updated status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTACTED">CONTACTED (Parent reached)</SelectItem>
                <SelectItem value="FOLLOW_UP">FOLLOW UP (Scheduled next contact)</SelectItem>
                <SelectItem value="TRIAL_SCHEDULED">TRIAL SCHEDULED (Booking trial)</SelectItem>
                <SelectItem value="LOST">LOST (Not interested)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground italic">
              Status update is required after logging any call interaction.
            </p>
          </div>

          {/* Follow-up Date Picker (Mandatory if status is FOLLOW_UP) */}
          {status === 'FOLLOW_UP' && (
            <div className="space-y-1.5 p-3 rounded-lg bg-warning-subtle/40 border border-warning/20">
              <Label htmlFor="followUpDate" className="text-xs font-medium text-warning flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Next Follow-up Date & Time <span className="text-danger">*</span>
              </Label>
              <Input
                id="followUpDate"
                type="datetime-local"
                value={nextFollowUpAt}
                onChange={(e) => setNextFollowUpAt(e.target.value)}
                disabled={isSubmitting}
                required
                className="text-xs h-9 bg-card"
              />
            </div>
          )}

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
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Saving...
                </>
              ) : (
                'Save Call Record'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
