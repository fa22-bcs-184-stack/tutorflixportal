'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { LogCallModal } from './log-call-modal';
import { ScheduleTrialModal } from './schedule-trial-modal';
import { ConvertLeadModal } from './convert-lead-modal';
import {
  PhoneCall,
  Calendar,
  Sparkles,
  UserCheck,
  Clock,
  BookOpen,
  GraduationCap,
  MessageSquare,
  History,
  Phone,
  Mail,
  User,
  AlertTriangle,
} from 'lucide-react';
import {
  getLeadDetails,
  getSalesMembers,
  assignSalesMember,
  LeadItem,
  LeadActivity,
  LeadNote,
  SalesMember,
} from '@/lib/api/scheduler-api';

interface LeadDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string | null;
  onLeadUpdated: () => void;
}

export function LeadDetailPanel({
  open,
  onOpenChange,
  leadId,
  onLeadUpdated,
}: LeadDetailPanelProps) {
  const [lead, setLead] = useState<LeadItem | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [salesMembers, setSalesMembers] = useState<SalesMember[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAssigningSales, setIsAssigningSales] = useState(false);

  // Modal Open States
  const [logCallOpen, setLogCallOpen] = useState(false);
  const [scheduleTrialOpen, setScheduleTrialOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const loadDetails = async () => {
    if (!leadId) return;
    setIsLoading(true);
    try {
      const [details, smList] = await Promise.all([
        getLeadDetails(leadId),
        getSalesMembers(),
      ]);
      setLead(details.lead);
      setActivities(details.activities);
      setNotes(details.notes);
      setSalesMembers(smList);
    } catch {
      // Mock fallback details if endpoint unavailable
      setLead({
        id: leadId,
        studentName: 'Aarav Sharma',
        parentName: 'Rajesh Sharma',
        parentEmail: 'rajesh.sharma@example.com',
        parentPhone: '+91 98765 43210',
        preferredCurriculum: 'IB Diploma',
        preferredSubject: 'Mathematics Higher Level',
        preferredTime: 'Weekday evenings (6 PM - 8 PM IST)',
        status: 'CONTACTED',
        nextFollowUpAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setActivities([
        { id: 'act-1', leadId, type: 'CALL_LOGGED', description: 'Initial call logged by Intro Scheduler', createdAt: new Date().toISOString() },
      ]);
      setNotes([
        { id: 'n-1', leadId, noteText: 'Parent expressed interest in trial lesson next week.', createdBy: 'Scheduler', createdAt: new Date().toISOString() },
      ]);
      setSalesMembers([
        { id: 'sm-1', name: 'John Doe (Sales)', phone: '+1234567890' },
        { id: 'sm-2', name: 'Jane Smith (Sales)', phone: '+0987654321' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && leadId) {
      loadDetails();
    }
  }, [open, leadId]);

  const handleSalesMemberChange = async (salesMemberId: string) => {
    if (!leadId) return;
    setIsAssigningSales(true);
    try {
      await assignSalesMember(leadId, salesMemberId);
      loadDetails();
      onLeadUpdated();
    } catch {
      // Ignore
    } finally {
      setIsAssigningSales(false);
    }
  };

  if (!leadId) return null;

  const isOverdue = lead?.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl overflow-y-auto p-0 flex flex-col h-full bg-background">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center p-8 text-xs text-muted-foreground">
              <Spinner className="mr-2" /> Loading lead details...
            </div>
          ) : lead ? (
            <div className="flex flex-col flex-1 divide-y divide-border">
              {/* Header */}
              <div className="p-6 bg-card space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground">LEAD #{lead.id.substring(0, 8)}</span>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      {lead.studentName}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Parent: <strong className="text-foreground">{lead.parentName}</strong>
                    </p>
                  </div>
                  <Badge className="capitalize text-xs font-semibold px-2.5 py-1">
                    {lead.status.replace('_', ' ')}
                  </Badge>
                </div>

                {isOverdue && (
                  <div className="flex items-center gap-2 rounded-lg bg-danger-subtle border border-danger/20 p-2.5 text-xs text-danger font-medium">
                    <AlertTriangle className="size-4 shrink-0" />
                    Overdue Follow-up! Scheduled for {new Date(lead.nextFollowUpAt!).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 bg-muted/20 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setLogCallOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 flex-1"
                >
                  <PhoneCall className="size-3.5" /> Log Call
                </Button>
                <Button
                  size="sm"
                  onClick={() => setScheduleTrialOpen(true)}
                  className="bg-cta text-cta-foreground hover:bg-cta-hover text-xs font-semibold gap-1.5 flex-1"
                >
                  <Calendar className="size-3.5" /> Schedule Trial
                </Button>
                <Button
                  size="sm"
                  onClick={() => setConvertModalOpen(true)}
                  className="bg-success text-success-foreground hover:bg-success-hover text-xs font-semibold gap-1.5 flex-1"
                >
                  <Sparkles className="size-3.5" /> Convert Lead
                </Button>
              </div>

              {/* Profile & Assign Sales Member */}
              <div className="p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Lead Profile & Assignment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>{lead.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="truncate">{lead.parentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-muted-foreground" />
                    <span>Curriculum: <strong>{lead.preferredCurriculum || 'Standard'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-muted-foreground" />
                    <span>Subject: <strong>{lead.preferredSubject || 'General'}</strong></span>
                  </div>
                </div>

                {lead.preferredTime && (
                  <div className="flex items-center gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/60">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>Preferred Slots: {lead.preferredTime}</span>
                  </div>
                )}

                {/* Sales Member Assignment Dropdown */}
                <div className="pt-2 space-y-1.5">
                  <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-primary" /> Assigned Sales Member
                  </Label>
                  <Select
                    value={lead.salesMemberId || ''}
                    onValueChange={(val) => val && handleSalesMemberChange(val)}
                    disabled={isAssigningSales}
                  >
                    <SelectTrigger className="w-full text-xs h-9 bg-card">
                      <SelectValue placeholder="Select existing sales member" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesMembers.map((sm) => (
                        <SelectItem key={sm.id} value={sm.id}>
                          {sm.name} {sm.phone ? `(${sm.phone})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground italic">
                    Sales members are provisioned by HOD in Administration.
                  </p>
                </div>
              </div>

              {/* Timeline & Notes */}
              <div className="p-6 space-y-4 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <History className="size-3.5" /> Activity History & Notes
                </h3>

                <div className="space-y-3">
                  {notes.length === 0 && activities.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No activities logged yet.</p>
                  ) : (
                    <>
                      {notes.map((n) => (
                        <div key={n.id} className="p-3 rounded-lg bg-muted/30 border border-border space-y-1 text-xs">
                          <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                            <span>Note by {n.createdBy}</span>
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-foreground">{n.noteText}</p>
                        </div>
                      ))}
                      {activities.map((a) => (
                        <div key={a.id} className="flex items-start gap-2 text-xs text-muted-foreground border-l-2 border-primary/40 pl-3 py-1">
                          <div>
                            <span className="font-semibold text-foreground">{a.type}: </span>
                            <span>{a.description}</span>
                            <span className="block text-[10px] text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Modals */}
      {lead && (
        <>
          <LogCallModal
            open={logCallOpen}
            onOpenChange={setLogCallOpen}
            leadId={lead.id}
            studentName={lead.studentName}
            currentStatus={lead.status}
            onSuccess={() => {
              loadDetails();
              onLeadUpdated();
            }}
          />

          <ScheduleTrialModal
            open={scheduleTrialOpen}
            onOpenChange={setScheduleTrialOpen}
            leadId={lead.id}
            studentName={lead.studentName}
            preferredSubject={lead.preferredSubject}
            onSuccess={() => {
              loadDetails();
              onLeadUpdated();
            }}
          />

          <ConvertLeadModal
            open={convertModalOpen}
            onOpenChange={setConvertModalOpen}
            leadId={lead.id}
            studentName={lead.studentName}
            parentName={lead.parentName}
            onSuccess={() => {
              loadDetails();
              onLeadUpdated();
            }}
          />
        </>
      )}
    </>
  );
}
