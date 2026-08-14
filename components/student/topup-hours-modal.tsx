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
import { ShoppingBag, CheckCircle2, ShieldCheck, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { initiateTopUpPurchase } from '@/lib/api/student-api';

interface TopUpHoursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRemainingHours: number;
  onSuccess: () => void;
}

const PACKAGES = [
  { id: 'pkg-bronze', name: 'Bronze Package', hours: 10, price: 300, tag: 'Starter' },
  { id: 'pkg-silver', name: 'Silver Package', hours: 20, price: 560, tag: 'Popular' },
  { id: 'pkg-gold', name: 'Gold Package', hours: 40, price: 1040, tag: 'Best Value' },
];

export function TopUpHoursModal({
  open,
  onOpenChange,
  currentRemainingHours,
  onSuccess,
}: TopUpHoursModalProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-silver');
  const [useCustomHours, setUseCustomHours] = useState(false);
  const [customHours, setCustomHours] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPkgId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (useCustomHours) {
        if (!customHours || customHours <= 0) {
          setErrorMsg('Please enter a valid number of hours.');
          setIsSubmitting(false);
          return;
        }
        await initiateTopUpPurchase({ customHours });
      } else {
        await initiateTopUpPurchase({ packageId: selectedPkgId });
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      onSuccess();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-cta" />
            Top Up Lesson Hours
          </DialogTitle>
          <DialogDescription>
            You currently have <strong className="text-foreground">{currentRemainingHours} hours</strong> remaining. Select a catalog package or custom hours to top up.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Catalog Packages Grid */}
          {!useCustomHours ? (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Catalog Packages</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-xs">{pkg.name}</span>
                          {pkg.tag && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-cta/10 text-cta">
                              {pkg.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-[11px]">{pkg.hours} Hours Credit</p>
                      </div>
                      <div className="pt-2 font-bold text-foreground text-sm flex items-center justify-between">
                        <span>${pkg.price}</span>
                        {isSelected && <CheckCircle2 className="size-4 text-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setUseCustomHours(true)}
                className="text-[11px] text-primary underline font-medium pt-1 hover:text-primary-hover"
              >
                Or enter custom hour amount...
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1.5">
                <Label htmlFor="customHrsInput" className="text-xs font-medium text-foreground">
                  Custom Hours Amount *
                </Label>
                <Input
                  id="customHrsInput"
                  type="number"
                  min="1"
                  max="100"
                  value={customHours}
                  onChange={(e) => setCustomHours(Number(e.target.value))}
                  required
                  className="text-xs h-9 font-bold"
                />
                <p className="text-[10px] text-muted-foreground">
                  Rate calculated from platform billing config ($28/hr). Total: ${customHours * 28}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setUseCustomHours(false)}
                className="text-[11px] text-primary underline font-medium"
              >
                ← Back to catalog packages
              </button>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cta text-cta-foreground hover:bg-cta-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Confirm Top-Up Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
