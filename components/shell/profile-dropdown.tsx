'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ProfileModal } from './profile-modal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { User, LogOut, Shield } from 'lucide-react';

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  if (!user) return null;

  const primaryRole = user.roles[0] || 'User';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl p-1 transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="User Profile Menu"
            />
          }
        >
          <div
            className="flex size-8 items-center justify-center rounded-xl text-white text-xs font-bold shrink-0"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary, hsl(221,90%,57%)), color-mix(in oklab, var(--color-primary, hsl(221,90%,57%)) 70%, hsl(199,85%,62%)))',
            }}
          >
            {user.fullName
              ? user.fullName.split(' ').map((n) => n.charAt(0).toUpperCase()).join('').slice(0, 2)
              : 'U'}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {user.roles.map((role) => (
                <Badge key={role} className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <DropdownMenuItem
            onClick={() => setProfileModalOpen(true)}
            className="cursor-pointer py-2 text-xs"
          >
            <User className="size-4 mr-2 text-muted-foreground" />
            View Account Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setLogoutConfirmOpen(true)}
            className="cursor-pointer py-2 text-xs text-danger focus:text-danger focus:bg-danger-subtle"
          >
            <LogOut className="size-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      <ConfirmationDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Confirm Sign Out"
        description="Are you sure you want to log out of your Tutorflix session?"
        confirmLabel="Sign Out"
        variant="destructive"
        onConfirm={logout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </>
  );
}
