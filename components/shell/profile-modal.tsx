'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Globe, MapPin, Shield } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            User Profile
          </DialogTitle>
          <DialogDescription>
            Read-only account details and role attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User Header */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {user.fullName}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.roles.map((role) => (
                  <Badge key={role} className="bg-primary/10 text-primary border-0 text-[10px]">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* User Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Mail className="size-3.5" /> Email
              </span>
              <span className="font-medium text-foreground text-xs break-all">{user.email}</span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Phone className="size-3.5" /> Phone
              </span>
              <span className="font-medium text-foreground text-xs">{user.phone || 'Not specified'}</span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar className="size-3.5" /> Date of Birth
              </span>
              <span className="font-medium text-foreground text-xs">{user.dateOfBirth || 'Not specified'}</span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Shield className="size-3.5" /> Gender
              </span>
              <span className="font-medium text-foreground text-xs">{user.gender || 'Not specified'}</span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Globe className="size-3.5" /> Country
              </span>
              <span className="font-medium text-foreground text-xs">{user.country || 'Not specified'}</span>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <MapPin className="size-3.5" /> Timezone
              </span>
              <span className="font-medium text-foreground text-xs">{user.timezone || 'UTC'}</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground text-center pt-1 italic">
            Note: Password changes are managed directly by IT/Technical support.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
