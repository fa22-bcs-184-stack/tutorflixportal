'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Activity, RefreshCw } from 'lucide-react';
import { getAdminActivityFeed, getSchedulerActivityFeed, ActivityFeedItem } from '@/lib/api/hod-api';

export default function HodActivityPage() {
  const [adminFeed, setAdminFeed] = useState<ActivityFeedItem[]>([]);
  const [schedulerFeed, setSchedulerFeed] = useState<ActivityFeedItem[]>([]);
  const [activeTab, setActiveTab] = useState('schedulers');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const [admData, schData] = await Promise.all([
        getAdminActivityFeed(),
        getSchedulerActivityFeed(),
      ]);
      setAdminFeed(admData);
      setSchedulerFeed(schData);
    } catch {
      setAdminFeed([]);
      setSchedulerFeed([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departmental Activity Feeds"
        subtitle="Platform-wide audit activity streams monitoring Admin caseworkers and Intro Schedulers."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Activity Feeds' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchFeeds} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Feeds
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border p-1 rounded-xl">
          <TabsTrigger value="schedulers" className="text-xs font-semibold px-4 py-1.5">
            All-Intro-Schedulers Activity
          </TabsTrigger>
          <TabsTrigger value="admins" className="text-xs font-semibold px-4 py-1.5">
            All-Admins Activity
          </TabsTrigger>
        </TabsList>

        {/* Intro Schedulers Feed */}
        <TabsContent value="schedulers">
          <Panel title="Intro Schedulers Activity Stream" description="Call logging, trial bookings, and lead conversions">
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
                <Spinner className="mr-2" /> Loading scheduler activity...
              </div>
            ) : schedulerFeed.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">No scheduler activity recorded.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {schedulerFeed.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-xl bg-card border border-border flex items-start justify-between text-xs shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{act.actorName}</span>
                        <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary">
                          {act.action}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </TabsContent>

        {/* Admins Feed */}
        <TabsContent value="admins">
          <Panel title="Admin Caseworkers Activity Stream" description="Payment verifications, tutor assignments, and class scheduling">
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
                <Spinner className="mr-2" /> Loading admin activity...
              </div>
            ) : adminFeed.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">No admin activity recorded.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {adminFeed.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-xl bg-card border border-border flex items-start justify-between text-xs shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{act.actorName}</span>
                        <Badge variant="outline" className="text-[10px] font-mono bg-cta/15 text-cta">
                          {act.action}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
