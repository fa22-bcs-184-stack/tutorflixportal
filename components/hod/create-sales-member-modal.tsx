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
import { UserPlus, AlertCircle } from 'lucide-react';
import { createSalesMember } from '@/lib/api/hod-api';

interface CreateSalesMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSalesMemberModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateSalesMemberModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionTier, setCommissionTier] = useState('Standard Tier (3%)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Name, email, and phone are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await createSalesMember({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        commissionTier,
      });
      onSuccess();
      onOpenChange(false);
      setName('');
      setEmail('');
      setPhone('');
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
            <UserPlus className="size-5 text-primary" />
            Create Sales Member
          </DialogTitle>
          <DialogDescription>
            Add a new Sales Member so Intro Schedulers can assign off-platform calls.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="smName" className="text-xs font-medium text-foreground">
              Sales Member Name *
            </Label>
            <Input
              id="smName"
              placeholder="e.g. Marcus Sales"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smEmail" className="text-xs font-medium text-foreground">
              Email Address *
            </Label>
            <Input
              id="smEmail"
              type="email"
              placeholder="marcus.sales@tutorflix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="smPhone" className="text-xs font-medium text-foreground">
                Phone Number *
              </Label>
              <Input
                id="smPhone"
                placeholder="+1 555-0191"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="smTier" className="text-xs font-medium text-foreground">
                Commission Tier
              </Label>
              <Input
                id="smTier"
                placeholder="Senior Tier (5%)"
                value={commissionTier}
                onChange={(e) => setCommissionTier(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Create Sales Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
