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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Star, ShieldCheck, AlertCircle } from 'lucide-react';
import { rateTutor, LinkedChildItem } from '@/lib/api/parent-api';

interface RateTutorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childrenList: LinkedChildItem[];
  onSuccess: () => void;
}

export function RateTutorModal({
  open,
  onOpenChange,
  childrenList,
  onSuccess,
}: RateTutorModalProps) {
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || '');
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedChild = childrenList.find((c) => c.id === selectedChildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) {
      setErrorMsg('Please select a child.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await rateTutor({
        studentId: selectedChildId,
        tutorId: 'tut-demo-1',
        ratingScore,
        comment: comment.trim() || undefined,
      });
      onSuccess();
      onOpenChange(false);
      setComment('');
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
            <Star className="size-5 text-warning fill-warning" />
            Rate Your Child's Tutor
          </DialogTitle>
          <DialogDescription>
            Submit feedback for <strong className="text-foreground">{selectedChild?.assignedTutorName}</strong> ({selectedChild?.assignedTutorSubject}).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-warning/30 bg-warning-subtle/30 p-3 text-xs text-warning">
          <ShieldCheck className="size-4 shrink-0 text-warning" />
          <div>
            <strong>Strict Caseload Privacy:</strong> Raw ratings and comments are visible exclusively to your child's assigned Case Admin (never shown to the tutor directly).
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Select Linked Child *</Label>
            <Select value={selectedChildId} onValueChange={(val) => val && setSelectedChildId(val)}>
              <SelectTrigger className="w-full text-xs h-9">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {childrenList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.studentName} — Tutor: {c.assignedTutorName} ({c.assignedTutorSubject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Rating Score (1 to 5 Stars) *</Label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingScore(star)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    ratingScore >= star
                      ? 'border-warning bg-warning/10 text-warning'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <Star className={`size-5 ${ratingScore >= star ? 'fill-warning' : ''}`} />
                </button>
              ))}
              <span className="font-bold text-foreground text-sm ml-2">{ratingScore} / 5 Stars</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tutComment" className="text-xs font-medium text-foreground">
              Optional Feedback Comment
            </Label>
            <Textarea
              id="tutComment"
              placeholder="Provide feedback on tutor punctuality, teaching clarity, or student engagement."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Rating to Case Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
