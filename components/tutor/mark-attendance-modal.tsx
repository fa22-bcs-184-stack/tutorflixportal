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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CheckSquare, AlertCircle, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { markSessionAttendance } from '@/lib/api/tutor-api';

interface MarkAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  sessionTitle: string;
  studentName: string;
  durationMinutes: number;
  onSuccess: () => void;
}

export function MarkAttendanceModal({
  open,
  onOpenChange,
  sessionId,
  sessionTitle,
  studentName,
  durationMinutes,
  onSuccess,
}: MarkAttendanceModalProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<'PRESENT' | 'LATE' | 'ABSENT' | 'CANCELLED'>('PRESENT');
  const [isLate, setIsLate] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hoursToDeduct = Math.ceil(durationMinutes / 60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await markSessionAttendance(sessionId, {
        attendanceStatus,
        isLate,
        notes: notes.trim() || undefined,
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
            <CheckSquare className="size-5 text-success" />
            Mark Class Attendance & Deduct Hours
          </DialogTitle>
          <DialogDescription>
            Mark session <strong>{sessionTitle}</strong> with {studentName} ({durationMinutes} mins).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Transaction Impact Notice */}
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-subtle/30 p-3.5 text-xs text-foreground">
          <DollarSign className="size-5 shrink-0 text-success" />
          <div>
            <strong>Financial Transaction Action:</strong> Marking attendance will deduct <strong className="text-foreground font-bold">{hoursToDeduct} hour(s)</strong> from {studentName}'s purchase ledger and credit your cycle earnings.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Attendance Status <span className="text-danger">*</span>
            </Label>
            <Select
              value={attendanceStatus}
              onValueChange={(val) => val && setAttendanceStatus(val as any)}
            >
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESENT">Present (Full Session)</SelectItem>
                <SelectItem value="LATE">Late (Arrived Late)</SelectItem>
                <SelectItem value="ABSENT">Absent (No Show)</SelectItem>
                <SelectItem value="CANCELLED">Cancelled Session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Late Checkmark Modifier */}
          {attendanceStatus === 'PRESENT' && (
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox id="lateCheck" checked={isLate} onCheckedChange={(chk) => setIsLate(!!chk)} />
              <label htmlFor="lateCheck" className="text-xs font-medium leading-none cursor-pointer">
                Mark as Late Arrival (Late checkmark modifier)
              </label>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="attNotes" className="text-xs font-medium text-foreground">
              Session Notes / Learning Progress
            </Label>
            <Textarea
              id="attNotes"
              placeholder="Briefly describe topics covered or student progress during this session."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-success text-white hover:bg-success-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Confirm & Complete Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
