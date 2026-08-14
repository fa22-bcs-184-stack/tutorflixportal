'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Globe, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          My Account Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Universal identity and platform role details.
        </p>
      </div>

      <Card className="p-6 space-y-6 border border-border">
        {/* User Badge Banner */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-bold text-foreground">
              {user.fullName}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {user.roles.map((role) => (
                <Badge key={role} className="bg-primary/10 text-primary border-0 text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-4" /> Email Address
            </span>
            <p className="font-medium text-foreground text-sm">{user.email}</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Phone className="size-4" /> Phone Number
            </span>
            <p className="font-medium text-foreground text-sm">{user.phone || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-4" /> Date of Birth
            </span>
            <p className="font-medium text-foreground text-sm">{user.dateOfBirth || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Shield className="size-4" /> Gender
            </span>
            <p className="font-medium text-foreground text-sm">{user.gender || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Globe className="size-4" /> Country
            </span>
            <p className="font-medium text-foreground text-sm">{user.country || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-4" /> Timezone
            </span>
            <p className="font-medium text-foreground text-sm">{user.timezone || 'UTC'}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-info-subtle border border-info/20 text-xs text-muted-foreground">
          <strong className="text-foreground">Security Note:</strong> Self-service password changes are disabled per security policy. Password resets are handled directly by IT/Technical support.
        </div>
      </Card>
    </div>
  );
}
