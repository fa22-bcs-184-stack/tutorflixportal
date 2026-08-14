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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { UserCheck, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react';
import { getAllTutors, assignTutorToStudent, TutorAdminItem } from '@/lib/api/admin-api';

interface TutorAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  currentTutorName?: string;
  onSuccess: () => void;
}

export function TutorAssignModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  currentTutorName,
  onSuccess,
}: TutorAssignModalProps) {
  const [tutors, setTutors] = useState<TutorAdminItem[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIsLoadingTutors(true);
      getAllTutors()
        .then((res) => {
          setTutors(res.filter((t) => t.active));
          if (res.length > 0) setSelectedTutorId(res[0].id);
        })
        .finally(() => setIsLoadingTutors(false));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutorId) {
      setErrorMsg('Please select a tutor.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await assignTutorToStudent(studentId, selectedTutorId);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign tutor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            Assign Tutor to {studentName}
          </DialogTitle>
          <DialogDescription>
            {currentTutorName ? (
              <span>Currently assigned to <strong>{currentTutorName}</strong>. Reassigning will replace tutor.</span>
            ) : (
              'Assign a primary tutor from the active platform roster.'
            )}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conversation Archive Reassignment Warning Banner */}
        {currentTutorName && (
          <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-subtle/30 p-3 text-xs text-warning">
            <MessageSquare className="size-4 shrink-0 mt-0.5" />
            <div>
              <strong>Reassignment Warning:</strong> Reassigning tutor will automatically archive the existing chat conversation with {currentTutorName} and initialize a fresh conversation for the new tutor.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Select Active Tutor <span className="text-danger">*</span>
            </Label>
            {isLoadingTutors ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 border rounded-md">
                <Spinner size="sm" /> Loading tutors...
              </div>
            ) : (
              <Select value={selectedTutorId} onValueChange={(val) => val && setSelectedTutorId(val)} disabled={isSubmitting}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder="Select active tutor" />
                </SelectTrigger>
                <SelectContent>
                  {tutors.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.fullName} ({t.subjects.join(', ')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Confirm Tutor Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
