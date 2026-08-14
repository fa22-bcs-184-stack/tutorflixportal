'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { ContactSupportModal } from './contact-support-modal';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  LineChart,
  MessageSquare,
  Star,
  Users,
  GraduationCap,
  CreditCard,
  Receipt,
  ShieldAlert,
  FileSpreadsheet,
  Clock,
  UserCheck,
  Briefcase,
  DollarSign,
  Activity,
  Lock,
  ShieldCheck,
  Shield,
  TrendingUp,
  LogOut,
  ChevronsUpDown,
  X,
  LifeBuoy,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   Nav item type
───────────────────────────────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ALL NAV ITEMS — sourced from frontend-requirements.md
   Each item has roles[] listing which portals can see it.
───────────────────────────────────────────────────────────────────────────── */
const ALL_NAV_ITEMS: NavItem[] = [

  // ──────────────────────────────────────────────────────────────────────────
  // STUDENT — §Student Portal (overview, calendar, resources, progress,
  //            messages, rate-tutor)
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Overview',               href: '/student',              icon: LayoutDashboard, roles: ['Student'] },
  { label: 'Calendar',               href: '/student/calendar',     icon: Calendar,        roles: ['Student'] },
  { label: 'Resources',              href: '/student/resources',    icon: BookOpen,        roles: ['Student'] },
  { label: 'Progress',               href: '/student/progress',     icon: LineChart,       roles: ['Student'] },
  { label: 'Messages',               href: '/student/messages',     icon: MessageSquare,   roles: ['Student'] },
  { label: 'Rate Your Tutor',        href: '/student/rate-tutor',   icon: Star,            roles: ['Student'] },

  // ──────────────────────────────────────────────────────────────────────────
  // PARENT — §Parent Portal (overview, calendar, reports, payments,
  //           messages, rate-tutor)
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Overview',               href: '/parent',               icon: LayoutDashboard, roles: ['Parent'] },
  { label: 'Calendar',               href: '/parent/calendar',      icon: Calendar,        roles: ['Parent'] },
  { label: 'Tutor Reports',          href: '/parent/reports',       icon: LineChart,       roles: ['Parent'] },
  { label: 'Payments',               href: '/parent/payments',      icon: CreditCard,      roles: ['Parent'] },
  { label: 'Messages',               href: '/parent/messages',      icon: MessageSquare,   roles: ['Parent'] },
  { label: 'Rate Your Tutor',        href: '/parent/rate-tutor',    icon: Star,            roles: ['Parent'] },

  // ──────────────────────────────────────────────────────────────────────────
  // TUTOR — §Tutor Portal (overview, students, calendar, trials,
  //          resources, earnings, messages)
  // Note: "availability" is a widget on dashboard + calendar flow, not own page
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Overview',               href: '/tutor',                icon: LayoutDashboard, roles: ['Tutor'] },
  { label: 'My Students',            href: '/tutor/students',       icon: Users,           roles: ['Tutor'] },
  { label: 'Calendar',               href: '/tutor/calendar',       icon: Calendar,        roles: ['Tutor'] },
  { label: 'My Trials',              href: '/tutor/trials',         icon: UserCheck,       roles: ['Tutor'] },
  { label: 'Resources',              href: '/tutor/resources',      icon: BookOpen,        roles: ['Tutor'] },
  { label: 'Earnings',               href: '/tutor/earnings',       icon: DollarSign,      roles: ['Tutor'] },
  { label: 'Messages',               href: '/tutor/messages',       icon: MessageSquare,   roles: ['Tutor'] },

  // ──────────────────────────────────────────────────────────────────────────
  // INTRO SCHEDULER — §Intro Scheduler (dashboard, lead pipeline, trials)
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Dashboard',              href: '/scheduler',            icon: LayoutDashboard, roles: ['Intro Scheduler'] },
  { label: 'Lead Pipeline',          href: '/scheduler/leads',      icon: Briefcase,       roles: ['Intro Scheduler'] },
  { label: 'Schedule Trial',         href: '/scheduler/trials',     icon: Calendar,        roles: ['Intro Scheduler'] },

  // ──────────────────────────────────────────────────────────────────────────
  // ADMIN — §Admin Portal
  // Scoped to own caseload. No lead/trial screens. No Revenue/Lead Conversion.
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Dashboard',              href: '/admin',                    icon: LayoutDashboard, roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Payment Queue',          href: '/admin/payments',           icon: Receipt,         roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'My Families',            href: '/admin/students',           icon: Users,           roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Tutors',                 href: '/admin/tutors',             icon: GraduationCap,   roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Tutor Assignment',       href: '/admin/tutor-assignment',   icon: UserCheck,       roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Calendar / Scheduling',  href: '/admin/classes',            icon: Calendar,        roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Purchases',              href: '/admin/purchases',          icon: CreditCard,      roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Messages',               href: '/admin/messages',           icon: MessageSquare,   roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Moderation Queue',       href: '/admin/moderation',         icon: ShieldAlert,     roles: ['Admin', 'Admin Manager', 'HOD'] },
  { label: 'Frozen Conversations',   href: '/admin/conversations',      icon: Lock,            roles: ['Admin'] },           // Admin: view-only. Unlock is Manager-only (separate route)
  { label: 'Reports',                href: '/admin/reports',            icon: LineChart,       roles: ['Admin', 'Admin Manager'] },
  { label: 'Audit Log',              href: '/admin/audit-logs',         icon: FileSpreadsheet, roles: ['Admin', 'Admin Manager', 'HOD'] },

  // ──────────────────────────────────────────────────────────────────────────
  // ADMIN MANAGER EXCLUSIVE — §Admin Manager Portal
  // These are in addition to the shared /admin/* items above
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'User Management',        href: '/manager/users',                icon: Users,           roles: ['Admin Manager'] },
  { label: 'Case Assignments',       href: '/manager/case-assignments',     icon: UserCheck,       roles: ['Admin Manager'] },
  { label: 'Availability Requests',  href: '/manager/availability',         icon: Clock,           roles: ['Admin Manager'] },
  { label: 'All-Admins Activity',    href: '/manager/activity',             icon: Activity,        roles: ['Admin Manager', 'HOD'] },
  { label: 'Admins Oversight',       href: '/manager/moderation-oversight', icon: ShieldCheck,     roles: ['Admin Manager'] },
  { label: 'Unlock Conversations',   href: '/manager/conversations',        icon: Lock,            roles: ['Admin Manager'] },
  { label: 'Roles & Permissions',    href: '/manager/roles',                icon: Shield,          roles: ['Admin Manager'] },
  { label: 'Full Audit Log',         href: '/manager/audit-logs',           icon: FileSpreadsheet, roles: ['Admin Manager'] },

  // ──────────────────────────────────────────────────────────────────────────
  // HOD EXCLUSIVE — §HOD Portal
  // Lead pipeline oversight, sales members, scheduler activity, Lead Conversion
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Lead Pipeline (All)',     href: '/hod/leads',              icon: Briefcase,       roles: ['HOD'] },
  { label: 'Sales Members',           href: '/hod/sales-members',      icon: DollarSign,      roles: ['HOD'] },
  { label: 'Schedulers Activity',     href: '/hod/scheduler-activity', icon: Activity,        roles: ['HOD'] },
  { label: 'Reports',                 href: '/hod/reports',            icon: TrendingUp,      roles: ['HOD'] },   // includes Lead Conversion

  // ──────────────────────────────────────────────────────────────────────────
  // STAKEHOLDER — §Stakeholder Portal — read-only across everything
  // Revenue report is Stakeholder-exclusive (rule #6 in AGENTS.md)
  // ──────────────────────────────────────────────────────────────────────────
  { label: 'Executive Suite',         href: '/stakeholder',                              icon: LayoutDashboard, roles: ['Stakeholder'] },
  { label: 'Revenue Report',          href: '/stakeholder/reports/revenue',              icon: DollarSign,      roles: ['Stakeholder'] },
  { label: 'Lead Conversion Report',  href: '/stakeholder/reports/lead-conversion',      icon: TrendingUp,      roles: ['Stakeholder'] },
  { label: 'Tutor Performance',       href: '/stakeholder/reports/tutor-performance',    icon: LineChart,       roles: ['Stakeholder'] },
  { label: 'Attendance & Progress',   href: '/stakeholder/reports/attendance',           icon: UserCheck,       roles: ['Stakeholder'] },
  { label: 'Lead Pipeline',           href: '/stakeholder/leads',                        icon: Briefcase,       roles: ['Stakeholder'] },
  { label: 'Students',                href: '/stakeholder/students',                     icon: Users,           roles: ['Stakeholder'] },
  { label: 'Tutors',                  href: '/stakeholder/tutors',                       icon: GraduationCap,   roles: ['Stakeholder'] },
  { label: 'Payments',                href: '/stakeholder/payments',                     icon: Receipt,         roles: ['Stakeholder'] },
  { label: 'Audit Log',               href: '/stakeholder/audit-logs',                   icon: FileSpreadsheet, roles: ['Stakeholder'] },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Role taglines shown as pill below brand in sidebar
