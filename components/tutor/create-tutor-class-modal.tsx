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
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { createTutorClass, TutorStudentItem } from '@/lib/api/tutor-api';

interface CreateTutorClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: TutorStudentItem[];
  onSuccess: () => void;
}

export function CreateTutorClassModal({
  open,
  onOpenChange,
  students,
  onSuccess,
}: CreateTutorClassModalProps) {
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [subject, setSubject] = useState('Mathematics HL');
  const [title, setTitle] = useState('');
  const [slotType, setSlotType] = useState<'STATED' | 'ADHOC'>('STATED');
  const [slotTime, setSlotTime] = useState('16:00');
  const [recurrence, setRecurrence] = useState('WEEKLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !startDate || !endDate) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createTutorClass({
        studentId,
        subject,
        title: title.trim() || `${subject} Class`,
        recurrence,
        startDate,
        endDate,
        slotTime,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            Create Class Directly
          </DialogTitle>
          <DialogDescription>
            Schedule a class directly without waiting for admin approval. Sessions generate immediately.
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
              <Label className="text-xs font-medium text-foreground">Select Student *</Label>
              <Select value={studentId} onValueChange={(val) => val && setStudentId(val)} disabled={isSubmitting}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.studentName} ({s.remainingHours} hrs left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subText" className="text-xs font-medium text-foreground">Subject *</Label>
              <Input id="subText" value={subject} onChange={(e) => setSubject(e.target.value)} required className="text-xs h-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clsTitleText" className="text-xs font-medium text-foreground">Class Title</Label>
            <Input id="clsTitleText" placeholder="e.g. IB Math HL Exam Revision" value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs h-9" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Slot Type</Label>
              <Select value={slotType} onValueChange={(val) => val && setSlotType(val as any)} disabled={isSubmitting}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATED">Stated Availability Slot</SelectItem>
                  <SelectItem value="ADHOC">Ad-hoc Slot (Outside Stated Hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sTime" className="text-xs font-medium text-foreground">Slot Time *</Label>
              <Input id="sTime" type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} required className="text-xs h-9" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Recurrence</Label>
              <Select value={recurrence} onValueChange={(val) => val && setRecurrence(val)} disabled={isSubmitting}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
                  <SelectItem value="ONE_OFF">One-Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stDate" className="text-xs font-medium text-foreground">Start Date *</Label>
              <Input id="stDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="text-xs h-9" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enDate" className="text-xs font-medium text-foreground">End Date *</Label>
              <Input id="enDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="text-xs h-9" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Generate Sessions Immediately'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
