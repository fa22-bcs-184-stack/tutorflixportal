'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LeadItem, updateLeadStatus } from '@/lib/api/scheduler-api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Phone, Calendar, UserCheck, AlertCircle, Clock } from 'lucide-react';

interface LeadKanbanCardProps {
  lead: LeadItem;
  onClick: () => void;
  onStatusChanged: () => void;
}

export function LeadKanbanCard({ lead, onClick, onStatusChanged }: LeadKanbanCardProps) {
  const isOverdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

  const handleStatusSelect = async (newStatus: string) => {
    try {
      await updateLeadStatus(lead.id, newStatus);
      onStatusChanged();
    } catch {
      // Ignore
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-2.5 rounded-xl border bg-card p-3.5 shadow-xs transition-all hover:shadow-md hover:border-primary/50 cursor-pointer ${
        isOverdue ? 'border-danger/50 bg-danger-subtle/10' : 'border-border'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {lead.studentName}
          </h4>
          <p className="text-xs text-muted-foreground">{lead.parentName}</p>
        </div>

        {/* Quick Move Status Selector */}
        <div onClick={(e) => e.stopPropagation()}>
          <Select value={lead.status} onValueChange={(val) => val && handleStatusSelect(val)}>
            <SelectTrigger className="h-6 px-1.5 text-[10px] bg-muted/40 border-0 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
              <SelectItem value="TRIAL_SCHEDULED">Trial Scheduled</SelectItem>
              <SelectItem value="TRIAL_DONE">Trial Done</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Curriculum & Subject Badges */}
      <div className="flex flex-wrap gap-1">
        {lead.preferredCurriculum && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium bg-muted/30">
            {lead.preferredCurriculum}
          </Badge>
        )}
        {lead.preferredSubject && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium border-primary/30 text-primary">
            {lead.preferredSubject}
          </Badge>
        )}
      </div>

      {/* Footer Info: Phone, Sales Member, Followup */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate">
          <Phone className="size-3 shrink-0" />
          <span className="truncate">{lead.parentPhone}</span>
        </div>

        {lead.salesMember?.name ? (
          <span className="text-[10px] font-medium text-foreground flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
            <UserCheck className="size-2.5" /> {lead.salesMember.name.split(' ')[0]}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground italic">No Sales Member</span>
        )}
      </div>

      {/* Overdue Followup Indicator */}
      {lead.nextFollowUpAt && (
        <div className={`text-[10px] font-medium flex items-center gap-1 px-2 py-0.5 rounded ${
          isOverdue ? 'bg-danger-subtle text-danger font-semibold' : 'bg-muted/40 text-muted-foreground'
        }`}>
          <Clock className="size-3" />
          <span>
            {isOverdue ? 'Overdue: ' : 'Follow-up: '}
            {new Date(lead.nextFollowUpAt).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
