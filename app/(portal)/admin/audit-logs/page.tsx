'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FileSpreadsheet, RefreshCw, ShieldCheck } from 'lucide-react';
import { getCaseloadAuditLogs, AuditLogItem } from '@/lib/api/admin-api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getCaseloadAuditLogs();
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Caseload Audit Logs"
        subtitle="System audit trail for operations on your assigned caseload."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Audit Logs' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Logs
          </Button>
        }
      />

      <Panel title="Caseload Audit Trail" description="Audit log entries recorded for your assigned caseload operations">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <FileSpreadsheet className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Audit Logs Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity ID</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-semibold text-foreground">{log.id}</td>
                    <td className="p-3 font-medium uppercase text-primary">{log.module}</td>
                    <td className="p-3 font-semibold">{log.action}</td>
                    <td className="p-3 font-mono text-muted-foreground">{log.entityId}</td>
                    <td className="p-3 text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
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
