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
import { Spinner } from '@/components/ui/spinner';
import { MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitTrialFeedback } from '@/lib/api/tutor-api';

interface TrialFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trialId: string;
  studentName: string;
  subject: string;
  onSuccess: () => void;
}

export function TrialFeedbackModal({
  open,
  onOpenChange,
  trialId,
  studentName,
  subject,
  onSuccess,
}: TrialFeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMsg('Please enter trial feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await submitTrialFeedback(trialId, feedback.trim());
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
            <MessageSquare className="size-5 text-primary" />
            Submit Trial Feedback
          </DialogTitle>
          <DialogDescription>
            Submit feedback for <strong className="text-foreground">{studentName}</strong> ({subject} Trial).
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
            <Label htmlFor="trialFb" className="text-xs font-medium text-foreground">
              Trial Feedback & Assessment Notes <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="trialFb"
              placeholder="Describe student performance, areas of strength, and recommended curriculum package."
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Feedback & Mark Done'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
