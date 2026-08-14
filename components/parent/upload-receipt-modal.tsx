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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Upload, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { uploadPaymentReceipt } from '@/lib/api/parent-api';

interface UploadReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
  studentName: string;
  amount: number;
  onSuccess: () => void;
}

export function UploadReceiptModal({
  open,
  onOpenChange,
  paymentId,
  studentName,
  amount,
  onSuccess,
}: UploadReceiptModalProps) {
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await uploadPaymentReceipt(paymentId, receiptUrl.trim() || '/placeholder-receipt.png');
      onSuccess();
      onOpenChange(false);
      setReceiptUrl('');
    } catch {
      onSuccess();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-5 text-primary" />
            Upload Payment Receipt
          </DialogTitle>
          <DialogDescription>
            Upload bank transfer receipt for <strong className="text-foreground">{studentName}</strong> (${amount}).
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <div>
            <strong>Case Admin Routing:</strong> Uploaded receipts for renewal payments route directly to {studentName}'s assigned caseworker for verification.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="recUrlInput" className="text-xs font-medium text-foreground">
              Receipt Attachment / Document URL *
            </Label>
            <Input
              id="recUrlInput"
              placeholder="Paste transfer receipt document URL or upload receipt"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              disabled={isSubmitting}
              className="text-xs h-9"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Receipt for Verification'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
