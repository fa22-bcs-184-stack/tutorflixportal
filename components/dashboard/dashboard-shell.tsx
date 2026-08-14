"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  GraduationCap, Search, Bell, Menu, LogOut,
  Settings, Check, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navConfig } from "@/lib/nav"
import { roleMeta, currentUsers, type Role } from "@/lib/data"

const roles: Role[] = ["student", "parent", "tutor", "admin", "scheduler", "stakeholder"]

/* ─────────────────────────────────────────
   Single nav link — used in both sidebar variants
───────────────────────────────────────── */
function NavLink({
  item, role, onNavigate, compact,
}: {
  item: { href: string; label: string; icon: React.ElementType; badge?: string }
  role: string
  onNavigate?: () => void
  compact?: boolean
}) {
  const pathname = usePathname()
  const active   = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href))
  const Icon     = item.icon

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={compact ? item.label : undefined}
      className={cn(
        "group relative flex items-center rounded-xl transition-all duration-150",
        compact  ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
        active
          ? "bg-white/10 text-white"
          : "text-white/38 hover:bg-white/6 hover:text-white/80",
      )}
    >
      {/* active spring background */}
      {active && (
        <motion.div
          layoutId={`nav-active-${compact ? "compact" : "full"}`}
          className="absolute inset-0 rounded-xl bg-white/10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* left bar for active */}
      {active && !compact && (
        <span className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      <Icon className={cn("relative shrink-0 transition-all duration-150",
        compact ? "size-[18px]" : "size-[17px]",
        active ? "text-primary" : "",
      )} />

      {!compact && (
        <span className="relative flex-1 text-[0.83rem] font-medium tracking-[-0.01em]">
          {item.label}
        </span>
      )}

      {/* badge */}
      {item.badge && (
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-primary text-[0.55rem] font-bold text-white",
            compact
              ? "absolute right-1 top-1 size-3.5"
              : "relative h-[18px] min-w-[18px] px-1",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}

/* ─────────────────────────────────────────
   Sidebar body — shared between desktop & mobile
───────────────────────────────────────── */
function SidebarBody({
  role, compact = false, onNavigate,
}: {
  role: Role; compact?: boolean; onNavigate?: () => void
}) {
  const meta  = roleMeta[role]
  const user  = currentUsers[role]
  const items = navConfig[role]

  return (
    <div className="flex h-full flex-col">

      {/* ── Logo ── */}
      <div className={cn(
        "flex items-center py-5",
        compact ? "justify-center px-3" : "gap-3 px-4",
      )}>
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary"
          style={{ boxShadow: "0 0 0 1px oklch(0.65 0.20 248 / 0.3), 0 4px 20px oklch(0.44 0.22 248 / 0.35)" }}
        >
          <GraduationCap className="size-4.5 text-white" />
          {/* pulse ring */}
          <div className="absolute inset-0 rounded-2xl bg-primary opacity-40 animate-pulse-ring" />
        </motion.div>

        {!compact && (
          <div className="min-w-0">
            <p className="text-[0.95rem] font-bold tracking-tight text-white leading-tight">Lumina</p>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/30 leading-tight mt-0.5">
              AI Education
            </p>
          </div>
        )}
      </div>

      {/* ── Role label ── */}
      {!compact && (
        <div className="px-4 pb-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/20">
            {meta.tagline}
          </p>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className={cn("flex flex-1 flex-col gap-0.5", compact ? "px-2" : "px-3")}>
        {items.map(item => (
          <NavLink
            key={item.href}
            item={item}
            role={role}
            onNavigate={onNavigate}
            compact={compact}
          />
        ))}
      </nav>

      {/* ── User profile ── */}
      <div className={cn("pb-4 pt-2", compact ? "px-2" : "px-3")}>
        {/* divider */}
        <div className="mb-3 h-px bg-white/8" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className={cn(
                "flex w-full items-center rounded-xl p-2 transition-colors hover:bg-white/6 focus-visible:outline-none",
                compact && "justify-center",
              )} />
            }
          >
            <Avatar className="size-8 rounded-xl shrink-0">
              <AvatarFallback
                className="rounded-xl text-[0.62rem] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--color-${meta.accent}), color-mix(in oklch, var(--color-${meta.accent}) 65%, var(--primary)))`,
                }}
              >
                {user.initials}
              </AvatarFallback>
            </Avatar>

            {!compact && (
              <div className="ml-2.5 min-w-0 flex-1 text-left">
                <p className="truncate text-[0.78rem] font-semibold text-white leading-tight">{user.name}</p>
                <p className="truncate text-[0.64rem] text-white/35 leading-tight mt-0.5">{meta.label}</p>
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-2xl border border-white/8 bg-[oklch(0.18_0.022_266)] p-1.5 shadow-soft-lg"
            align={compact ? "end" : "start"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-white/30">
              Switch portal
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {roles.map(r => {
                const rm = roleMeta[r]; const cu = currentUsers[r]
                return (
                  <DropdownMenuItem key={r} render={<Link href={`/${r}`} />} className="gap-2.5 rounded-xl p-2">
                    <Avatar className="size-7 rounded-lg shrink-0">
                      <AvatarFallback className="rounded-lg text-[0.6rem] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, var(--color-${rm.accent}), color-mix(in oklch, var(--color-${rm.accent}) 65%, var(--primary)))` }}>
                        {cu.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.78rem] font-medium text-white">{rm.label}</p>
                      <p className="truncate text-[0.64rem] text-white/40">{cu.name}</p>
                    </div>
                    {r === role && <Check className="size-3.5 text-primary shrink-0" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1.5 bg-white/8" />
            <DropdownMenuItem className="gap-2 rounded-xl p-2 text-[0.78rem] text-white/60">
              <Settings className="size-3.5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/login" />} className="gap-2 rounded-xl p-2 text-[0.78rem] text-white/40">
              <LogOut className="size-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   DashboardShell — exported
───────────────────────────────────────── */
export function DashboardShell({
  role, title, subtitle, actions, children,
}: {
  role: Role; title: string; subtitle?: string
  actions?: React.ReactNode; children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = currentUsers[role]
  const meta = roleMeta[role]

  return (
    <div className="flex min-h-svh bg-background">

      {/* ── Desktop sidebar: full width with icons + labels ── */}
      <aside
        className="sticky top-0 hidden h-svh w-56 shrink-0 border-r lg:flex lg:flex-col"
        style={{
          background: "oklch(0.122 0.023 268)",
          borderColor: "oklch(1 0 0 / 6%)",
        }}
      >
        <SidebarBody role={role} />
      </aside>

      {/* ── Mobile drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 border-r"
          style={{ background: "oklch(0.122 0.023 268)", borderColor: "oklch(1 0 0 / 6%)" }}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBody role={role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex h-[52px] items-center gap-3 border-b px-4 lg:px-6"
          style={{
            background: "color-mix(in oklch, oklch(0.108 0.024 268) 85%, transparent)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderColor: "oklch(1 0 0 / 7%)",
          }}
        >
          {/* mobile menu */}
          <button
            className="flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/8 hover:text-white/80 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4.5" />
          </button>

          <span className="text-[0.9rem] font-semibold text-white lg:hidden">{title}</span>

          <div className="ml-auto flex items-center gap-1">
            {/* search */}
            <div className="relative hidden sm:flex items-center">
              <Search className="pointer-events-none absolute left-3 size-3.5 text-white/25" />
              <input
                type="search"
                placeholder="Search…"
                className="h-8 w-44 rounded-xl border-0 pl-9 pr-3 text-[0.8rem] text-white outline-none transition-all placeholder:text-white/25 focus:w-56 focus:ring-2 focus:ring-primary/20"
                style={{ background: "oklch(1 0 0 / 6%)" }}
              />
            </div>

            {/* notifications */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex size-8 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-white/8 hover:text-white/80"
            >
              <Bell className="size-4" />
              <span
                className="absolute right-1.5 top-1.5 size-1.5 rounded-full"
                style={{ background: "var(--color-chart-5)" }}
              />
            </motion.button>

            {/* avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<button className="ml-1 flex items-center rounded-xl p-1 transition-colors hover:bg-white/8 focus-visible:outline-none" />}
              >
                <Avatar className="size-7 rounded-lg">
                  <AvatarFallback
                    className="rounded-lg text-[0.6rem] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, var(--color-${meta.accent}), color-mix(in oklch, var(--color-${meta.accent}) 65%, var(--primary)))`,
                    }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-2xl border border-white/8 bg-[oklch(0.18_0.022_266)] p-1.5 shadow-soft-lg"
              >
                <DropdownMenuLabel className="p-2">
                  <p className="text-[0.8rem] font-semibold text-white">{user.name}</p>
                  <p className="text-[0.68rem] text-white/40">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-white/8" />
                <DropdownMenuItem className="gap-2 rounded-xl p-2 text-[0.8rem] text-white/60">
                  <Settings className="size-3.5" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/login" />} className="gap-2 rounded-xl p-2 text-[0.8rem] text-white/40">
                  <LogOut className="size-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page header */}
        <motion.div
          className="flex items-end justify-between gap-4 px-6 pb-1 pt-8 lg:px-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div>
            <h1 className="text-[1.7rem] font-bold tracking-[-0.038em] leading-tight text-white md:text-[1.95rem]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-[0.84rem] text-white/45">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </motion.div>

        {/* Main */}
        <motion.main
          className="flex-1 px-6 pb-12 pt-5 lg:px-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
