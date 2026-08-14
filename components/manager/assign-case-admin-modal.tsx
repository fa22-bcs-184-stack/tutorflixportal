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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { assignCaseAdmin, StaffUserItem } from '@/lib/api/manager-api';

interface AssignCaseAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  parentName: string;
  adminUsers: StaffUserItem[];
  onSuccess: () => void;
}

export function AssignCaseAdminModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  parentName,
  adminUsers,
  onSuccess,
}: AssignCaseAdminModalProps) {
  const [selectedAdminId, setSelectedAdminId] = useState(adminUsers[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminId) {
      setErrorMsg('Please select an Admin caseworker.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await assignCaseAdmin(studentId, selectedAdminId);
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
            <UserCheck className="size-5 text-primary" />
            Assign Case Admin
          </DialogTitle>
          <DialogDescription>
            Assign an Admin caseworker to <strong className="text-foreground">{studentName}</strong> ({parentName}'s family).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <div>
            <strong>Unblocks Caseload Operations:</strong> Assigning a Case Admin allows tutor assignment, class scheduling, and payment approvals to begin for this family.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Select Admin Caseworker *</Label>
            <Select value={selectedAdminId} onValueChange={(val) => val && setSelectedAdminId(val)}>
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue placeholder="Select Admin" />
              </SelectTrigger>
              <SelectContent>
                {adminUsers.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} ({a.email}) {a.assignedCaseloadCount !== undefined ? `— ${a.assignedCaseloadCount} families` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Confirm Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
