'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvailabilityRequestModal } from '@/components/tutor/availability-request-modal';
import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const STATED_SLOTS = [
  { day: 'Monday', time: '1:00 PM - 5:00 PM', status: 'ACTIVE' },
  { day: 'Wednesday', time: '5:00 PM - 9:00 PM', status: 'ACTIVE' },
  { day: 'Friday', time: '1:00 PM - 5:00 PM', status: 'ACTIVE' },
  { day: 'Saturday', time: '9:00 AM - 1:00 PM', status: 'ACTIVE' },
];

export default function TutorAvailabilityPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Availability"
        subtitle="View your stated weekly availability slots or submit a change request to Admin Manager."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Availability' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <Clock className="size-4" /> Request Availability Change
          </Button>
        }
      />

      <div className="flex items-center gap-3 rounded-xl border border-info/30 bg-info-subtle p-4 text-xs text-info">
        <ShieldCheck className="size-5 shrink-0 text-info" />
        <div>
          <strong>Admin Manager Approval:</strong> Changes to your stated availability must be submitted for review and approval specifically by Admin Manager (`AvailabilityChangeRequest`).
        </div>
      </div>

      <Panel title="Stated Weekly Availability Slots" description="Current active availability time slots">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {STATED_SLOTS.map((slot, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-2xs">
              <div>
                <span className="font-bold text-foreground text-sm block">{slot.day}</span>
                <span className="text-muted-foreground">{slot.time}</span>
              </div>
              <Badge variant="outline" className="bg-success-subtle text-success border-success/30 text-[10px]">
                {slot.status}
              </Badge>
            </div>
          ))}
        </div>
      </Panel>

      {/* Availability Change Request Modal */}
      <AvailabilityRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {}}
      />
    </div>
  );
}
