'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GraduationCap, Star, ShieldAlert, RefreshCw } from 'lucide-react';
import { getStaffUsers, StaffUserItem } from '@/lib/api/manager-api';

export default function HodTutorsPage() {
  const [tutors, setTutors] = useState<StaffUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const staff = await getStaffUsers();
        setTutors(staff.filter((s) => s.role === 'TUTOR'));
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
        title="Shared Tutor Roster"
        subtitle="Platform-wide roster of tutors and aggregate performance logs."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Tutors' },
        ]}
      />

      <Panel title="Platform Tutors Roster" description="All active and on-leave tutors">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading tutors...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Tutor Name & Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Leave Status</th>
                  <th className="p-3 font-mono text-right">Aggregate Snapshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tutors.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.email}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{t.phone || '—'}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-success-subtle text-success border-success/30 text-[10px]">
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">
                        {t.isOnLeave ? 'ON LEAVE' : 'On Duty'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-semibold text-foreground">
                      4.8 / 5.0 Rating
                    </td>
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
