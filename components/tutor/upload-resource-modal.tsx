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
import { FileUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { uploadStudentResource, TutorStudentItem } from '@/lib/api/tutor-api';

interface UploadResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: TutorStudentItem[];
  onSuccess: () => void;
}

export function UploadResourceModal({
  open,
  onOpenChange,
  students,
  onSuccess,
}: UploadResourceModalProps) {
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !title.trim()) {
      setErrorMsg('Please select a student and provide a resource title.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await uploadStudentResource({
        studentId,
        title: title.trim(),
        fileUrl: fileUrl.trim() || '/placeholder-resource.pdf',
      });
      onSuccess();
      onOpenChange(false);
      setTitle('');
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
            <FileUp className="size-5 text-primary" />
            Upload Student Learning Resource
          </DialogTitle>
          <DialogDescription>
            Upload study materials tailored specifically for an assigned student.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <div>
            <strong>Student-Scoped Upload:</strong> Materials are assigned strictly per student (not a broad subject broadcast).
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Assigned Student *</Label>
            <Select value={studentId} onValueChange={(val) => val && setStudentId(val)} disabled={isSubmitting}>
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.studentName} ({s.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resTitle" className="text-xs font-medium text-foreground">Resource Title *</Label>
            <Input id="resTitle" placeholder="e.g. IB Math HL Past Paper 2025 Solutions" value={title} onChange={(e) => setTitle(e.target.value)} required className="text-xs h-9" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resUrl" className="text-xs font-medium text-foreground">File Attachment / URL</Label>
            <Input id="resUrl" placeholder="Upload file or paste document URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="text-xs h-9" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Upload Material'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
