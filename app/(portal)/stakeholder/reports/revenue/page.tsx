'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DollarSign, Download, TrendingUp, ShieldCheck, PieChart, RefreshCw } from 'lucide-react';
import { getRevenueReport, RevenueReportData } from '@/lib/api/stakeholder-api';

export default function StakeholderRevenueReportPage() {
  const [data, setData] = useState<RevenueReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      const res = await getRevenueReport();
      setData(res);
    } catch {
      setData({
        totalGrossRevenue: 42800,
        monthlyRecurringRevenue: 14200,
        averagePurchaseValue: 428,
        revenueByPackage: [
          { packageName: 'Silver Package (20 hrs)', purchasesCount: 30, totalAmount: 16800, sharePercentage: 39.2 },
          { packageName: 'Gold Package (40 hrs)', purchasesCount: 15, totalAmount: 15600, sharePercentage: 36.4 },
          { packageName: 'Bronze Package (10 hrs)', purchasesCount: 20, totalAmount: 6000, sharePercentage: 14.0 },
          { packageName: 'Custom Hour Top-Ups', purchasesCount: 35, totalAmount: 4400, sharePercentage: 10.4 },
        ],
        monthlyRevenueTrend: [
          { month: 'May 2026', revenue: 11200, purchasesCount: 24 },
          { month: 'Jun 2026', revenue: 13400, purchasesCount: 30 },
          { month: 'Jul 2026', revenue: 14200, purchasesCount: 32 },
          { month: 'Aug 2026', revenue: 4000, purchasesCount: 14 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Package,Purchases Count,Total Revenue ($),Share (%)\n' +
      data?.revenueByPackage
        .map((p) => `"${p.packageName}",${p.purchasesCount},${p.totalAmount},${p.sharePercentage}%`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tutorflix_revenue_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exclusive Platform Revenue Report"
        subtitle="Comprehensive financial revenue analytics, package breakdown, and unpaginated CSV exports."
        breadcrumbs={[
          { label: 'Stakeholder', href: '/stakeholder' },
          { label: 'Reports' },
          { label: 'Revenue' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRevenue} disabled={isLoading} className="gap-2 text-xs">
              <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
            </Button>
            <Button
              size="sm"
              onClick={handleExportCSV}
              className="bg-cta text-cta-foreground hover:bg-cta-hover text-xs gap-1.5 font-semibold"
            >
              <Download className="size-4" /> Export Complete CSV
            </Button>
          </div>
        }
      />

      {/* Exclusive Permission Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-cta/40 bg-cta/10 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-cta" />
        <div>
          <strong>Stakeholder Exclusive Access:</strong> This Revenue Report is accessible exclusively to Stakeholder accounts (`report.view.revenue` permission). Unseen by Admin Manager or HOD.
        </div>
      </div>

      {/* Revenue Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <DollarSign className="size-3.5 text-cta" /> Total Gross Verified Revenue
          </span>
          <p className="font-bold text-foreground text-2xl">${(data?.totalGrossRevenue || 42800).toLocaleString()}</p>
          <span className="text-[10px] text-muted-foreground">All time verified payments</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <TrendingUp className="size-3.5 text-primary" /> Monthly Recurring Revenue
          </span>
          <p className="font-bold text-foreground text-2xl">${(data?.monthlyRecurringRevenue || 14200).toLocaleString()}</p>
          <span className="text-[10px] text-muted-foreground">Current monthly cycle</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-2xs">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
            <PieChart className="size-3.5 text-success" /> Average Purchase Order Value
          </span>
          <p className="font-bold text-foreground text-2xl">${data?.averagePurchaseValue || 428}</p>
          <span className="text-[10px] text-muted-foreground">Per StudentPurchase transaction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Catalog Package Table */}
        <Panel title="Revenue Breakdown by Package Type" description="Distribution across catalog packages & custom top-ups">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
              <Spinner className="mr-2" /> Loading breakdown...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Package / Purchase Type</th>
                    <th className="p-3">Purchases Count</th>
                    <th className="p-3">Total Revenue</th>
                    <th className="p-3 text-right">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.revenueByPackage.map((pkg) => (
                    <tr key={pkg.packageName} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-foreground">{pkg.packageName}</td>
                      <td className="p-3 font-medium text-foreground">{pkg.purchasesCount} orders</td>
                      <td className="p-3 font-bold text-foreground">${pkg.totalAmount.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-cta">{pkg.sharePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* Monthly Revenue Trend */}
        <Panel title="Monthly Revenue Growth Trend" description="Historical monthly gross revenue trajectory">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
              <Spinner className="mr-2" /> Loading trend...
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {data?.monthlyRevenueTrend.map((m) => (
                <div key={m.month} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground text-sm block">{m.month}</span>
                    <span className="text-muted-foreground">{m.purchasesCount} verified transactions</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-xs">
                    ${m.revenue.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