───────────────────────────────────────────────────────────────────────────── */
const ROLE_TAGLINES: Record<string, string> = {
  'Student':         'Student Portal',
  'Parent':          'Family Portal',
  'Tutor':           'Tutor Dashboard',
  'Intro Scheduler': 'Lead Pipeline',
  'Admin':           'Case Management',
  'Admin Manager':   'Operations Hub',
  'HOD':             'Head of Department',
  'Stakeholder':     'Executive Suite',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Helper — user initials from full name
───────────────────────────────────────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/* ─────────────────────────────────────────────────────────────────────────────
   NavList — renders role-filtered nav items with gradient active pill
───────────────────────────────────────────────────────────────────────────── */
function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href + '/'));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
              isActive
                ? 'text-white'
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
            )}
          >
            {/* Gradient active pill background */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary, hsl(221,90%,57%)), color-mix(in oklab, var(--color-primary, hsl(221,90%,57%)) 70%, hsl(260,80%,60%)))',
                  boxShadow:
                    '0 4px 14px color-mix(in oklab, var(--color-primary, hsl(221,90%,57%)) 35%, transparent)',
                }}
              />
            )}
            <Icon
              className={cn(
                'relative size-4 shrink-0 transition-all duration-200',
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground group-hover:text-foreground group-hover:scale-110'
              )}
            />
            <span className="relative flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <Badge
                className={cn(
                  'relative h-5 min-w-5 justify-center px-1.5 text-[0.65rem] font-bold',
                  isActive
                    ? 'bg-white/20 text-white border-0'
                    : 'bg-primary/15 text-primary border-0'
                )}
              >
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ContactSupportButton — bottom of sidebar, opens modal directly on click
───────────────────────────────────────────────────────────────────────────── */
function ContactSupportButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="px-3 pb-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/30 px-4 py-3 text-left transition-all hover:bg-sidebar-accent hover:border-sidebar-border focus:outline-none group"
      >
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 shrink-0 transition-colors group-hover:bg-primary/20 overflow-hidden">
          <img src="/support-icon.jpg" alt="Support" className="size-6 object-contain" />
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[13px] font-semibold text-sidebar-foreground">Contact Support</span>
          <span className="text-[11px] text-muted-foreground">Report an issue or ask for help</span>
        </div>
      </button>

      <ContactSupportModal open={open} onOpenChange={setOpen} />
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   SidebarBody — shared between desktop + mobile drawer
───────────────────────────────────────────────────────────────────────────── */
function SidebarBody({
  navItems,
  pathname,
  role,
  onNavigate,
}: {
  navItems: NavItem[];
  pathname: string;
  role: string;
  onNavigate?: () => void;
}) {
  const tagline = ROLE_TAGLINES[role] || role;

  return (
    <div className="flex h-full flex-col">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Tutorflix owl logo — just the owl, no text */}
        <img
          src="/owl-logo.png"
          alt="Tutorflix"
          className="size-14 object-contain shrink-0"
        />
        <div className="flex flex-col leading-snug min-w-0">
          <span className="text-[0.95rem] font-bold tracking-tight text-sidebar-foreground">Tutorflix</span>
          <span className="text-[0.65rem] text-muted-foreground/70 whitespace-nowrap">Learn Globally, Excel Anywhere.</span>
        </div>
      </div>

      {/* ── Role tagline pill ── */}
      <div className="mx-3 mb-3 rounded-lg bg-primary/8 px-3 py-1.5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-primary/70">
          {tagline}
        </p>
      </div>

      {/* ── Nav items (scrollable) ── */}
      <div className="flex-1 overflow-y-auto">
        <NavList items={navItems} pathname={pathname} onNavigate={onNavigate} />
      </div>

      {/* ── Footer divider + contact support button ── */}
      <div className="mt-auto">
        <div className="mx-5 mb-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <ContactSupportButton />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sidebar — public export. Renders desktop sticky + mobile drawer.
───────────────────────────────────────────────────────────────────────────── */
interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userRoles = user?.roles || [];
  const primaryRole = userRoles[0] || '';

  // Filter nav items to this user's roles, then deduplicate by href
  const navItems = Array.from(
    new Map(
      ALL_NAV_ITEMS
        .filter((item) => item.roles.some((r) => userRoles.includes(r)))
        .map((item) => [item.href, item])
    ).values()
  );

  return (
    <>
      {/* Desktop sidebar — sticky, 256px wide */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r border-sidebar-border/60 bg-sidebar lg:flex lg:flex-col">
        <SidebarBody
          navItems={navItems}
          pathname={pathname}
          role={primaryRole}
        />
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border/60 bg-sidebar transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* X close button */}
        <button
          type="button"
          onClick={onMobileClose}
          className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label="Close sidebar"
        >
          <X className="size-4 text-sidebar-foreground/60" />
        </button>

        <SidebarBody
          navItems={navItems}
          pathname={pathname}
          role={primaryRole}
          onNavigate={onMobileClose}
        />
      </aside>
    </>
  );
}
