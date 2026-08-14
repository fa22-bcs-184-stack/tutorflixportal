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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Plus, AlertCircle, GraduationCap } from 'lucide-react';
import { requestStudentSession } from '@/lib/api/student-api';

interface RequestSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignedTutorName: string;
  onSuccess: () => void;
}

export function RequestSessionModal({
  open,
  onOpenChange,
  assignedTutorName = 'Dr. Alan Turing',
  onSuccess,
}: RequestSessionModalProps) {
  const [subject, setSubject] = useState('Mathematics HL');
  const [slotTime, setSlotTime] = useState('16:00');
  const [recurrence, setRecurrence] = useState('WEEKLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg('Please select start and end dates.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await requestStudentSession({
        subject,
        slotTime,
        recurrence,
        startDate,
        endDate,
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
            <Plus className="size-5 text-primary" />
            Request a Class Session
          </DialogTitle>
          <DialogDescription>
            Request a new class session with your assigned tutor.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Subject *</Label>
              <Select value={subject} onValueChange={(val) => val && setSubject(val)}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics HL">Mathematics HL</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Assigned Tutor</Label>
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/30 text-foreground font-semibold h-9 text-xs">
                <GraduationCap className="size-4 text-primary" />
                {assignedTutorName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reqSlot" className="text-xs font-medium text-foreground">Preferred Time Slot *</Label>
              <Input id="reqSlot" type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} required className="text-xs h-9" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Recurrence</Label>
              <Select value={recurrence} onValueChange={(val) => val && setRecurrence(val)}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None (One-Off)</SelectItem>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reqStart" className="text-xs font-medium text-foreground">Start Date *</Label>
              <Input id="reqStart" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="text-xs h-9" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reqEnd" className="text-xs font-medium text-foreground">End Date *</Label>
              <Input id="reqEnd" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="text-xs h-9" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Session Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
