'use client';

import React, { useState, useEffect } from 'react';
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, Copy, AlertCircle, Sparkles, Key, DollarSign, ShieldCheck } from 'lucide-react';
import { getCatalogPackages, convertLead, PackageItem } from '@/lib/api/scheduler-api';

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  studentName: string;
  parentName: string;
  onSuccess: () => void;
}

export function ConvertLeadModal({
  open,
  onOpenChange,
  leadId,
  studentName,
  parentName,
  onSuccess,
}: ConvertLeadModalProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('custom');
  const [hours, setHours] = useState<number>(10);
  const [pricePaid, setPricePaid] = useState<number>(300);
  const [notes, setNotes] = useState<string>('');

  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Conversion Success State
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setTempPassword(null);
      setErrorMsg(null);
      setIsLoadingPackages(true);
      getCatalogPackages()
        .then((res) => {
          setPackages(res);
          if (res.length > 0) {
            setSelectedPackageId(res[0].id);
            setHours(res[0].hours);
            setPricePaid(res[0].packagePrice);
          }
        })
        .finally(() => setIsLoadingPackages(false));
    }
  }, [open]);

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    if (pkgId === 'custom') {
      setHours(10);
      setPricePaid(300);
    } else {
      const pkg = packages.find((p) => p.id === pkgId);
      if (pkg) {
        setHours(pkg.hours);
        setPricePaid(pkg.packagePrice);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hours <= 0) {
      setErrorMsg('Purchased hours must be greater than 0.');
      return;
    }

    if (pricePaid < 0) {
      setErrorMsg('Price paid cannot be negative.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await convertLead(leadId, {
        packageId: selectedPackageId === 'custom' ? undefined : selectedPackageId,
        purchasedHours: Number(hours),
        pricePaid: Number(pricePaid),
        notes: notes.trim() || undefined,
      });

      setTempPassword(res.tempPassword || 'TutorflixTemp2026!');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to convert lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-success" />
            Mark Lead as Converted
          </DialogTitle>
          <DialogDescription>
            Record verified off-platform first payment for <strong className="text-foreground">{studentName}</strong> ({parentName}).
          </DialogDescription>
        </DialogHeader>

        {tempPassword ? (
          /* ── SUCCESS VIEW ── */
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-success/30 bg-success-subtle p-4 text-xs text-foreground space-y-2">
              <div className="flex items-center gap-2 font-semibold text-success text-sm">
                <CheckCircle2 className="size-5" /> Lead Successfully Converted!
              </div>
              <p className="text-xs text-muted-foreground">
                Student & Parent accounts have been created and are active immediately.
              </p>
            </div>

            {/* Temporary Password Box */}
            <div className="space-y-2 rounded-xl bg-card border border-border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Key className="size-4 text-warning" /> Generated Temporary Password
                </Label>
                <span className="text-[10px] text-danger font-medium uppercase tracking-wider">
                  Shown Once Only
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={tempPassword}
                  className="font-mono text-sm font-bold bg-muted/50 select-all"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <CheckCircle2 className="size-4 text-success" /> : <Copy className="size-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                Share this password with the family off-platform so they can log into their portal immediately.
              </p>
            </div>

            {/* Case Admin Assignment Note */}
            <div className="rounded-lg bg-info-subtle border border-info/20 p-3 text-xs text-info flex items-start gap-2">
              <ShieldCheck className="size-4 shrink-0 mt-0.5" />
              <div>
                <strong>Next Step:</strong> Notification sent to Admin Manager to assign a Case Admin to this family.
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary-hover w-full"
                onClick={() => onOpenChange(false)}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ── FORM VIEW ── */
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Package Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Package Purchased <span className="text-danger">*</span>
              </Label>
              {isLoadingPackages ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 border rounded-md">
                  <Spinner size="sm" /> Loading catalog packages...
                </div>
              ) : (
                <Select value={selectedPackageId} onValueChange={(val) => val && handlePackageChange(val)} disabled={isSubmitting}>
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Select catalog package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.packageName} — ${p.packagePrice} ({p.hours} hrs)
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Hours Purchase</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Hours & Price Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="convHours" className="text-xs font-medium text-foreground">
                  Purchased Hours <span className="text-danger">*</span>
                </Label>
                <Input
                  id="convHours"
                  type="number"
                  min={1}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  disabled={isSubmitting || selectedPackageId !== 'custom'}
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="convPrice" className="text-xs font-medium text-foreground">
                  Price Paid ($) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="convPrice"
                  type="number"
                  min={0}
                  step={0.01}
                  value={pricePaid}
                  onChange={(e) => setPricePaid(Number(e.target.value))}
                  disabled={isSubmitting}
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Off-platform Receipt Verification Note */}
            <div className="space-y-1.5">
              <Label htmlFor="convNote" className="text-xs font-medium text-foreground">
                Payment Verification Receipt Reference
              </Label>
              <Textarea
                id="convNote"
                placeholder="e.g. Bank transfer receipt #TRX-9821 verified via WhatsApp with Sales Member Jane."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cta text-cta-foreground hover:bg-cta-hover font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    Converting...
                  </>
                ) : (
                  'Confirm & Convert Lead'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
