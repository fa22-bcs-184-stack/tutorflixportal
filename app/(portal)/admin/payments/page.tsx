'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PaymentReceiptModal } from '@/components/admin/payment-receipt-modal';
import { Receipt, CheckCircle2, ShieldCheck, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { getPendingPayments, PaymentItem } from '@/lib/api/admin-api';

export default function PaymentVerificationQueuePage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingPayments();
      setPayments(data);
    } catch {
      // Mock fallback
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenReceipt = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Verification Queue"
        subtitle="Review and approve renewal & top-up payments for your assigned caseload."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Payment Queue' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchPayments} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Queue
          </Button>
        }
      />

      {/* Verification Scoping Notice Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-info/30 bg-info-subtle p-4 text-xs text-info">
        <ShieldCheck className="size-5 shrink-0 text-info" />
        <div>
          <strong>Renewal & Top-up Payments Only:</strong> This queue shows pending payments for your assigned caseload (`case_admin_id = currentAdmin.id`). Initial lead conversion payments are verified off-platform by Intro Scheduler and never appear here.
        </div>
      </div>

      <Panel title="Pending Verification Payments" description="Pending payments requiring caseworker verification">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading pending payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <CheckCircle2 className="size-8 text-success/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">Payment Queue Empty</p>
            <p>No pending renewal or top-up payments awaiting verification for your caseload.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Student & Parent</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Package / Hours</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-semibold text-foreground">{p.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-foreground">{p.student?.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">{p.student?.parentName} ({p.student?.parentPhone})</div>
                    </td>
                    <td className="p-3 font-medium">{p.paymentMethod}</td>
                    <td className="p-3">
                      <div>{p.studentPurchase?.packageName || 'Custom Hours'}</div>
                      <div className="text-[10px] text-muted-foreground">{p.studentPurchase?.purchasedHours} hours</div>
                    </td>
                    <td className="p-3 font-bold text-foreground text-sm">${p.amount}</td>
                    <td className="p-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenReceipt(p)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5"
                      >
                        <Eye className="size-3.5" /> Review Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Payment Receipt Review Modal */}
      <PaymentReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        payment={selectedPayment}
        onSuccess={fetchPayments}
      />
    </div>
  );
}
