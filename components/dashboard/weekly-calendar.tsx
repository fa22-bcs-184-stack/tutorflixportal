"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Video, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import type { ClassSession } from "@/lib/data"

const DAYS     = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAY_NUMS = [16, 17, 18, 19, 20, 21]
const START_H  = 8
const END_H    = 19
const ROW_H    = 64
const hours    = Array.from({ length: END_H - START_H }, (_, i) => START_H + i)

function fmtHour(h: number) {
  const p = h >= 12 ? "PM" : "AM"
  const d = h % 12 === 0 ? 12 : h % 12
  return `${d}${p}`
}
function fmtTime(h: number) {
  const w = Math.floor(h), m = Math.round((h - w) * 60)
  const p = w >= 12 ? "PM" : "AM"
  const d = w % 12 === 0 ? 12 : w % 12
  return `${d}:${m.toString().padStart(2, "0")} ${p}`
}

const statusCfg = {
  live:      { label: "Live now",   color: "oklch(0.63 0.20 340)" },
  upcoming:  { label: "Upcoming",   color: "var(--color-primary)"  },
  completed: { label: "Completed",  color: "oklch(0.58 0.016 258)" },
  cancelled: { label: "Cancelled",  color: "oklch(0.64 0.22 22)"  },
}

const BORDER  = "1px solid oklch(1 0 0 / 7%)"
const BORDER_FAINT = "1px solid oklch(1 0 0 / 5%)"

