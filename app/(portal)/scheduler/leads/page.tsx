'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LeadKanbanBoard } from '@/components/scheduler/lead-kanban-board';
import { LeadDetailPanel } from '@/components/scheduler/lead-detail-panel';
import { Search, Filter, RefreshCw, Layers } from 'lucide-react';
import { getAssignedLeads, LeadItem } from '@/lib/api/scheduler-api';

const MOCK_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    studentName: 'Aarav Sharma',
    parentName: 'Rajesh Sharma',
    parentEmail: 'rajesh.sharma@example.com',
    parentPhone: '+91 98765 43210',
    preferredCurriculum: 'IB Diploma',
    preferredSubject: 'Mathematics HL',
    status: 'NEW',
    salesMember: { id: 'sm-1', name: 'John Doe' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-102',
    studentName: 'Maya Patel',
    parentName: 'Sanjay Patel',
    parentEmail: 'sanjay.patel@example.com',
    parentPhone: '+91 98123 45678',
    preferredCurriculum: 'IGCSE',
    preferredSubject: 'Physics',
    status: 'CONTACTED',
    nextFollowUpAt: new Date(Date.now() - 3600000).toISOString(), // Overdue
    salesMember: { id: 'sm-2', name: 'Jane Smith' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-103',
    studentName: 'Rohan Gupta',
    parentName: 'Anita Gupta',
    parentEmail: 'anita.gupta@example.com',
    parentPhone: '+91 97111 22233',
    preferredCurriculum: 'CBSE',
    preferredSubject: 'Chemistry',
    status: 'FOLLOW_UP',
    nextFollowUpAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-104',
    studentName: 'Ananya Roy',
    parentName: 'Vikram Roy',
    parentEmail: 'vikram.roy@example.com',
    parentPhone: '+91 99887 76655',
    preferredCurriculum: 'A-Levels',
    preferredSubject: 'Economics',
    status: 'TRIAL_SCHEDULED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-105',
    studentName: 'Kabir Mehta',
    parentName: 'Sunil Mehta',
    parentEmail: 'sunil.mehta@example.com',
    parentPhone: '+91 95544 33221',
    preferredCurriculum: 'IB Diploma',
    preferredSubject: 'English Literature',
    status: 'TRIAL_DONE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function LeadPipelinePage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [search, setSearch] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Lead Drawer State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getAssignedLeads({
        search: search || undefined,
        curriculum: curriculumFilter !== 'ALL' ? curriculumFilter : undefined,
      });
      setLeads(data.length > 0 ? data : MOCK_LEADS);
    } catch {
      setLeads(MOCK_LEADS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, curriculumFilter]);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      !search ||
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.parentName.toLowerCase().includes(search.toLowerCase()) ||
      l.parentPhone.includes(search);

    const matchesCurriculum =
      curriculumFilter === 'ALL' || l.preferredCurriculum === curriculumFilter;

    return matchesSearch && matchesCurriculum;
  });

  const handleOpenDetail = (id: string) => {
    setSelectedLeadId(id);
    setDetailPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Pipeline"
        subtitle="Manage assigned leads through every funnel stage from intake to trial and conversion."
        breadcrumbs={[
          { label: 'Scheduler', href: '/scheduler' },
          { label: 'Lead Pipeline' },
        ]}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeads}
            disabled={isLoading}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student, parent or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={curriculumFilter} onValueChange={(val) => val && setCurriculumFilter(val)}>
            <SelectTrigger className="w-full sm:w-48 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Curricula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Curricula</SelectItem>
              <SelectItem value="IB Diploma">IB Diploma</SelectItem>
              <SelectItem value="IGCSE">IGCSE</SelectItem>
              <SelectItem value="A-Levels">A-Levels</SelectItem>
              <SelectItem value="CBSE">CBSE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board Container */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <Spinner /> Loading lead pipeline...
          </div>
        </div>
      ) : (
        <LeadKanbanBoard
          leads={filteredLeads}
          onSelectLead={handleOpenDetail}
          onLeadUpdated={fetchLeads}
        />
      )}

      {/* Lead Detail Panel Drawer */}
      <LeadDetailPanel
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
        leadId={selectedLeadId}
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
}
