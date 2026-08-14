'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Users } from 'lucide-react';
import { getStakeholderStudents, StakeholderStudentItem } from '@/lib/api/stakeholder-api';

export default function StakeholderStudentsPage() {
  const [students, setStudents] = useState<StakeholderStudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getStakeholderStudents();
        setStudents(data);
      } catch {
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Read-Only Students Roster"
        subtitle="Platform-wide student households and remaining lesson hours (read-only)."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Students' },
        ]}
      />

      <Panel title="Enrolled Student Households" description="Read-only view of student accounts">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Grade & Curriculum</th>
                  <th className="p-3">Parent Name</th>
                  <th className="p-3">Case Admin</th>
                  <th className="p-3 font-mono text-right">Remaining Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{st.studentName}</td>
                    <td className="p-3 text-muted-foreground">{st.grade} · {st.curriculum}</td>
                    <td className="p-3 font-medium text-foreground">{st.parentName}</td>
                    <td className="p-3 text-muted-foreground">{st.caseAdminName}</td>
                    <td className="p-3 font-bold text-foreground text-right">{st.remainingHours} hrs</td>
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
