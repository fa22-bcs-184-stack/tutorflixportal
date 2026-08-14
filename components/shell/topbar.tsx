'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { NotificationsDropdown } from './notifications-dropdown';
import { ProfileDropdown } from './profile-dropdown';
import { Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// Resolve page title from current path segment
function usePageTitle(): { title: string; subtitle?: string } {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const titleMap: Record<string, string> = {
    student: 'Student Portal',
    parent: 'Family Portal',
    tutor: 'Tutor Dashboard',
    scheduler: 'Lead Pipeline',
    admin: 'Admin Portal',
    manager: 'Admin Manager',
    hod: 'Head of Department',
    stakeholder: 'Executive Suite',
    classes: 'Classes & Schedule',
    leads: 'Lead Pipeline',
    resources: 'Learning Resources',
    progress: 'Attendance & Progress',
    messages: 'Messages',
    reports: 'Reports',
    payments: 'Payments',
    purchases: 'Purchases & Ledger',
    moderation: 'Moderation Queue',
    students: 'Students',
    tutors: 'Tutors',
    trials: 'Trials',
    earnings: 'Earnings',
    availability: 'Availability',
    profile: 'My Profile',
    'rate-tutor': 'Rate Your Tutor',
    'audit-logs': 'Audit Logs',
    'audit-log': 'Audit Logs',
    'case-assignments': 'Case Admin Assignments',
    'availability-requests': 'Availability Requests',
    conversations: 'Frozen Conversations',
    'moderation-oversight': 'Moderation Oversight',
    roles: 'Roles & Permissions',
    users: 'Staff Management',
    activity: 'Activity Feeds',
    'sales-members': 'Sales Members',
    'tutor-assignment': 'Tutor Assignment',
    revenue: 'Revenue Report',
    'lead-conversion': 'Lead Conversion Report',
    'tutor-performance': 'Tutor Performance',
    attendance: 'Attendance Report',
    notifications: 'Notifications',
  };

  const last = segments[segments.length - 1];
  const secondLast = segments[segments.length - 2];
  const title = titleMap[last] || titleMap[segments[0]] || 'Tutorflix';
  const subtitle = secondLast && secondLast !== segments[0]
    ? titleMap[secondLast]
    : undefined;

  return { title, subtitle };
}

interface TopbarProps {
  onMenuToggle?: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const { title } = usePageTitle();
  const [searchFocused, setSearchFocused] = useState(false);

  const name = user?.fullName || 'User';
  const initials = getInitials(name);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 px-4 lg:px-6',
        'bg-background/80 backdrop-blur-xl'
      )}
    >
      {/* Mobile menu toggle */}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition-all hover:bg-card hover:border-border hover:text-foreground lg:hidden"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Page title — desktop only */}
      <div className="hidden min-w-0 flex-col md:flex">
        <span className="truncate text-sm font-semibold tracking-tight text-foreground/90">
          {title}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Expandable search input */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'h-9 rounded-xl border border-input/80 bg-muted/40 pl-9 pr-3 text-xs outline-none transition-all duration-300 placeholder:text-muted-foreground/60',
              'focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/15',
              searchFocused ? 'w-60' : 'w-44 lg:w-48'
            )}
          />
        </div>

        {/* Notifications bell */}
        <NotificationsDropdown />

        {/* Avatar dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
