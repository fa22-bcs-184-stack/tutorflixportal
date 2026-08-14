"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Link2,
  Phone,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react"
import { Panel } from "@/components/dashboard/panel"
import { StatCard } from "@/components/dashboard/stat-card"
import { type SchedulerLead, schedulerLeads, schedulerTodayItems } from "@/lib/data"

const columns = [
  { id: "new", label: "New", accent: "chart-5" },
  { id: "contacted", label: "Contacted", accent: "chart-1" },
  { id: "follow_up", label: "Follow up", accent: "chart-4" },
  { id: "trial_scheduled", label: "Trial booked", accent: "chart-3" },
  { id: "converted", label: "Converted", accent: "chart-2" },
] as const

const statusLabel: Record<SchedulerLead["status"], string> = {
  new: "New lead",
  contacted: "Contacted",
  follow_up: "Follow up",
  trial_scheduled: "Trial booked",
  converted: "Converted",
  lost: "Lost",
}

export function SchedulerPipeline() {
  const [leads, setLeads] = useState(schedulerLeads)
  const [selectedLeadId, setSelectedLeadId] = useState(schedulerLeads[0].id)
  const [feedback, setFeedback] = useState("Drag a lead to update status or use the quick actions below.")
  const [form, setForm] = useState({
    subject: "Math Foundations",
    curriculum: "IB Grade 10",
    tutor: "Daniel Okafor",
    time: "Tomorrow · 4:30 PM",
    note: "Parent prefers a weekday evening slot.",
  })

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? leads[0],
    [leads, selectedLeadId],
  )

  const stats = useMemo(() => {
    const followUps = leads.filter((lead) => lead.status === "follow_up").length
    const trials = leads.filter((lead) => lead.status === "trial_scheduled").length
    const converted = leads.filter((lead) => lead.status === "converted").length
    return [
      { label: "Follow-ups due", value: `${followUps}`, icon: Clock3, accent: "chart-4", hint: "Ready for callbacks" },
      { label: "Trials booked", value: `${trials}`, icon: CalendarDays, accent: "chart-3", hint: "Scheduled this week" },
      { label: "Converted", value: `${converted}`, icon: Target, accent: "chart-1", hint: "New student pipeline" },
    ]
  }, [leads])

  const moveLead = (leadId: string, status: SchedulerLead["status"]) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status, nextAction: status === "trial_scheduled" ? "Confirm tutor and send trial link" : lead.nextAction } : lead)),
    )
    setFeedback(`Moved ${selectedLead?.name ?? "lead"} to ${statusLabel[status]}.`)
  }

  const recordCall = () => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id
          ? { ...lead, status: "contacted", nextAction: "Schedule a trial if the parent is interested", activity: [`Call logged · ${new Date().toLocaleDateString()}`, ...lead.activity] }
          : lead,
      ),
    )
    setFeedback(`Call logged for ${selectedLead.name}.`)
  }

  const scheduleTrial = () => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id
          ? {
              ...lead,
              status: "trial_scheduled",
              nextAction: "Send reminder to parent and tutor",
              activity: [`Trial booked · ${form.time}`, ...lead.activity],
            }
          : lead,
      ),
    )
    setFeedback(`Trial scheduled for ${selectedLead.name}.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} accent={stat.accent} hint={stat.hint} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Lead pipeline" description="Drag cards between columns to update status">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {columns.map((column) => {
                const columnLeads = leads.filter((lead) => lead.status === column.id)
                return (
                  <div
                    key={column.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => moveLead(selectedLead.id, column.id as SchedulerLead["status"])}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[0.78rem] font-semibold text-slate-900">{column.label}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.66rem] text-slate-600">{columnLeads.length}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {columnLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => setSelectedLeadId(lead.id)}
                          className="cursor-grab rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-primary/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[0.8rem] font-semibold text-slate-900">{lead.name}</p>
                              <p className="mt-1 text-[0.72rem] text-slate-600">{lead.parent} · {lead.subject}</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.58rem] text-slate-600">{lead.priority}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[0.68rem] text-slate-600">
                            <Phone className="size-3.5" />
                            <span>{lead.contact}</span>
                          </div>
                          <div className="mt-2 text-[0.7rem] text-slate-600">{lead.nextAction}</div>
                          <button onClick={() => setSelectedLeadId(lead.id)} className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary">
                            Open details <ChevronRight className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      {columnLeads.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-[0.68rem] text-slate-500">No leads here yet</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Today’s schedule" description="Calls and trials queued for the day">
            <div className="flex flex-col gap-3">
              {schedulerTodayItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <div>
                    <p className="text-[0.78rem] font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-[0.7rem] text-slate-600">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.64rem] font-semibold text-slate-600">{item.time}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Lead detail" description="Action log and next move">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.9rem] font-semibold text-slate-900">{selectedLead.name}</p>
                    <p className="mt-1 text-[0.74rem] text-slate-600">{selectedLead.parent} · {selectedLead.subject}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.64rem] font-semibold text-slate-600">{statusLabel[selectedLead.status]}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[0.72rem] text-slate-600">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{selectedLead.curriculum}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{selectedLead.contact}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{selectedLead.location}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-[0.75rem] font-semibold text-slate-900">
                  <Sparkles className="size-3.5 text-primary" />
                  Recommended next step
                </div>
                <p className="text-[0.78rem] leading-relaxed text-slate-700">{selectedLead.nextAction}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={recordCall} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
                  <Phone className="size-3.5" /> Record call
                </button>
                <button onClick={() => moveLead(selectedLead.id, "follow_up")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
                  <Clock3 className="size-3.5" /> Set follow-up
                </button>
                <button onClick={() => moveLead(selectedLead.id, "converted")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
                  <CheckCircle2 className="size-3.5" /> Mark converted
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-[0.75rem] font-semibold text-slate-900">
                  <BookOpen className="size-3.5 text-primary" />
                  Notes & activity
                </div>
                <ul className="space-y-2 text-[0.72rem] text-slate-600">
                  {selectedLead.activity.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <Panel title="Trial scheduling" description="Create a trial booking and notify the team">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Subject</label>
                <input value={form.subject} onChange={(event) => setForm((value) => ({ ...value, subject: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[0.8rem] text-slate-900 outline-none" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Curriculum</label>
                <input value={form.curriculum} onChange={(event) => setForm((value) => ({ ...value, curriculum: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[0.8rem] text-slate-900 outline-none" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Tutor</label>
                  <input value={form.tutor} onChange={(event) => setForm((value) => ({ ...value, tutor: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[0.8rem] text-slate-900 outline-none" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Time</label>
                  <input value={form.time} onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[0.8rem] text-slate-900 outline-none" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Parent note</label>
                <textarea value={form.note} onChange={(event) => setForm((value) => ({ ...value, note: event.target.value }))} className="min-h-[88px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[0.8rem] text-slate-900 outline-none" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={scheduleTrial} className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-[0.72rem] font-semibold text-white transition hover:opacity-90">
                  <Link2 className="size-3.5" /> Create trial
                </button>
                <button onClick={() => setFeedback(`Trial reminder queued for ${selectedLead.name}.`)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
                  <UserRound className="size-3.5" /> Mark notified
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 text-[0.74rem] text-slate-700">{feedback}</div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
