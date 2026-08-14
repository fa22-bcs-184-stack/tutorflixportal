'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { getModerationOversight, ModerationOversightItem } from '@/lib/api/manager-api';

export default function ManagerModerationOversightPage() {
  const [feed, setFeed] = useState<ModerationOversightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOversight = async () => {
    setIsLoading(true);
    try {
      const data = await getModerationOversight();
      setFeed(data);
    } catch {
      setFeed([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOversight();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins Moderation Oversight"
        subtitle="Monitor platform-wide moderation flag reviews and help clear admin moderation backlogs."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Moderation Oversight' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchOversight} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Oversight
          </Button>
        }
      />

      {/* Backlog Alert Box */}
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 space-y-2 text-xs text-foreground">
        <div className="flex items-center gap-2 font-bold text-sm text-warning">
          <AlertTriangle className="size-4" /> Moderation Backlog Overflow Policy
        </div>
        <p className="text-muted-foreground">
          If any Admin caseworker accumulates more than 5 pending moderation flags at once or permits any flag to remain unreviewed past 24 hours (`review_due_at`), all overflow flags trigger alerts here so Admin Manager can assist in clearing backlogs.
        </p>
      </div>

      <Panel title="Platform Moderation Audit Trail" description="History of reviewed message safety flags across all admins">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading moderation feed...
          </div>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <ShieldAlert className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Reviewed Flags Found</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {feed.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <span className="font-bold text-foreground text-sm">{item.studentName}</span>
                    <span className="text-[11px] text-muted-foreground ml-2">Tutor: {item.tutorName}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      item.outcome === 'SAFE'
                        ? 'bg-success-subtle text-success border-success/30'
                        : 'bg-danger-subtle text-danger border-danger/30'
                    }`}
                  >
                    {item.outcome}
                  </Badge>
                </div>

                <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border font-mono text-[11px]">
                  "{item.messageSnippet}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                  <span>Reviewed by Case Admin: <strong className="text-foreground">{item.reviewingAdminName}</strong></span>
                  <span>{new Date(item.reviewedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
