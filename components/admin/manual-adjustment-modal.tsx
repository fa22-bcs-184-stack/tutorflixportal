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
import { AlertCircle, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { createPurchaseAdjustment } from '@/lib/api/admin-api';

interface ManualAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentPurchaseId: string;
  studentName: string;
  packageName?: string;
  onSuccess: () => void;
}

export function ManualAdjustmentModal({
  open,
  onOpenChange,
  studentPurchaseId,
  studentName,
  packageName = 'Purchase Package',
  onSuccess,
}: ManualAdjustmentModalProps) {
  const [hoursDelta, setHoursDelta] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hoursDelta === 0) {
      setErrorMsg('Hours delta cannot be 0.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('A mandatory reason is required for manual hour adjustments.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createPurchaseAdjustment({
        studentPurchaseId,
        hoursDelta: Number(hoursDelta),
        reason: reason.trim(),
      });
      onSuccess();
      onOpenChange(false);
      setReason('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to apply hour adjustment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-primary" />
            Manual Hour Adjustment
          </DialogTitle>
          <DialogDescription>
            Adjust remaining hours for <strong className="text-foreground">{studentName}</strong> ({packageName}).
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
            <Label htmlFor="hrsDelta" className="text-xs font-medium text-foreground">
              Hours Delta (+ to credit, - to deduct) <span className="text-danger">*</span>
            </Label>
            <Input
              id="hrsDelta"
              type="number"
              value={hoursDelta}
              onChange={(e) => setHoursDelta(Number(e.target.value))}
              required
              className="text-xs h-9 font-bold"
            />
            <p className="text-[10px] text-muted-foreground italic">
              Use positive numbers (e.g. 2) to credit hours, negative (e.g. -2) to deduct hours.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adjReason" className="text-xs font-medium text-foreground">
              Mandatory Adjustment Reason <span className="text-danger">*</span>
            </Label>
            <Textarea
              id="adjReason"
              placeholder="e.g. Compensatory credit for cancelled tutor session on August 10."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Apply Adjustment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
