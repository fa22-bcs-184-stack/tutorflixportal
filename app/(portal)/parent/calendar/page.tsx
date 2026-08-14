'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';

export default function ParentCalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Calendar"
        description="View your child's class schedule"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Calendar feature coming soon</p>
      </div>
    </div>
  );
}
