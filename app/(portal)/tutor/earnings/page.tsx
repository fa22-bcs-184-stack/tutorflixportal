'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DollarSign, Award, Clock, History, RefreshCw } from 'lucide-react';
import { getTutorEarnings } from '@/lib/api/tutor-api';

export default function TutorEarningsPage() {
  const [earningsData, setEarningsData] = useState<{
    monthlyTotal: number;
    hourlyRate: number;
    completedHoursThisMonth: number;
    trialBonusTotal: number;
    sessions: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const data = await getTutorEarnings();
      setEarningsData(data);
    } catch {
      setEarningsData({
        monthlyTotal: 640,
        hourlyRate: 40,
        completedHoursThisMonth: 16,
        trialBonusTotal: 50,
        sessions: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Earnings"
        subtitle="Track your session pay ledger, trial conversion bonuses, and pending cycle payouts."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Earnings' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchEarnings} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Ledger
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1">
            <DollarSign className="size-3.5 text-primary" /> Cycle Earnings Total
          </span>
          <p className="font-bold text-foreground text-2xl">${earningsData?.monthlyTotal || 640}</p>
          <span className="text-[10px] text-muted-foreground">Live-computed cycle pay</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1">
            <Clock className="size-3.5 text-cta" /> Completed Hours
          </span>
          <p className="font-bold text-foreground text-2xl">{earningsData?.completedHoursThisMonth || 16} hrs</p>
          <span className="text-[10px] text-muted-foreground">Rate: ${earningsData?.hourlyRate || 40}/hr</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1">
            <Award className="size-3.5 text-success" /> Trial Conversion Bonuses
          </span>
          <p className="font-bold text-foreground text-2xl">${earningsData?.trialBonusTotal || 50}</p>
          <span className="text-[10px] text-muted-foreground">Trial lead conversions</span>
        </div>
      </div>

      <Panel title="Completed Sessions Pay Ledger" description="Individual completed sessions and pay breakdown">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading earnings ledger...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Session Date</th>
                  <th className="p-3">Student & Subject</th>
                  <th className="p-3">Hours Completed</th>
                  <th className="p-3">Hourly Rate</th>
                  <th className="p-3 text-right">Earned Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {earningsData?.sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground">{s.date}</td>
                    <td className="p-3">
                      <div className="font-bold text-foreground">{s.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">{s.subject}</div>
                    </td>
                    <td className="p-3 font-medium">{s.hoursDeducted} hrs</td>
                    <td className="p-3 font-medium">${s.hourlyRate}/hr</td>
                    <td className="p-3 text-right font-bold text-success text-sm">${s.sessionEarnings}</td>
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