export function WeeklyCalendar({
  sessions, showStudent = false,
}: { sessions: ClassSession[]; showStudent?: boolean }) {
  const [selected, setSelected] = useState<ClassSession | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(() => setFeedback(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  const liveCount     = sessions.filter(s => s.status === "live").length
  const upcomingCount = sessions.filter(s => s.status === "upcoming").length

  return (
    <>
      {/* ── Calendar grid ── */}
      <div
        className="flex flex-col overflow-hidden rounded-2xl"
        style={{
          background: "oklch(0.148 0.022 266)",
          border: BORDER,
          boxShadow: "0 1px 0 oklch(1 0 0 / 0.08), 0 4px 24px oklch(0 0 0 / 0.22), 0 16px 48px oklch(0 0 0 / 0.16)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 px-5 py-4"
          style={{ borderBottom: BORDER }}
        >
          <div>
            <p className="text-[0.92rem] font-semibold text-white">June 16 – 21, 2026</p>
            <div className="mt-0.5 flex items-center gap-3 text-[0.72rem]">
              {liveCount > 0 && (
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: "oklch(0.72 0.20 340)" }}>
                  <span className="live-dot size-[5px]" />
                  {liveCount} live
                </span>
              )}
              <span style={{ color: "oklch(0.58 0.016 258)" }}>
                {upcomingCount} upcoming
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {["Today", "<", ">"].map((label, i) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label={label === "<" ? "Previous week" : label === ">" ? "Next week" : "Today"}
                className="flex items-center justify-center rounded-xl px-3 py-1.5 text-[0.75rem] font-semibold text-white/50 transition-colors hover:text-white/80"
                style={{
                  background: "oklch(1 0 0 / 7%)",
                  border: BORDER,
                  minWidth: label === "Today" ? undefined : 32,
                  height: 32,
                }}
              >
                {label === "<" ? <ChevronLeft className="size-3.5" /> :
                 label === ">" ? <ChevronRight className="size-3.5" /> : label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Day headers */}
        <div
          className="grid grid-cols-[3rem_repeat(6,1fr)]"
          style={{ borderBottom: BORDER, background: "oklch(1 0 0 / 2%)" }}
        >
          <div style={{ borderRight: BORDER_FAINT }} />
          {DAYS.map((d, i) => (
            <div
              key={d}
              className="flex flex-col items-center gap-1 py-3"
              style={{ borderLeft: i > 0 ? BORDER_FAINT : undefined }}
            >
              <span
                className="text-[0.58rem] font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.50 0.016 258)" }}
              >
                {d}
              </span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "flex size-7 cursor-default items-center justify-center rounded-full text-[0.82rem] font-bold transition-all",
                )}
                style={
                  i === 2
                    ? {
                        background: "linear-gradient(135deg, oklch(0.44 0.22 268), oklch(0.52 0.22 282) 50%, oklch(0.56 0.20 300))",
                        color: "white",
                        boxShadow: "0 2px 12px oklch(0.44 0.22 268 / 0.35)",
                      }
                    : { color: "oklch(0.78 0.01 252)" }
                }
              >
                {DAY_NUMS[i]}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="overflow-auto" style={{ maxHeight: 540 }}>
          <div className="grid min-w-[540px] grid-cols-[3rem_repeat(6,1fr)]">
            {/* Hour labels */}
            <div className="flex flex-col" style={{ borderRight: BORDER_FAINT }}>
              {hours.map(h => (
                <div key={h} className="relative" style={{ height: ROW_H }}>
                  <span
                    className="absolute -top-2.5 right-2 text-[0.56rem] font-medium"
                    style={{ color: "oklch(0.42 0.016 258)" }}
                  >
                    {fmtHour(h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((d, dayIdx) => (
              <div
                key={d}
                className="relative"
                style={{
                  borderLeft: BORDER_FAINT,
                  background: dayIdx === 2 ? "oklch(0.65 0.20 268 / 0.025)" : undefined,
                }}
              >
                {hours.map(h => (
                  <div
                    key={h}
                    style={{ height: ROW_H, borderTop: "1px solid oklch(1 0 0 / 4%)" }}
                  />
                ))}

                {sessions
                  .filter(s => s.day === dayIdx)
                  .map(s => {
                    const top    = (s.start - START_H) * ROW_H
                    const height = s.duration * ROW_H - 3
                    return (
                      <motion.button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        whileHover={{ x: 2, scale: 1.025, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute inset-x-1 overflow-hidden rounded-xl p-2 text-left"
                        style={{
                          top: top + 1,
                          height,
                          background: `color-mix(in oklch, var(--color-${s.color}) 16%, oklch(0.18 0.022 266))`,
                          borderLeft: `2.5px solid var(--color-${s.color})`,
                          boxShadow: `0 1px 4px color-mix(in oklch, var(--color-${s.color}) 14%, transparent)`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 2px 12px color-mix(in oklch, var(--color-${s.color}) 24%, transparent), 0 0 0 1px color-mix(in oklch, var(--color-${s.color}) 20%, transparent)`)}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 1px 4px color-mix(in oklch, var(--color-${s.color}) 14%, transparent)`)}
                      >
                        <p
                          className="truncate text-[0.67rem] font-bold"
                          style={{ color: `var(--color-${s.color})` }}
                        >
                          {s.subject}
                        </p>
                        <p
                          className="truncate text-[0.59rem] mt-0.5"
                          style={{ color: "oklch(0.55 0.016 258)" }}
                        >
                          {fmtTime(s.start)}
                        </p>
                        {s.status === "live" && (
                          <span
                            className="mt-0.5 flex items-center gap-1 text-[0.57rem] font-bold"
                            style={{ color: "oklch(0.72 0.20 340)" }}
                          >
                            <span className="live-dot size-[4px]" />
                            Live
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Session detail dialog ── */}
      <AnimatePresence>
        {selected && (
          <Dialog open onOpenChange={o => !o && setSelected(null)}>
            <DialogContent
              className="rounded-3xl sm:max-w-sm"
              style={{
                background: "oklch(0.165 0.022 266)",
                border: BORDER,
                boxShadow: "0 1px 0 oklch(1 0 0 / 0.08), 0 8px 32px oklch(0 0 0 / 0.32)",
              }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="size-3 rounded-full shrink-0"
                    style={{ background: `var(--color-${selected.color})`, boxShadow: `0 0 8px color-mix(in oklch, var(--color-${selected.color}) 50%, transparent)` }}
                  />
                  <DialogTitle className="text-[0.95rem] font-semibold text-white">
                    {selected.subject}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-white/35">
                  Session details
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-1">
                {[
                  { icon: Clock, label: "Time",    val: `${fmtTime(selected.start)} – ${fmtTime(selected.start + selected.duration)}` },
                  { icon: User,  label: "Tutor",   val: selected.tutor },
                  ...(showStudent ? [{ icon: User, label: "Student", val: selected.student }] : []),
                ].map(({ icon: Icon, label, val }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: "oklch(1 0 0 / 5%)" }}
                  >
                    <Icon className="size-3.5 shrink-0" style={{ color: "oklch(0.50 0.016 258)" }} />
                    <span className="text-[0.78rem]" style={{ color: "oklch(0.55 0.016 258)" }}>{label}</span>
                    <span className="ml-auto text-[0.78rem] font-semibold text-white">{val}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2 px-1 pt-1">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: statusCfg[selected.status].color }}
                  />
                  <span
                    className="text-[0.78rem] font-semibold capitalize"
                    style={{ color: statusCfg[selected.status].color }}
                  >
                    {statusCfg[selected.status].label}
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFeedback("Reschedule request sent to your tutor.")}
                  className="flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white/50 transition-colors hover:text-white/80"
                  style={{ background: "oklch(1 0 0 / 7%)", border: BORDER }}
                >
                  Reschedule
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFeedback("Join link is ready for this session.")}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.44 0.22 268), oklch(0.52 0.22 282) 50%, oklch(0.56 0.20 300))",
                    boxShadow: "0 2px 16px oklch(0.44 0.22 268 / 0.32)",
                  }}
                >
                  <Video className="size-3.5" />
                  Join session
                </motion.button>
              </DialogFooter>

              {feedback && (
                <p className="pt-1 text-[0.72rem] text-primary/80">{feedback}</p>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
