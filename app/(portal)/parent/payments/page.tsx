'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TopUpHoursModal } from '@/components/student/topup-hours-modal';
import { UploadReceiptModal } from '@/components/parent/upload-receipt-modal';
import {
  CreditCard,
  Upload,
  ShoppingBag,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { getParentPayments, getParentDashboard, ParentPaymentItem, LinkedChildItem } from '@/lib/api/parent-api';

export default function ParentPaymentsPage() {
  const [payments, setPayments] = useState<ParentPaymentItem[]>([]);
  const [childrenList, setChildrenList] = useState<LinkedChildItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ParentPaymentItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashData, pmtData] = await Promise.all([
        getParentDashboard(),
        getParentPayments(),
      ]);
      setChildrenList(dashData.linkedChildren || []);
      setPayments(pmtData);
    } catch {
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenUpload = (payment: ParentPaymentItem) => {
    setSelectedPayment(payment);
    setUploadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Invoices"
        subtitle="Manage lesson package purchases, top up hours, and upload renewal transfer receipts for caseworker verification."
        breadcrumbs={[
          { label: 'Parent', href: '/parent' },
          { label: 'Payments' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setTopUpModalOpen(true)}
            className="bg-cta text-cta-foreground hover:bg-cta-hover text-xs gap-1.5 font-semibold"
          >
            <ShoppingBag className="size-4" /> Top Up Hours
          </Button>
        }
      />

      {/* Static Bank Transfer Instructions Card */}
      <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Building2 className="size-4 text-primary" /> Static Bank Transfer Payment Instructions
        </div>
        <p className="text-xs text-muted-foreground">
          To pay for renewal packages or custom hour top-ups, please transfer the exact invoice amount to our bank account and upload your payment transfer receipt below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono bg-muted/20 p-3 rounded-lg border border-border">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-medium">Bank Name</span>
            <p className="font-bold text-foreground">Tutorflix Global Bank</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-medium">Account Number</span>
            <p className="font-bold text-foreground">9876-5432-1098</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-medium">IBAN / SWIFT</span>
            <p className="font-bold text-foreground">TFGBUS66XXXX</p>
          </div>
        </div>
      </div>

      {/* Per-Child Hours & Billing Summary */}
      <Panel title="Children's Hours & Billing Status" description="Current remaining hours for linked children">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {childrenList.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs shadow-2xs">
              <div>
                <span className="font-bold text-foreground text-sm block">{c.studentName}</span>
                <span className="text-muted-foreground">{c.grade} · {c.curriculum}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Caseworker: Assigned Case Admin</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground text-sm block">{c.remainingHours} hrs left</span>
                <span className="text-[10px] text-muted-foreground">of {c.totalHoursPurchased} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Payment Records & Receipt Upload Queue Table */}
      <Panel title="Payment History & Receipt Upload Queue" description="Renewal and top-up payments for your children">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <CreditCard className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Payment Records Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Child</th>
                  <th className="p-3">Package / Hours</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-semibold text-foreground">{p.id}</td>
                    <td className="p-3 font-bold text-foreground">{p.studentName}</td>
                    <td className="p-3 font-medium">{p.packageName}</td>
                    <td className="p-3 font-bold text-foreground text-sm">${p.amount}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          p.status === 'APPROVED'
                            ? 'bg-success-subtle text-success border-success/30'
                            : p.status === 'REJECTED'
                            ? 'bg-danger-subtle text-danger border-danger/30'
                            : 'bg-warning-subtle text-warning border-warning/30'
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      {p.status === 'PENDING' && !p.isConversionPayment && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenUpload(p)}
                          className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload Receipt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Top Up Hours Modal */}
      <TopUpHoursModal
        open={topUpModalOpen}
        onOpenChange={setTopUpModalOpen}
        currentRemainingHours={childrenList.reduce((acc, c) => acc + c.remainingHours, 0)}
        onSuccess={loadData}
      />

      {/* Upload Receipt Modal */}
      {selectedPayment && (
        <UploadReceiptModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          paymentId={selectedPayment.id}
          studentName={selectedPayment.studentName}
          amount={selectedPayment.amount}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
