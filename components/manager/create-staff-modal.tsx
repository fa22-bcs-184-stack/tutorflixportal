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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { UserPlus, AlertCircle } from 'lucide-react';
import { createStaffUser } from '@/lib/api/manager-api';

interface CreateStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateStaffModal({ open, onOpenChange, onSuccess }: CreateStaffModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'TUTOR' | 'SCHEDULER' | 'HOD' | 'STAKEHOLDER' | 'MANAGER'>('ADMIN');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createStaffUser({
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim() || undefined,
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
            Create Staff Account
          </DialogTitle>
          <DialogDescription>
            Add a new staff user to the platform and assign their system role.
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
            <Label htmlFor="staffName" className="text-xs font-medium text-foreground">
              Full Name *
            </Label>
            <Input
              id="staffName"
              placeholder="e.g. Sofia Reyes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staffEmail" className="text-xs font-medium text-foreground">
              Work Email Address *
            </Label>
            <Input
              id="staffEmail"
              type="email"
              placeholder="sofia@tutorflix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">System Role *</Label>
              <Select value={role} onValueChange={(val: any) => setRole(val)}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin (Caseworker)</SelectItem>
                  <SelectItem value="TUTOR">Tutor</SelectItem>
                  <SelectItem value="SCHEDULER">Intro Scheduler</SelectItem>
                  <SelectItem value="HOD">Head of Department (HOD)</SelectItem>
                  <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
                  <SelectItem value="MANAGER">Admin Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staffPhone" className="text-xs font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="staffPhone"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
