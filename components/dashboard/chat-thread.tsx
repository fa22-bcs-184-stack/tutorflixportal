"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Smile, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { chatThread, roleMeta, type ChatMessage, type Role } from "@/lib/data"

const roleAccent: Record<Role, string> = {
  student: "chart-1",
  parent:  "chart-3",
  tutor:   "chart-2",
  admin:   "chart-5",
  scheduler: "chart-4",
  stakeholder: "chart-1",
}

export function ChatThread({
  currentRole,
  title = "Aarav Sharma — Math & Sciences",
  isAdmin = false,
}: { currentRole: Role; title?: string; isAdmin?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatThread)
  const [showDeleted, setShowDeleted] = useState(false)
  const [draft, setDraft] = useState("")
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!statusNote) return
    const timeout = window.setTimeout(() => setStatusNote(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [statusNote])

  function send() {
    if (!draft.trim()) return
    setMessages(m => [...m, {
      id: `local-${Date.now()}`,
      author:   roleMeta[currentRole].label,
      role:     currentRole,
      initials: currentRole.slice(0, 2).toUpperCase(),
      time:     "Just now",
      text:     draft.trim(),
    }])
    setDraft("")
    setStatusNote(`Message sent as ${roleMeta[currentRole].label}.`)
  }

  function handleAttachment() {
    setStatusNote("Attachment picker is ready for the next update.")
  }

  function handleEmoji() {
    setStatusNote("Emoji reactions are queued for the next release.")
  }

  return (
    <div className="flex h-[calc(100svh-11rem)] min-h-[28rem] flex-col overflow-hidden">

      {/* header */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: "1px solid oklch(1 0 0 / 7%)" }}
      >
        <div>
          <p className="text-[0.88rem] font-semibold text-white">{title}</p>
          <p className="text-[0.7rem] text-white/35">Student · Parent · Tutor · Admin</p>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowDeleted(s => !s)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-semibold transition-colors"
            style={{
              background: showDeleted ? "var(--color-primary)" : "oklch(1 0 0 / 7%)",
              color: showDeleted ? "white" : "oklch(0.7 0.01 258)",
            }}
          >
            {showDeleted ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            <span className="hidden sm:inline">Deleted</span>
          </motion.button>
        )}
      </div>

      {/* admin banner */}
      {isAdmin && (
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{ background: "oklch(0.65 0.20 268 / 0.08)", borderBottom: "1px solid oklch(1 0 0 / 6%)" }}
        >
          <ShieldCheck className="size-3.5 text-primary shrink-0" />
          <p className="text-[0.68rem] text-white/35">Admin view · messages are end-to-end encrypted</p>
        </div>
      )}

      {/* messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => {
            const mine     = m.role === currentRole
            const accent   = roleAccent[m.role]
            const showMeta = idx === 0 || messages[idx - 1]?.role !== m.role

            if (m.deleted && !(isAdmin && showDeleted)) {
              return (
                <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex justify-center">
                  <span className="text-[0.66rem] italic text-white/20">Message deleted</span>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={cn("flex gap-3", mine && "flex-row-reverse")}
              >
                {/* avatar */}
                {showMeta ? (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold text-white cursor-default"
                    style={{
                      background: `var(--color-${accent})`,
                      boxShadow: `0 2px 10px color-mix(in oklch, var(--color-${accent}) 30%, transparent)`,
                    }}
                  >
                    {m.initials}
                  </motion.div>
                ) : (
                  <div className="size-8 shrink-0" />
                )}

                <div className={cn("flex max-w-[72%] flex-col gap-1", mine && "items-end")}>
                  {showMeta && (
                    <div className={cn("flex items-baseline gap-2 px-1", mine && "flex-row-reverse")}>
                      <span className="text-[0.73rem] font-semibold text-white">{m.author}</span>
                      <span className="text-[0.6rem] text-white/25">{m.time}</span>
                    </div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                      "relative overflow-hidden rounded-2xl px-4 py-2.5 text-[0.83rem] leading-relaxed",
                      m.deleted
                        ? "italic text-white/25 line-through"
                        : mine
                          ? "text-white rounded-tr-sm"
                          : "text-white/80 rounded-tl-sm",
                    )}
                    style={
                      m.deleted
                        ? { background: "oklch(0.64 0.22 22 / 0.12)", border: "1px dashed oklch(0.64 0.22 22 / 0.3)" }
                        : mine
                          ? { background: "linear-gradient(135deg, oklch(0.44 0.22 268), oklch(0.52 0.22 282) 50%, oklch(0.56 0.20 300))", boxShadow: "0 2px 16px oklch(0.44 0.22 268 / 0.28)" }
                          : { background: "oklch(1 0 0 / 7%)" }
                    }
                  >
                    {mine && !m.deleted && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: "linear-gradient(105deg, transparent 35%, oklch(1 0 0 / 0.07) 50%, transparent 65%)",
                          animation: "shimmer-slide 2.4s ease infinite",
                        }}
                      />
                    )}
                    <span className="relative">{m.text}</span>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* composer */}
      <div className="p-4" style={{ borderTop: "1px solid oklch(1 0 0 / 7%)" }}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20"
          style={{ background: "oklch(1 0 0 / 6%)" }}
        >
          <button type="button" onClick={handleAttachment} className="text-white/25 hover:text-white/60 transition-colors" aria-label="Attach">
            <Paperclip className="size-4" />
          </button>

          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={`Message as ${roleMeta[currentRole].label}…`}
            className="flex-1 bg-transparent text-[0.84rem] text-white outline-none placeholder:text-white/22"
          />

          <button type="button" onClick={handleEmoji} className="text-white/25 hover:text-white/60 transition-colors" aria-label="Emoji">
            <Smile className="size-4" />
          </button>

          <motion.button
            onClick={send}
            disabled={!draft.trim()}
            whileHover={{ scale: draft.trim() ? 1.08 : 1 }}
            whileTap={{ scale: draft.trim() ? 0.92 : 1 }}
            className="flex size-8 shrink-0 items-center justify-center rounded-xl gradient-brand text-white transition-all disabled:opacity-25 disabled:shadow-none"
            style={{ boxShadow: draft.trim() ? "0 2px 16px oklch(0.44 0.22 268 / 0.30)" : "none" }}
          >
            <Send className="size-3.5" />
          </motion.button>
        </div>
      </div>

      {statusNote && (
        <p className="px-4 pb-3 text-[0.68rem] text-primary/80">{statusNote}</p>
      )}
    </div>
  )
}
