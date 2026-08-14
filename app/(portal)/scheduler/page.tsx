'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  PhoneCall,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Phone,
  CalendarPlus,
  Target,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogCallModal } from '@/components/scheduler/log-call-modal';
import { LeadDetailPanel } from '@/components/scheduler/lead-detail-panel';
import { getAssignedLeads, LeadItem } from '@/lib/api/scheduler-api';

// ── Status display helpers ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LeadItem['status'],
  { label: string; accent: string; color: string }
> = {
  NEW:              { label: 'New',            accent: 'chart-1', color: 'bg-info-subtle text-info' },
  CONTACTED:        { label: 'Contacted',      accent: 'chart-1', color: 'bg-primary/10 text-primary' },
  FOLLOW_UP:        { label: 'Follow Up',      accent: 'chart-4', color: 'bg-warning-subtle text-warning' },
  TRIAL_SCHEDULED:  { label: 'Trial Booked',   accent: 'chart-3', color: 'bg-success-subtle text-success' },
  TRIAL_DONE:       { label: 'Trial Done',     accent: 'chart-2', color: 'bg-success-subtle text-success' },
  CONVERTED:        { label: 'Converted',      accent: 'chart-2', color: 'bg-success-subtle text-success' },
  LOST:             { label: 'Lost',           accent: 'chart-5', color: 'bg-danger-subtle text-danger' },
};

// ── Funnel stages ordered for the pipeline bar ───────────────────────────────

const FUNNEL_STAGES: Array<{ key: LeadItem['status']; label: string; color: string }> = [
  { key: 'NEW',             label: 'New',           color: 'var(--color-info)' },
  { key: 'CONTACTED',       label: 'Contacted',     color: 'var(--color-primary)' },
  { key: 'FOLLOW_UP',       label: 'Follow Up',     color: 'var(--color-warning)' },
  { key: 'TRIAL_SCHEDULED', label: 'Trial Booked',  color: 'var(--color-success)' },
  { key: 'TRIAL_DONE',      label: 'Trial Done',    color: 'var(--color-chart-2)' },
  { key: 'CONVERTED',       label: 'Converted',     color: 'var(--color-chart-3)' },
];

