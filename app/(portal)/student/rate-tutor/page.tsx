'use client';

import React from 'react';
import { PageHeader } from '@/components/shell/page-header';

export default function StudentRateTutorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Rate Your Tutor"
        description="Share your feedback about your tutoring experience"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Tutor rating feature coming soon</p>
      </div>
    </div>
  );
}
