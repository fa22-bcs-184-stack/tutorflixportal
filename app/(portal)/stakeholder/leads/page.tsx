'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Briefcase } from 'lucide-react';
import { getStakeholderLeads, StakeholderLeadItem } from '@/lib/api/stakeholder-api';

export default function StakeholderLeadsPage() {
  const [leads, setLeads] = useState<StakeholderLeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getStakeholderLeads();
        setLeads(data);
      } catch {
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Read-Only Leads Roster"
        subtitle="Platform-wide pipeline leads roster (read-only)."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Leads' },
        ]}
      />

      <Panel title="Platform Pipeline Leads" description="Read-only view of leads across all Intro Schedulers">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading leads...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Parent Name</th>
                  <th className="p-3">Curriculum & Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Scheduler</th>
                  <th className="p-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{l.studentName}</td>
                    <td className="p-3 text-muted-foreground">{l.parentName}</td>
                    <td className="p-3 font-medium">{l.curriculum} · {l.subject}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {l.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{l.assignedSchedulerName}</td>
                    <td className="p-3 text-muted-foreground">{l.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
