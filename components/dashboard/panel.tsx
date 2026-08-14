"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Panel({
  title, description, action, children,
  className, contentClassName, noPadding, transparent, glow,
}: {
  title?: string; description?: string; action?: React.ReactNode
  children: React.ReactNode; className?: string; contentClassName?: string
  noPadding?: boolean; transparent?: boolean; glow?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn("relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm", className)}
      style={transparent ? undefined : undefined}
    >
      {/* optional accent glow line */}
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${glow} 50%, transparent 95%)` }}
        />
      )}

      {/* always have a subtle top highlight */}
      {!transparent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
          style={{ background: "linear-gradient(90deg, transparent 10%, oklch(1 0 0 / 0.10) 50%, transparent 90%)" }}
        />
      )}

      {title && (
        <div className="flex items-start justify-between gap-3 px-6 pb-3 pt-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-[0.93rem] font-semibold tracking-tight text-slate-900">{title}</h3>
            {description && (
              <p className="mt-0.5 text-[0.78rem] text-slate-600">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={cn(
        !noPadding && "px-6 pb-6",
        !title && !noPadding && "pt-6",
        contentClassName,
      )}>
        {children}
      </div>
    </motion.div>
  )
}
