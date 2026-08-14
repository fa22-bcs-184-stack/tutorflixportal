'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, XCircle, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { approvePayment, rejectPayment, PaymentItem } from '@/lib/api/admin-api';

interface PaymentReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentItem | null;
  onSuccess: () => void;
}

export function PaymentReceiptModal({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: PaymentReceiptModalProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!payment) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await approvePayment(payment.id);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to approve payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setErrorMsg('Rejection reason is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await rejectPayment(payment.id, rejectionReason.trim());
      onSuccess();
      onOpenChange(false);
      setRejectMode(false);
      setRejectionReason('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reject payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Verify Renewal / Top-up Payment
          </DialogTitle>
          <DialogDescription>
            Review payment details for <strong className="text-foreground">{payment.student?.studentName}</strong> ({payment.student?.parentName}).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4 py-2 text-xs">
          {/* Payment Summary Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-card border border-border">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Payment ID</span>
              <p className="font-mono font-semibold text-foreground">{payment.id}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Amount</span>
              <p className="font-bold text-foreground text-sm">${payment.amount}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Payment Method</span>
              <p className="font-medium text-foreground">{payment.paymentMethod}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Linked Package</span>
              <p className="font-medium text-foreground">{payment.studentPurchase?.packageName || 'Custom Hours'}</p>
            </div>
          </div>

          {/* Uploaded Receipt Preview */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Uploaded Receipt Attachment
            </Label>
            <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-xl bg-muted/20 text-center space-y-2">
              <FileText className="size-8 text-primary/60" />
              <div>
                <p className="font-semibold text-foreground">Bank_Transfer_Receipt_0981.pdf</p>

              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Preview Document
              </Button>
            </div>
          </div>

          {/* Rejection Mode Input Form */}
          {rejectMode ? (
            <form onSubmit={handleRejectSubmit} className="space-y-3 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label htmlFor="rejReason" className="text-xs font-medium text-danger">
                  Rejection Reason <span className="text-danger">*</span>
                </Label>
                <Textarea
                  id="rejReason"
                  placeholder="Explain why payment is rejected (e.g. Receipt unreadable, incorrect transfer amount)."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRejectMode(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-danger text-white hover:bg-danger/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner size="sm" /> : 'Confirm Rejection'}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <DialogFooter className="pt-3 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectMode(true)}
                disabled={isSubmitting}
                className="border-danger/30 text-danger hover:bg-danger-subtle"
              >
                <XCircle className="size-4 mr-1.5" /> Reject Payment
              </Button>

              <Button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-success text-white hover:bg-success-hover font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" size="sm" /> Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 mr-1.5" /> Approve & Credit Hours
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
