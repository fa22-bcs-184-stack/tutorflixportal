'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { GraduationCap } from 'lucide-react';
import { getStakeholderTutors, StakeholderTutorItem } from '@/lib/api/stakeholder-api';

export default function StakeholderTutorsPage() {
  const [tutors, setTutors] = useState<StakeholderTutorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getStakeholderTutors();
        setTutors(data);
      } catch {
        setTutors([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Read-Only Tutors Roster"
        subtitle="Platform-wide shared tutor roster (read-only)."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Tutors' },
        ]}
      />

      <Panel title="Platform Tutors Roster" description="Read-only view of tutor accounts">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading tutors...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Tutor Name & Email</th>
                  <th className="p-3">Primary Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 font-mono text-right">Aggregate Snapshot Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tutors.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.email}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{t.subject}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-success-subtle text-success border-success/30 text-[10px]">
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-bold text-foreground">{t.ratingAggregate} / 5.0</td>
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
