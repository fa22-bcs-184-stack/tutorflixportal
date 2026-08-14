"use client"

import { motion } from "framer-motion"
import { Video, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { upcomingClasses } from "@/lib/data"

export function UpcomingClasses({ showJoin = true }: { showJoin?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      {upcomingClasses.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          whileHover={{ x: 3 }}
          className="group flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors duration-150 cursor-pointer"
          style={{ ["--hover-bg" as string]: "oklch(1 0 0 / 5%)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 5%)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {/* subject dot + icon */}
          <div
            className="relative flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105"
            style={{
              background: `color-mix(in oklch, var(--color-${c.color}) 18%, oklch(0.148 0.022 266))`,
              color: `var(--color-${c.color})`,
              boxShadow: `0 2px 10px color-mix(in oklch, var(--color-${c.color}) 22%, transparent)`,
            }}
          >
            {c.status === "live" && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2"
                style={{ background: "oklch(0.60 0.22 340)", borderColor: "oklch(0.148 0.022 266)" }}>
                <span className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{ background: "oklch(0.60 0.22 340 / 0.45)" }} />
              </span>
            )}
            <Video className="size-4" />
          </div>

          {/* info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[0.85rem] font-semibold text-white truncate">{c.subject}</p>
              {c.status === "live" && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide"
                  style={{ background: "oklch(0.60 0.22 340 / 0.15)", color: "oklch(0.72 0.22 340)" }}>
                  <span className="live-dot size-[4px]" />
                  Live
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[0.73rem] text-white/38">
              {c.tutor} · {c.time}
            </p>
          </div>

          {/* join */}
          {showJoin && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.72rem] font-bold transition-all",
                c.status === "live"
                  ? "gradient-brand text-white shadow-glow-sm hover:opacity-90"
                  : "text-white/40 hover:text-white/70",
              )}
              style={c.status !== "live" ? { background: "oklch(1 0 0 / 7%)" } : undefined}
            >
              {c.status === "live" ? <Video className="size-3" /> : <ExternalLink className="size-3" />}
              <span className="hidden sm:inline">Join</span>
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
