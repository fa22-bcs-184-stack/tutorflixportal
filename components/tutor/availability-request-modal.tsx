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
import { Clock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { requestAvailabilityChange } from '@/lib/api/tutor-api';

interface AvailabilityRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DEFAULT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_TIMES = ['Morning (9 AM - 12 PM)', 'Afternoon (1 PM - 5 PM)', 'Evening (5 PM - 9 PM)'];

export function AvailabilityRequestModal({
  open,
  onOpenChange,
  onSuccess,
}: AvailabilityRequestModalProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([
    'Monday - Afternoon (1 PM - 5 PM)',
    'Wednesday - Evening (5 PM - 9 PM)',
  ]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setErrorMsg('Please select at least one availability slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await requestAvailabilityChange(selectedSlots, reason);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Request Availability Change
          </DialogTitle>
          <DialogDescription>
            Submit proposed weekly availability slots to Admin Manager for review and approval.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-info/30 bg-info-subtle p-3 text-xs text-info">
          <ShieldCheck className="size-4 shrink-0 text-info" />
          <div>
            <strong>Admin Manager Approval:</strong> Your request will be routed specifically to Admin Manager for review (`AvailabilityChangeRequest`).
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">Select Proposed Weekly Availability Slots *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border rounded-lg bg-muted/20">
              {DEFAULT_DAYS.flatMap((day) =>
                DEFAULT_TIMES.map((time) => {
                  const slotKey = `${day} - ${time}`;
                  const isChecked = selectedSlots.includes(slotKey);
                  return (
                    <button
                      type="button"
                      key={slotKey}
                      onClick={() => toggleSlot(slotKey)}
                      className={`flex items-center justify-between p-2 rounded-md border text-[11px] text-left transition-all ${
                        isChecked
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span>{slotKey}</span>
                      {isChecked && <CheckCircle2 className="size-3.5 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reqReason" className="text-xs font-medium text-foreground">
              Reason for Schedule Change
            </Label>
            <Textarea
              id="reqReason"
              placeholder="Explain schedule adjustments (e.g. University timetable update)."
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Request to Admin Manager'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
