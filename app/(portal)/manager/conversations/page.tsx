'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Lock, Unlock, ShieldAlert, RefreshCw } from 'lucide-react';
import { getFrozenConversations, unlockConversation, FrozenConversationItem } from '@/lib/api/manager-api';

export default function ManagerConversationsPage() {
  const [conversations, setConversations] = useState<FrozenConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFrozen = async () => {
    setIsLoading(true);
    try {
      const data = await getFrozenConversations();
      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFrozen();
  }, []);

  const handleUnlock = async (convId: string) => {
    try {
      await unlockConversation(convId);
      setConversations((prev) => prev.filter((c) => c.conversationId !== convId));
    } catch {
      setConversations((prev) => prev.filter((c) => c.conversationId !== convId));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unlock Frozen Conversations"
        subtitle="Admin Manager exclusive authorization to unlock conversations frozen due to RED_ZONE safety reviews."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Frozen Conversations' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchFrozen} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Roster
          </Button>
        }
      />

      <Panel title="Frozen Communication Threads Roster" description="Conversations currently locked platform-wide">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading frozen threads...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Unlock className="size-8 text-success/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Frozen Conversations!</p>
            <p className="text-[11px] text-muted-foreground mt-1">All communication threads are active and unlocked.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Conversation ID</th>
                  <th className="p-3">Student & Family</th>
                  <th className="p-3">Assigned Tutor</th>
                  <th className="p-3">Case Admin</th>
                  <th className="p-3">Freeze Reason</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conversations.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-foreground">{c.conversationId}</td>
                    <td className="p-3 font-bold text-foreground">{c.studentName}</td>
                    <td className="p-3 text-muted-foreground">{c.tutorName}</td>
                    <td className="p-3 font-medium text-foreground">{c.caseAdminName}</td>
                    <td className="p-3 text-danger text-[11px]">{c.reason}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleUnlock(c.conversationId)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
                      >
                        <Unlock className="size-3.5" /> Unlock Conversation
                      </Button>
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
