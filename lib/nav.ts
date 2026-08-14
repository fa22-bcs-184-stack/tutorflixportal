import {
  LayoutDashboard,
  CalendarDays,
  MessageCircle,
  BookOpen,
  PlayCircle,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  GraduationCap,
  Wallet,
  Upload,
  ShieldCheck,
  Banknote,
  type LucideIcon,
} from "lucide-react"
import type { Role } from "./data"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navConfig: Record<Role, NavItem[]> = {
  student: [
    { label: "Overview",    href: "/student",              icon: LayoutDashboard },
    { label: "Calendar",    href: "/student/calendar",     icon: CalendarDays    },
    { label: "Resources",   href: "/student/resources",    icon: BookOpen        },
    { label: "Recordings",  href: "/student/recordings",   icon: PlayCircle      },
    { label: "Progress",    href: "/student/progress",     icon: BarChart3       },
    { label: "Messages",    href: "/student/messages",     icon: MessageCircle, badge: "2" },
  ],
  parent: [
    { label: "Overview",    href: "/parent",               icon: LayoutDashboard },
    { label: "Calendar",    href: "/parent/calendar",      icon: CalendarDays    },
    { label: "Reports",     href: "/parent/reports",       icon: FileText        },
    { label: "Payments",    href: "/parent/payments",      icon: CreditCard      },
    { label: "Messages",    href: "/parent/messages",      icon: MessageCircle   },
  ],
  tutor: [
    { label: "Overview",    href: "/tutor",                icon: LayoutDashboard },
    { label: "Students",    href: "/tutor/students",       icon: Users           },
    { label: "Calendar",    href: "/tutor/calendar",       icon: CalendarDays    },
    { label: "Resources",   href: "/tutor/resources",      icon: Upload          },
    { label: "Earnings",    href: "/tutor/earnings",       icon: Wallet          },
    { label: "Messages",    href: "/tutor/messages",       icon: MessageCircle   },
  ],
  admin: [
    { label: "Overview",    href: "/admin",                icon: LayoutDashboard },
    { label: "Students",    href: "/admin/students",       icon: GraduationCap   },
    { label: "Tutors",      href: "/admin/tutors",         icon: Users           },
    { label: "Calendar",    href: "/admin/calendar",       icon: CalendarDays    },
    { label: "Messages",    href: "/admin/messages",       icon: MessageCircle   },
    { label: "Revenue",     href: "/admin/revenue",        icon: Banknote        },
    { label: "Oversight",   href: "/admin/oversight",      icon: ShieldCheck     },
  ],
  scheduler: [
    { label: "Overview",    href: "/scheduler",            icon: LayoutDashboard },
    { label: "Calendar",    href: "/scheduler/calendar",   icon: CalendarDays    },
    { label: "Messages",    href: "/scheduler/messages",   icon: MessageCircle   },
  ],
  stakeholder: [
    { label: "Overview",    href: "/stakeholder",          icon: LayoutDashboard },
    { label: "Reports",     href: "/stakeholder/reports",  icon: FileText        },
    { label: "Messages",    href: "/stakeholder/messages", icon: MessageCircle   },
  ],
}
