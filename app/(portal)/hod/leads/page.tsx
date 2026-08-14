'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Briefcase, Search, Filter, ShieldCheck, RefreshCw } from 'lucide-react';
import { getAllLeads, HodLeadItem } from '@/lib/api/hod-api';

const KANBAN_COLUMNS: { key: HodLeadItem['status']; label: string; badge: string }[] = [
  { key: 'NEW', label: 'New Leads', badge: 'bg-primary/10 text-primary border-primary/30' },
  { key: 'CONTACTED', label: 'Contacted', badge: 'bg-info-subtle text-info border-info/30' },
  { key: 'FOLLOW_UP', label: 'Follow Up', badge: 'bg-warning-subtle text-warning border-warning/30' },
  { key: 'TRIAL_SCHEDULED', label: 'Trial Scheduled', badge: 'bg-cta/15 text-cta border-cta/30' },
  { key: 'TRIAL_DONE', label: 'Trial Done', badge: 'bg-primary/20 text-primary border-primary/40' },
  { key: 'CONVERTED', label: 'Converted', badge: 'bg-success-subtle text-success border-success/30' },
  { key: 'LOST', label: 'Lost', badge: 'bg-danger-subtle text-danger border-danger/30' },
];

export default function HodLeadsPage() {
  const [leads, setLeads] = useState<HodLeadItem[]>([]);
  const [search, setSearch] = useState('');
  const [schedulerFilter, setSchedulerFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch {
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      !search ||
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.parentName.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase());

    const matchesScheduler =
      schedulerFilter === 'ALL' || l.assignedSchedulerName === schedulerFilter;

    return matchesSearch && matchesScheduler;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Pipeline Oversight"
        subtitle="Platform-wide read-only oversight across every Intro Scheduler's lead conversion pipeline."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Lead Pipeline' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Pipeline
          </Button>
        }
      />

      {/* Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Read-Only Departmental Pipeline:</strong> HOD has platform-wide oversight across all Schedulers. Intro Schedulers manage their own assigned leads.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search student, parent, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={schedulerFilter} onValueChange={(val) => val && setSchedulerFilter(val)}>
            <SelectTrigger className="w-full sm:w-48 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Intro Schedulers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Schedulers</SelectItem>
              <SelectItem value="Elena Rostova">Elena Rostova</SelectItem>
              <SelectItem value="Tom Holland">Tom Holland</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Overview Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.status === col.key);

          return (
            <div key={col.key} className="rounded-xl border border-border bg-card p-3 space-y-2 flex flex-col min-w-[200px]">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-foreground text-xs">{col.label}</span>
                <Badge variant="outline" className={`text-[10px] font-bold ${col.badge}`}>
                  {colLeads.length}
                </Badge>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto max-h-[450px]">
                {colLeads.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic text-center py-6">No leads</p>
                ) : (
                  colLeads.map((lead) => (
                    <div key={lead.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-1 text-xs">
                      <div className="font-bold text-foreground">{lead.studentName}</div>
                      <div className="text-[10px] text-muted-foreground">{lead.subject} · {lead.curriculum}</div>
                      <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40 flex justify-between">
                        <span>Parent: {lead.parentName}</span>
                      </div>
                      <div className="text-[9px] font-semibold text-primary">
                        Scheduler: {lead.assignedSchedulerName}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
