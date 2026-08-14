'use client';

import React from 'react';
import { LeadItem } from '@/lib/api/scheduler-api';
import { LeadKanbanCard } from './lead-kanban-card';
import { Badge } from '@/components/ui/badge';

const COLUMNS: { id: LeadItem['status']; title: string; color: string }[] = [
  { id: 'NEW', title: 'New Leads', color: 'bg-info-subtle text-info border-info/30' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-info-subtle text-info border-info/30' },
  { id: 'FOLLOW_UP', title: 'Follow Up', color: 'bg-warning-subtle text-warning border-warning/30' },
  { id: 'TRIAL_SCHEDULED', title: 'Trial Scheduled', color: 'bg-info-subtle text-info border-info/30' },
  { id: 'TRIAL_DONE', title: 'Trial Done', color: 'bg-success-subtle text-success border-success/30' },
  { id: 'CONVERTED', title: 'Converted', color: 'bg-success-subtle text-success border-success/30' },
  { id: 'LOST', title: 'Lost', color: 'bg-danger-subtle text-danger border-danger/30' },
];

interface LeadKanbanBoardProps {
  leads: LeadItem[];
  onSelectLead: (leadId: string) => void;
  onLeadUpdated: () => void;
}

export function LeadKanbanBoard({ leads, onSelectLead, onLeadUpdated }: LeadKanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col.id);

        return (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-border/80 bg-muted/20 snap-start"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-border/60 p-3 bg-card/60 rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-bold text-foreground">
                  {col.title}
                </span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-semibold ${col.color}`}>
                  {colLeads.length}
                </Badge>
              </div>
            </div>

            {/* Column Cards Scroll Container */}
            <div className="flex flex-col gap-2.5 p-2.5 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto">
              {colLeads.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-6 text-center text-xs text-muted-foreground/60 italic border border-dashed border-border/60 rounded-lg">
                  No leads in {col.title.toLowerCase()}
                </div>
              ) : (
                colLeads.map((lead) => (
                  <LeadKanbanCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => onSelectLead(lead.id)}
                    onStatusChanged={onLeadUpdated}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
