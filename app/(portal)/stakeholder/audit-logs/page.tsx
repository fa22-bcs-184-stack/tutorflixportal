'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ShieldCheck } from 'lucide-react';
import { getStakeholderAuditLogs, StakeholderAuditLogItem } from '@/lib/api/stakeholder-api';

export default function StakeholderAuditLogsPage() {
  const [logs, setLogs] = useState<StakeholderAuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getStakeholderAuditLogs();
        setLogs(data);
      } catch {
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unrestricted Platform Audit Logs"
        subtitle="Executive read-only audit log trail covering Admins, Schedulers, HODs, and Managers."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Audit Logs' },
        ]}
      />

      <Panel title="Platform-Wide System Audit Trail" description="Unrestricted immutable event logs">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading audit trail...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Actor Name & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Target ID</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-sans font-bold text-foreground">
                      {l.actorName} <span className="text-muted-foreground font-normal">({l.actorRole})</span>
                    </td>
                    <td className="p-3 font-semibold text-primary">{l.action}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">
                        {l.module}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{l.targetId || '—'}</td>
                    <td className="p-3 font-sans text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</td>
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
