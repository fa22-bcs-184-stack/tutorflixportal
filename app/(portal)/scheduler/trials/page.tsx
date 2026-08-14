'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Video, Clock, CheckCircle2, ShieldAlert, Copy } from 'lucide-react';
import { markTrialNotified, TrialItem } from '@/lib/api/scheduler-api';

const MOCK_TRIALS: TrialItem[] = [
  {
    id: 'trial-201',
    leadId: 'lead-104',
    tutorId: 'tut-1',
    subject: 'Economics HL',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'SCHEDULED',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/tutorflix-trial-9821a',
    tutorNotifiedAt: new Date().toISOString(),
    parentNotifiedAt: null,
    salesMemberNotifiedAt: null,
    tutor: { user: { fullName: 'Dr. Alan Turing' } },
    lead: { studentName: 'Ananya Roy', parentName: 'Vikram Roy', parentPhone: '+91 99887 76655' },
  },
  {
    id: 'trial-202',
    leadId: 'lead-105',
    tutorId: 'tut-2',
    subject: 'English Literature',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'TRIAL_DONE',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/tutorflix-trial-3312b',
    tutorNotifiedAt: new Date().toISOString(),
    parentNotifiedAt: new Date().toISOString(),
    salesMemberNotifiedAt: new Date().toISOString(),
    tutor: { user: { fullName: 'Prof. Ada Lovelace' } },
    lead: { studentName: 'Kabir Mehta', parentName: 'Sunil Mehta', parentPhone: '+91 95544 33221' },
  },
];

export default function SchedulerTrialsPage() {
  const [trials, setTrials] = useState<TrialItem[]>(MOCK_TRIALS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggleNotify = async (trialId: string, type: 'tutor' | 'parent' | 'sales', currentVal: boolean) => {
    setIsUpdating(trialId);
    try {
      const updated = await markTrialNotified(trialId, {
        tutorNotified: type === 'tutor' ? !currentVal : undefined,
        parentNotified: type === 'parent' ? !currentVal : undefined,
        salesMemberNotified: type === 'sales' ? !currentVal : undefined,
      });

      setTrials((prev) =>
        prev.map((t) =>
          t.id === trialId
            ? {
                ...t,
                tutorNotifiedAt: type === 'tutor' ? (!currentVal ? new Date().toISOString() : null) : t.tutorNotifiedAt,
                parentNotifiedAt: type === 'parent' ? (!currentVal ? new Date().toISOString() : null) : t.parentNotifiedAt,
                salesMemberNotifiedAt: type === 'sales' ? (!currentVal ? new Date().toISOString() : null) : t.salesMemberNotifiedAt,
              }
            : t
        )
      );
    } catch {
      // Local optimistic fallback update
      setTrials((prev) =>
        prev.map((t) =>
          t.id === trialId
            ? {
                ...t,
                tutorNotifiedAt: type === 'tutor' ? (!currentVal ? new Date().toISOString() : null) : t.tutorNotifiedAt,
                parentNotifiedAt: type === 'parent' ? (!currentVal ? new Date().toISOString() : null) : t.parentNotifiedAt,
                salesMemberNotifiedAt: type === 'sales' ? (!currentVal ? new Date().toISOString() : null) : t.salesMemberNotifiedAt,
              }
            : t
        )
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trials Management"
        subtitle="View scheduled trial lessons, Teams meeting links, and manual notification audit timestamps."
        breadcrumbs={[
          { label: 'Scheduler', href: '/scheduler' },
          { label: 'Trials' },
        ]}
      />

      <Panel title="Assigned Trial Lessons" description="Trial sessions scheduled across assigned leads">
        <div className="space-y-4 pt-2">
          {trials.map((trial) => (
            <div
              key={trial.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border"
            >
              {/* Left Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    {trial.lead?.studentName} — {trial.subject}
                  </h4>
                  <Badge className="text-[10px] font-semibold">
                    {trial.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Parent: <strong>{trial.lead?.parentName}</strong> ({trial.lead?.parentPhone})</span>
                  <span>Tutor: <strong>{trial.tutor?.user?.fullName}</strong></span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-primary" />
                    {new Date(trial.scheduledAt).toLocaleString()}
                  </span>
                </div>

                {/* Teams Meeting Link */}
                {trial.meetingLink && (
                  <div className="flex items-center gap-2 pt-1 max-w-md">
                    <Video className="size-3.5 text-primary shrink-0" />
                    <Input
                      readOnly
                      value={trial.meetingLink}
                      className="text-xs h-7 bg-muted/40 font-mono select-all"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyLink(trial.meetingLink!, trial.id)}
                      className="h-7 text-xs px-2 shrink-0"
                    >
                      {copiedId === trial.id ? <CheckCircle2 className="size-3 text-success" /> : <Copy className="size-3" />}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right: Manual Notification Timestamps */}
              <div className="space-y-2 lg:w-72 p-3 rounded-lg bg-muted/30 border border-border/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-[11px]">
                    Notification Timestamps
                  </span>
                  <span className="text-[9px] text-muted-foreground italic flex items-center gap-0.5">
                    <ShieldAlert className="size-2.5 text-warning" /> Off-platform
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`tut-${trial.id}`}
                        checked={!!trial.tutorNotifiedAt}
                        onCheckedChange={() => handleToggleNotify(trial.id, 'tutor', !!trial.tutorNotifiedAt)}
                        disabled={isUpdating === trial.id}
                      />
                      <label htmlFor={`tut-${trial.id}`} className="text-[11px] cursor-pointer">
                        Tutor Notified
                      </label>
                    </div>
                    {trial.tutorNotifiedAt && (
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {new Date(trial.tutorNotifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`par-${trial.id}`}
                        checked={!!trial.parentNotifiedAt}
                        onCheckedChange={() => handleToggleNotify(trial.id, 'parent', !!trial.parentNotifiedAt)}
                        disabled={isUpdating === trial.id}
                      />
                      <label htmlFor={`par-${trial.id}`} className="text-[11px] cursor-pointer">
                        Parent Notified
                      </label>
                    </div>
                    {trial.parentNotifiedAt && (
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {new Date(trial.parentNotifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`sal-${trial.id}`}
                        checked={!!trial.salesMemberNotifiedAt}
                        onCheckedChange={() => handleToggleNotify(trial.id, 'sales', !!trial.salesMemberNotifiedAt)}
                        disabled={isUpdating === trial.id}
                      />
                      <label htmlFor={`sal-${trial.id}`} className="text-[11px] cursor-pointer">
                        Sales Member Notified
                      </label>
                    </div>
                    {trial.salesMemberNotifiedAt && (
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {new Date(trial.salesMemberNotifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
