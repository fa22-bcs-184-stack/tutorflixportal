'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getAvailabilityRequests, reviewAvailabilityRequest, AvailabilityRequestItem } from '@/lib/api/manager-api';

export default function ManagerAvailabilityRequestsPage() {
  const [requests, setRequests] = useState<AvailabilityRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getAvailabilityRequests();
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await reviewAvailabilityRequest(id, action);
      fetchRequests();
    } catch {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r))
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Availability Change Requests"
        subtitle="Review and approve/reject proposed weekly timetable availability changes submitted by tutors."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Availability Requests' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Requests
          </Button>
        }
      />

      <Panel title="Pending Availability Requests Queue" description="Tutor-submitted weekly slot change proposals">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Clock className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Pending Requests</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {requests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <span className="font-bold text-foreground text-sm">{req.tutorName}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">Requested {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      req.status === 'APPROVED'
                        ? 'bg-success-subtle text-success border-success/30'
                        : req.status === 'REJECTED'
                        ? 'bg-danger-subtle text-danger border-danger/30'
                        : 'bg-warning-subtle text-warning border-warning/30'
                    }`}
                  >
                    {req.status}
                  </Badge>
                </div>

                {/* Proposed Slots Grid */}
                <div className="space-y-1">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground">Proposed Slot Schedule</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {req.proposedSlots.map((ps) => (
                      <div key={ps.day} className="p-2 rounded-lg bg-muted/30 border border-border">
                        <span className="font-bold text-foreground block text-[11px] mb-1">{ps.day}</span>
                        <div className="flex flex-wrap gap-1">
                          {ps.slots.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {req.reason && (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-2.5 rounded-lg border border-border">
                    Reason: "{req.reason}"
                  </p>
                )}

                {req.status === 'PENDING' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReview(req.id, 'REJECT')}
                      className="text-xs text-danger border-danger/30 hover:bg-danger-subtle gap-1.5"
                    >
                      <XCircle className="size-3.5" /> Reject Request
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReview(req.id, 'APPROVE')}
                      className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
                    >
                      <CheckCircle2 className="size-3.5" /> Approve Availability Change
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
