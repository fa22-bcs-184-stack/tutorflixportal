'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';

export default function TutorCalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Calendar"
        description="View your class schedule and manage availability"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Calendar feature coming soon</p>
      </div>
    </div>
  );
}
