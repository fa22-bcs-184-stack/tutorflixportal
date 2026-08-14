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
import { Spinner } from '@/components/ui/spinner';
import { Edit, AlertCircle } from 'lucide-react';
import { updateSalesMember, SalesMemberItem } from '@/lib/api/hod-api';

interface EditSalesMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesMember: SalesMemberItem;
  onSuccess: () => void;
}

export function EditSalesMemberModal({
  open,
  onOpenChange,
  salesMember,
  onSuccess,
}: EditSalesMemberModalProps) {
  const [name, setName] = useState(salesMember.name);
  const [email, setEmail] = useState(salesMember.email);
  const [phone, setPhone] = useState(salesMember.phone);
  const [commissionTier, setCommissionTier] = useState(salesMember.commissionTier);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(salesMember.name);
    setEmail(salesMember.email);
    setPhone(salesMember.phone);
    setCommissionTier(salesMember.commissionTier);
  }, [salesMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await updateSalesMember(salesMember.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        commissionTier,
      });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="size-5 text-primary" />
            Edit Sales Member
          </DialogTitle>
          <DialogDescription>
            Update contact details and commission tier for <strong className="text-foreground">{salesMember.name}</strong>.
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
            <Label htmlFor="editSmName" className="text-xs font-medium text-foreground">
              Sales Member Name *
            </Label>
            <Input
              id="editSmName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="editSmEmail" className="text-xs font-medium text-foreground">
              Email Address *
            </Label>
            <Input
              id="editSmEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="editSmPhone" className="text-xs font-medium text-foreground">
                Phone Number *
              </Label>
              <Input
                id="editSmPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editSmTier" className="text-xs font-medium text-foreground">
                Commission Tier
              </Label>
              <Input
                id="editSmTier"
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
              {isSubmitting ? <Spinner size="sm" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
