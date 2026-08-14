'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock, RefreshCw, Lock } from 'lucide-react';
import { getModerationFlags, reviewModerationFlag, MessageFlagItem } from '@/lib/api/admin-api';

export default function AdminModerationPage() {
  const [flags, setFlags] = useState<MessageFlagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchFlags = async () => {
    setIsLoading(true);
    try {
      const data = await getModerationFlags();
      setFlags(data);
    } catch {
      setFlags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const pendingFlags = flags.filter((f) => f.status === 'PENDING');
  const hasOverdueFlag = pendingFlags.some((f) => new Date(f.reviewDueAt) < new Date());
  const isLockedOut = pendingFlags.length > 5 || hasOverdueFlag;

  const handleReview = async (flagId: string, action: 'SAFE' | 'RED_ZONE') => {
    setIsSubmitting(flagId);
    try {
      await reviewModerationFlag(flagId, action);
      fetchFlags();
    } catch {
      // Local optimistic update
      setFlags((prev) =>
        prev.map((f) => (f.id === flagId ? { ...f, status: action } : f))
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Moderation Review Queue"
        subtitle="Review chat flags for your assigned caseload students. Resolve flags as Safe or Red Zone."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Moderation Review' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchFlags} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Flags
          </Button>
        }
      />

      {/* Admin Lockout Banner */}
      {isLockedOut && (
        <div className="rounded-xl border-2 border-danger bg-danger-subtle p-5 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-danger font-bold text-sm">
            <Lock className="size-5" /> ADMIN LOCKOUT ACTIVE — Immediate Review Required
          </div>
          <p className="text-xs text-foreground font-medium">
            Non-moderation portal features are restricted because your caseload has {pendingFlags.length > 5 ? 'more than 5 pending moderation flags' : 'a moderation flag overdue past 24 hours'}. Review and clear pending flags below to lift lockout.
          </p>
        </div>
      )}

      <Panel title="Pending Message Flags Queue" description="Flagged chat messages awaiting caseworker evaluation">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading moderation flags...
          </div>
        ) : pendingFlags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <CheckCircle2 className="size-8 text-success/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">Moderation Queue Clean</p>
            <p>No pending chat flags for your assigned caseload.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {pendingFlags.map((flag) => {
              const isOverdue = new Date(flag.reviewDueAt) < new Date();

              return (
                <div key={flag.id} className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{flag.studentName}</span>
                        <span className="text-[10px] text-muted-foreground">CONVERSATION #{flag.conversationId.substring(0, 8)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{flag.reason}</p>
                    </div>

                    <Badge className={`text-[10px] ${isOverdue ? 'bg-danger text-white' : 'bg-warning-subtle text-warning'}`}>
                      <Clock className="size-3 mr-1" />
                      {isOverdue ? 'OVERDUE' : `Due: ${new Date(flag.reviewDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </Badge>
                  </div>

                  {/* Flagged Content Preview */}
                  <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs text-foreground border border-border">
                    "{flag.flaggedContent}"
                  </div>

                  {/* Review Outcome Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReview(flag.id, 'SAFE')}
                      disabled={isSubmitting === flag.id}
                      className="text-xs border-success/40 text-success hover:bg-success-subtle"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" /> Mark Safe
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleReview(flag.id, 'RED_ZONE')}
                      disabled={isSubmitting === flag.id}
                      className="bg-danger text-white hover:bg-danger/90 text-xs font-semibold"
                    >
                      <ShieldAlert className="size-3.5 mr-1" /> Mark Red Zone
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
