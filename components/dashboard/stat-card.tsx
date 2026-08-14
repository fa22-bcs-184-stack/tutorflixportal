"use client"

import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label, value, delta, trend = "up",
  icon: Icon, accent = "primary", hint, className,
}: {
  label: string; value: string; delta?: string; trend?: "up" | "down"
  icon: LucideIcon; accent?: string; hint?: string; className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 cursor-default",
        className,
      )}
      style={{
        background: "var(--card)",
        boxShadow: "0 1px 0 oklch(1 0 0 / 0.05), 0 2px 8px oklch(0 0 0 / 0.06)",
        border: "1px solid oklch(0.52 0.15 255 / 0.15)",
      }}
    >
      {/* Corner ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.15]"
        style={{ background: `var(--color-${accent})` }}
      />

      {/* Top shimmer line on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-${accent}) 70%, transparent) 50%, transparent)`,
        }}
      />

      {/* Label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-slate-500">
          {label}
        </span>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.12 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex size-8 items-center justify-center rounded-xl"
          style={{
            background: `color-mix(in oklch, var(--color-${accent}) 16%, transparent)`,
            color: `var(--color-${accent})`,
            boxShadow: `0 2px 12px color-mix(in oklch, var(--color-${accent}) 22%, transparent)`,
          }}
        >
          <Icon className="size-[15px]" />
        </motion.div>
      </div>

      {/* Value + delta */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-[2.1rem] font-bold leading-none tracking-[-0.04em] text-slate-900">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.63rem] font-bold",
              trend === "up"
                ? "bg-[oklch(0.65_0.18_156_/_0.15)] text-[oklch(0.72_0.18_156)]"
                : "bg-[oklch(0.64_0.22_22_/_0.15)] text-[oklch(0.72_0.22_22)]",
            )}
          >
            {trend === "up"
              ? <ArrowUpRight className="size-3" />
              : <ArrowDownRight className="size-3" />}
            {delta}
          </span>
        )}
      </div>

      {hint && (
        <p className="text-[0.69rem] leading-relaxed text-slate-600">{hint}</p>
      )}
    </motion.div>
  )
}
