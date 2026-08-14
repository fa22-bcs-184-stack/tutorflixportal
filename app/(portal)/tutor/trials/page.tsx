'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TrialFeedbackModal } from '@/components/tutor/trial-feedback-modal';
import { Award, Video, MessageSquare, CheckCircle2, RefreshCw } from 'lucide-react';
import { getTutorTrials, TutorTrialItem } from '@/lib/api/tutor-api';

export default function TutorTrialsPage() {
  const [trials, setTrials] = useState<TutorTrialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trial Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<TutorTrialItem | null>(null);

  const fetchTrials = async () => {
    setIsLoading(true);
    try {
      const data = await getTutorTrials();
      setTrials(data);
    } catch {
      setTrials([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleOpenFeedback = (trial: TutorTrialItem) => {
    setSelectedTrial(trial);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Trials"
        subtitle="Conduct assigned trial lessons, access Teams meeting links, and submit trial feedback."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'My Trials' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchTrials} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Trials
          </Button>
        }
      />

      <Panel title="Assigned Trial Lessons" description="Trial lessons assigned for demo instruction">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading trial lessons...
          </div>
        ) : trials.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Award className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Assigned Trials</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {trials.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{t.studentName}</span>
                      <span className="text-[11px] text-muted-foreground">({t.parentName})</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          t.status === 'TRIAL_DONE'
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-primary/10 text-primary border-primary/30'
                        }`}
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.subject} — {t.curriculum}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.teamsMeetingUrl && (
                      <a href={t.teamsMeetingUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/5">
                          <Video className="size-3.5" /> Join Teams Meeting
                        </Button>
                      </a>
                    )}

                    {t.status === 'SCHEDULED' && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenFeedback(t)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs h-8 gap-1.5"
                      >
                        <MessageSquare className="size-3.5" /> Submit Feedback
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground block">Collected Lead Requirements</span>
                  <p className="text-foreground text-xs">{t.timeNotes || 'Standard trial requirements'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Trial Feedback Modal */}
      {selectedTrial && (
        <TrialFeedbackModal
          open={feedbackModalOpen}
          onOpenChange={setFeedbackModalOpen}
          trialId={selectedTrial.id}
          studentName={selectedTrial.studentName}
          subject={selectedTrial.subject}
          onSuccess={fetchTrials}
        />
      )}
    </div>
  );
}
