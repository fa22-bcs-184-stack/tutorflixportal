'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { ShieldCheck, Search, Filter, RefreshCw } from 'lucide-react';
import { getManagerAuditLogs, ManagerAuditLogItem } from '@/lib/api/manager-api';

export default function ManagerAuditLogsPage() {
  const [logs, setLogs] = useState<ManagerAuditLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getManagerAuditLogs();
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

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      !search ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase());

    const matchesModule = moduleFilter === 'ALL' || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Unrestricted Audit Logs"
        subtitle="Complete system audit log inspecting actor actions, modules, targets, and payloads across the platform."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Audit Logs' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Logs
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search actor name or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={moduleFilter} onValueChange={(val) => val && setModuleFilter(val)}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Modules</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="administration">Administration</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="scheduling">Scheduling</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Panel title="Platform-Wide System Audit Trail" description="Unrestricted immutable event logs">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <ShieldCheck className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Audit Logs Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Target ID</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors text-[11px]">
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
                    <td className="p-3 font-sans text-muted-foreground">
                      {new Date(l.timestamp).toLocaleString()}
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