// ── Initials helper ───────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SchedulerDashboard() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [logCallOpen, setLogCallOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAssignedLeads();
      setLeads(data);
    } catch {
      // Fallback mock data
      setLeads([
        {
          id: 'lead-101',
          studentName: 'Aarav Sharma',
          parentName: 'Rajesh Sharma',
          parentEmail: 'rajesh@example.com',
          parentPhone: '+91 98765 43210',
          preferredCurriculum: 'IB Diploma',
          preferredSubject: 'Mathematics HL',
          status: 'NEW',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead-102',
          studentName: 'Maya Patel',
          parentName: 'Sanjay Patel',
          parentEmail: 'sanjay@example.com',
          parentPhone: '+91 98123 45678',
          preferredCurriculum: 'IGCSE',
          preferredSubject: 'Physics',
          status: 'CONTACTED',
          nextFollowUpAt: new Date(Date.now() - 3_600_000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead-103',
          studentName: 'Rohan Gupta',
          parentName: 'Anita Gupta',
          parentEmail: 'anita@example.com',
          parentPhone: '+91 97111 22233',
          preferredCurriculum: 'CBSE',
          preferredSubject: 'Chemistry',
          status: 'FOLLOW_UP',
          nextFollowUpAt: new Date(Date.now() + 86_400_000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead-104',
          studentName: 'Zara Hussain',
          parentName: 'Fatima Hussain',
          parentEmail: 'fatima@example.com',
          parentPhone: '+91 96000 11223',
          preferredCurriculum: 'A-Level',
          preferredSubject: 'Biology',
          status: 'TRIAL_SCHEDULED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead-105',
          studentName: 'Liam Chen',
          parentName: 'Wei Chen',
          parentEmail: 'wei@example.com',
          parentPhone: '+91 95500 66778',
          preferredCurriculum: 'IB Diploma',
          preferredSubject: 'Economics',
          status: 'CONVERTED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead-106',
          studentName: 'Sofia Nair',
          parentName: 'Priya Nair',
          parentEmail: 'priya.n@example.com',
          parentPhone: '+91 94400 33445',
          preferredCurriculum: 'IGCSE',
          preferredSubject: 'English Literature',
          status: 'TRIAL_DONE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Counts ──────────────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    new:             leads.filter((l) => l.status === 'NEW').length,
    contacted:       leads.filter((l) => l.status === 'CONTACTED').length,
    followUp:        leads.filter((l) => l.status === 'FOLLOW_UP').length,
    trialScheduled:  leads.filter((l) => l.status === 'TRIAL_SCHEDULED').length,
    trialDone:       leads.filter((l) => l.status === 'TRIAL_DONE').length,
    converted:       leads.filter((l) => l.status === 'CONVERTED').length,
    total:           leads.length,
  }), [leads]);

  const overdueLeads = useMemo(
    () => leads.filter((l) => l.nextFollowUpAt && new Date(l.nextFollowUpAt) < new Date()),
    [leads],
  );

  const conversionRate = counts.total > 0
    ? Math.round((counts.converted / counts.total) * 100)
    : 0;

  const stageHealth = useMemo(() => {
    const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return FUNNEL_STAGES.map((stage) => {
      const stageLeads = leads.filter((lead) => lead.status === stage.key);
      const stuckLeads = stageLeads.filter((lead) => new Date(lead.updatedAt || lead.createdAt).getTime() < cutoff);
      return {
        ...stage,
        count: stageLeads.length,
        stuck: stuckLeads.length,
        oldest: stuckLeads.sort((a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime())[0],
      };
    }).filter((stage) => stage.count > 0 || stage.stuck > 0);
  }, [leads]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleLogCall = (lead: LeadItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setLogCallOpen(true);
  };

  const handleOpenDetail = (id: string) => {
    setSelectedLeadId(id);
    setDetailOpen(true);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-7">

      {/* ── Page header ── */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-primary p-6 text-primary-foreground shadow-[0_18px_50px_-28px_oklch(0.45_0.2_245)] sm:p-8">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
              <span className="size-1.5 rounded-full bg-sky-200" />
              Intro Scheduler
            </div>
            <h1 className="max-w-xl text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl">
              Keep every intro moving forward.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-primary-foreground/72">
              {isLoading ? 'Loading your leads…' : `${counts.total} leads in your pipeline · ${counts.followUp} follow-ups due · ${conversionRate}% conversion rate`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" render={<Link href="/scheduler/trials" />}>
              <Calendar className="size-3.5" />
              Trials
            </Button>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" size="sm" render={<Link href="/scheduler/leads" />}>
              <Users className="size-3.5" />
              Open pipeline
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Overdue banner ── */}
      {overdueLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-danger/30 bg-danger-subtle p-4"
        >
          {/* top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-danger/40" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-danger">
                  {overdueLeads.length} overdue follow-up{overdueLeads.length > 1 ? 's' : ''}
                </p>
                <p className="mt-0.5 text-xs text-danger/70">
                  These leads need immediate action — callbacks are past due.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-xs text-danger hover:bg-danger/10"
              render={<Link href="/scheduler/leads?status=FOLLOW_UP" />}
            >
                View all <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {overdueLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleOpenDetail(lead.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-card px-3 py-2.5 transition-all hover:border-danger/40 hover:shadow-sm cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {lead.studentName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.parentName} · {lead.parentPhone}
                  </p>
                  <p className="mt-0.5 text-[0.68rem] font-medium text-danger">
                    Due {new Date(lead.nextFollowUpAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleLogCall(lead, e)}
                  className="shrink-0 border-danger/30 text-danger hover:bg-danger/10 text-xs"
                >
                  <Phone className="size-3" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Stat cards ── */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <StatCard
          label="Total leads"
          value={String(counts.total)}
          delta={counts.total > 0 ? `+${counts.new} new` : undefined}
          icon={Users}
          accent="chart-1"
          hint="In your assigned pipeline"
        />
        <StatCard
          label="Follow-ups due"
          value={String(counts.followUp)}
          icon={Clock}
          accent="chart-4"
          hint={overdueLeads.length > 0 ? `${overdueLeads.length} overdue` : 'All on schedule'}
        />
        <StatCard
          label="Trials booked"
          value={String(counts.trialScheduled + counts.trialDone)}
          delta={counts.trialScheduled > 0 ? `${counts.trialScheduled} upcoming` : undefined}
          icon={CalendarPlus}
          accent="chart-3"
          hint="Scheduled + completed"
        />
        <StatCard
          label="Converted"
          value={String(counts.converted)}
          delta={counts.total > 0 ? `${conversionRate}%` : undefined}
          icon={Target}
          accent="chart-2"
          hint="New students enrolled"
        />
      </motion.div>

      {/* ── Pipeline funnel + quick actions ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">

        {/* Funnel bar — 2/3 width */}
        <Panel
          title="Lead funnel"
          description="Distribution of leads across pipeline stages"
          className="lg:col-span-2"
          action={
            <Button variant="ghost" size="sm" render={<Link href="/scheduler/leads" />}>
                Full pipeline <ArrowRight className="size-3.5" />
              </Button>
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {FUNNEL_STAGES.map((stage) => {
                const count = leads.filter((l) => l.status === stage.key).length;
                const pct = counts.total > 0 ? Math.round((count / counts.total) * 100) : 0;
                return (
                  <div key={stage.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ background: stage.color }}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {stage.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                        <span className="w-6 text-right text-sm font-bold text-foreground">
                          {count}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: stage.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Summary row */}
              <div className="mt-1 flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4 text-primary" />
                  <span>Conversion rate</span>
                </div>
                <span className="text-sm font-bold text-primary">{conversionRate}%</span>
              </div>
            </div>
          )}
        </Panel>

        {/* Stage health — 1/3 width */}
        <Panel
          title="Stage health"
          description="Where the pipeline is getting stuck"
          className="lg:col-span-1"
          action={<Badge variant="outline" className="gap-1.5 border-warning/30 bg-warning-subtle text-warning"><span className="size-1.5 rounded-full bg-warning" />3+ days</Badge>}
        >
          <div className="flex flex-col gap-3">
            {stageHealth.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-5 text-center">
                <CheckCircle2 className="mx-auto size-5 text-success" />
                <p className="mt-2 text-sm font-medium text-foreground">Nothing is stuck</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Every active lead has moved within the last three days.</p>
              </div>
            ) : stageHealth.map((stage) => {
              const isStuck = stage.stuck > 0;
              return (
                <div key={stage.key} className={`flex items-center gap-3 rounded-xl border p-3 ${isStuck ? 'border-warning/25 bg-warning-subtle/45' : 'border-border/60 bg-muted/25'}`}>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklch, ${stage.color} 14%, transparent)`, color: stage.color }}>
                    {isStuck ? <AlertTriangle className="size-4" /> : <Activity className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{stage.label}</p>
                      <span className="text-xs font-semibold text-muted-foreground">{stage.count} total</span>
                    </div>
                    <p className={`mt-0.5 text-xs ${isStuck ? 'font-medium text-warning' : 'text-muted-foreground'}`}>
                      {isStuck ? `${stage.stuck} ${stage.stuck === 1 ? 'lead' : 'leads'} stuck` : 'Moving normally'}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">Blocked leads</span>
              <span className="text-sm font-bold text-warning">{stageHealth.reduce((total, stage) => total + stage.stuck, 0)}</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Today's leads + recent activity ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Leads list */}
        <Panel
          title="Your leads"
          description="Most recent leads in your pipeline"
          action={
            <Button variant="ghost" size="sm" render={<Link href="/scheduler/leads" />}>
                All leads <ArrowRight className="size-3.5" />
              </Button>
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          ) : leads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No leads assigned yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {leads.slice(0, 5).map((lead, i) => {
                const cfg = STATUS_CONFIG[lead.status];
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    onClick={() => handleOpenDetail(lead.id)}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer"
                  >
                    {/* Avatar */}
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback
                        className="rounded-xl text-xs font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, var(--color-${cfg.accent}), color-mix(in oklch, var(--color-${cfg.accent}) 70%, var(--color-primary)))`,
                        }}
                      >
                        {initials(lead.studentName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {lead.studentName}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {lead.parentName} · {lead.preferredCurriculum} — {lead.preferredSubject}
                      </p>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleLogCall(lead, e)}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-xs"
                    >
                      <PhoneCall className="size-3.5" />
                      Call
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Recent activity feed */}
        <Panel
          title="Recent activity"
          description="Latest events across your pipeline"
          action={
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Synthesize feed from leads data */}
              {leads.slice(0, 6).map((lead, i) => {
                const cfg = STATUS_CONFIG[lead.status];
                const eventText = lead.status === 'NEW'
                  ? `New lead: ${lead.studentName} submitted trial request`
                  : lead.status === 'CONTACTED'
                  ? `${lead.studentName} contacted — awaiting parent response`
                  : lead.status === 'FOLLOW_UP'
                  ? `Follow-up scheduled for ${lead.studentName}`
                  : lead.status === 'TRIAL_SCHEDULED'
                  ? `Trial booked for ${lead.studentName} (${lead.preferredSubject})`
                  : lead.status === 'TRIAL_DONE'
                  ? `Trial completed for ${lead.studentName} — awaiting conversion`
                  : lead.status === 'CONVERTED'
                  ? `${lead.studentName} converted to student ✓`
                  : `${lead.studentName} marked as lost`;

                const feedIcon =
                  lead.status === 'NEW' ? Sparkles :
                  lead.status === 'CONTACTED' ? PhoneCall :
                  lead.status === 'FOLLOW_UP' ? Clock :
                  lead.status === 'TRIAL_SCHEDULED' ? CalendarPlus :
                  lead.status === 'TRIAL_DONE' ? CheckCircle2 :
                  lead.status === 'CONVERTED' ? Target : Activity;

                const FeedIcon = feedIcon;

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: `color-mix(in oklch, var(--color-${cfg.accent}) 14%, transparent)`,
                        color: `var(--color-${cfg.accent})`,
                      }}
                    >
                      <FeedIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug text-foreground">{eventText}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {lead.preferredCurriculum} · {new Date(lead.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {leads.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activity yet.
                </p>
              )}
            </div>
          )}
        </Panel>
      </div>

      {/* ── Modals ── */}
      {selectedLead && (
        <LogCallModal
          open={logCallOpen}
          onOpenChange={setLogCallOpen}
          leadId={selectedLead.id}
          studentName={selectedLead.studentName}
          currentStatus={selectedLead.status}
          onSuccess={loadData}
        />
      )}

      <LeadDetailPanel
        open={detailOpen}
        onOpenChange={setDetailOpen}
        leadId={selectedLeadId}
        onSuccess={loadData}
      />
    </div>
  );
}
