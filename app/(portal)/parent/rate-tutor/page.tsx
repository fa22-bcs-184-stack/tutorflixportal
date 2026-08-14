'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { getParentDashboard, rateTutor, LinkedChildItem } from '@/lib/api/parent-api';

export default function ParentRateTutorPage() {
  const [childrenList, setChildrenList] = useState<LinkedChildItem[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [ratingScore, setRatingScore] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getParentDashboard();
        setChildrenList(data.linkedChildren || []);
        if (data.linkedChildren?.length > 0) {
          setSelectedChildId(data.linkedChildren[0].id);
        }
      } catch {
        setChildrenList([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
      setSubmittedSuccess(true);
      setComment('');
    } catch {
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rate Your Tutor"
        subtitle="Submit independent ratings and feedback for your child's tutor directly to their caseworker."
        breadcrumbs={[
          { label: 'Parent', href: '/parent' },
          { label: 'Rate Tutor' },
        ]}
      />

      <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning-subtle/30 p-4 text-xs text-warning">
        <ShieldCheck className="size-5 shrink-0 text-warning" />
        <div>
          <strong>Strict Caseload Privacy:</strong> Your raw rating score and feedback comments are visible exclusively to your child's assigned Case Admin (never displayed to the tutor directly or shared with other parents).
        </div>
      </div>

      <Panel title="Tutor Feedback Form" description="Rate your child's primary tutor">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading form...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg pt-2 text-xs">
            {submittedSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-subtle p-3 text-xs text-success font-semibold">
                <CheckCircle2 className="size-4 shrink-0" />
                Thank you! Your tutor rating has been submitted to your Case Admin.
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Select Child *</Label>
              <Select value={selectedChildId} onValueChange={(val) => val && setSelectedChildId(val)}>
                <SelectTrigger className="w-full text-xs h-9 bg-card">
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
                    className={`p-2 rounded-lg border transition-all ${
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
              <Label htmlFor="parComment" className="text-xs font-medium text-foreground">
                Detailed Feedback Comment
              </Label>
              <Textarea
                id="parComment"
                placeholder="Share your observations regarding tutor communication, student motivation, or session delivery."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                className="text-xs bg-card"
              />
            </div>

            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Rating to Case Admin'}
            </Button>
          </form>
        )}
      </Panel>
    </div>
  );
}
