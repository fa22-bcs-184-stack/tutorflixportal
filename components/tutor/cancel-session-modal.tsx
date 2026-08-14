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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { XCircle, AlertTriangle, Paperclip, ShieldAlert } from 'lucide-react';
import { cancelTutorClass } from '@/lib/api/tutor-api';

interface CancelSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  sessionTitle: string;
  studentName: string;
  onSuccess: () => void;
}

export function CancelSessionModal({
  open,
  onOpenChange,
  sessionId,
  sessionTitle,
  studentName,
  onSuccess,
}: CancelSessionModalProps) {
  const [cancelledByRole, setCancelledByRole] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('A cancellation reason is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await cancelTutorClass(sessionId, {
        cancelledByRole,
        reason: reason.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
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
          <DialogTitle className="flex items-center gap-2 text-danger">
            <XCircle className="size-5" />
            Cancel Class Session
          </DialogTitle>
          <DialogDescription>
            Cancel session <strong>{sessionTitle}</strong> with {studentName}.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Business Rule Warning Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-subtle/30 p-3 text-xs text-warning">
          <ShieldAlert className="size-4 shrink-0 mt-0.5" />
          <div>
            <strong>Pay Rule Notice:</strong> Cancelling a class never pays the tutor regardless of attribution selected (Student vs Tutor dropdown is for statistics/audit records only).
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Cancelled By (Attribution Dropdown) <span className="text-danger">*</span>
            </Label>
            <Select value={cancelledByRole} onValueChange={(val) => val && setCancelledByRole(val as 'STUDENT' | 'TUTOR')}>
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student / Parent Cancelled</SelectItem>
                <SelectItem value="TUTOR">Tutor Cancelled (Monthly Counter Audit)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              {cancelledByRole === 'TUTOR'
                ? 'Increments your monthly tutor cancellation count.'
                : 'Attributed to student; does not count against your tutor cancellation quota.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cancelReason" className="text-xs font-medium text-foreground">
              Cancellation Reason <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="cancelReason"
              placeholder="Explain why the session is cancelled (e.g. Student illness, tutor emergency)."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cancelEvidence" className="text-xs font-medium text-foreground">
              Evidence Attachment / Screenshot URL
            </Label>
            <div className="relative">
              <Paperclip className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="cancelEvidence"
                placeholder="Upload or paste screenshot URL proving agreement (optional)"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                disabled={isSubmitting}
                className="pl-8 text-xs h-9"
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Proof that student agreed to cancellation (e.g. chat screenshot link).
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Keep Session
            </Button>
            <Button type="submit" className="bg-danger text-white hover:bg-danger/90 font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
