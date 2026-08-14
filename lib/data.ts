// Centralized realistic sample data for the Lumina Learning platform.

export type Role = "student" | "parent" | "tutor" | "admin" | "scheduler" | "stakeholder"

export const roleMeta: Record<
  Role,
  { label: string; tagline: string; accent: string }
> = {
  student: {
    label: "Student",
    tagline: "Classes, resources & progress",
    accent: "chart-1",
  },
  parent: {
    label: "Parent",
    tagline: "Follow your child's journey",
    accent: "chart-3",
  },
  tutor: {
    label: "Tutor",
    tagline: "Students, schedule & earnings",
    accent: "chart-2",
  },
  admin: {
    label: "Admin",
    tagline: "Platform operations",
    accent: "chart-5",
  },
  scheduler: {
    label: "Scheduler",
    tagline: "Coordinate sessions & staffing",
    accent: "chart-4",
  },
  stakeholder: {
    label: "Stakeholder",
    tagline: "Executive view of growth & delivery",
    accent: "chart-2",
  },
}

export const currentUsers: Record<
  Role,
  { name: string; email: string; initials: string; meta: string }
> = {
  student: {
    name: "Aarav Sharma",
    email: "aarav.s@lumina.io",
    initials: "AS",
    meta: "Grade 10 · IB Diploma Programme",
  },
  parent: {
    name: "Priya Sharma",
    email: "priya.s@lumina.io",
    initials: "PS",
    meta: "Parent of Aarav Sharma",
  },
  tutor: {
    name: "Daniel Okafor",
    email: "daniel.o@lumina.io",
    initials: "DO",
    meta: "Mathematics & Physics · 6 yrs",
  },
  admin: {
    name: "Sofia Reyes",
    email: "sofia.r@lumina.io",
    initials: "SR",
    meta: "Head of Operations",
  },
  scheduler: {
    name: "Mina Park",
    email: "mina.p@lumina.io",
    initials: "MP",
    meta: "Operations Scheduler",
  },
  stakeholder: {
    name: "Owen Chen",
    email: "owen.c@lumina.io",
    initials: "OC",
    meta: "Education Stakeholder",
  },
}

export type ClassSession = {
  id: string
  subject: string
  tutor: string
  student: string
  day: number    // 0 = Mon … 5 = Sat
  start: number  // 24h float, e.g. 9.5 = 9:30
  duration: number
  status: "upcoming" | "live" | "completed" | "cancelled"
  color: string
  zoom?: string
}

export const weekSessions: ClassSession[] = [
  { id: "s1",  subject: "Calculus II",          tutor: "Daniel Okafor",  student: "Aarav Sharma",  day: 0, start: 9,    duration: 1,   status: "completed", color: "chart-1", zoom: "https://zoom.us/j/1" },
  { id: "s2",  subject: "Physics — Mechanics",  tutor: "Daniel Okafor",  student: "Aarav Sharma",  day: 0, start: 15,   duration: 1.5, status: "completed", color: "chart-2", zoom: "https://zoom.us/j/2" },
  { id: "s3",  subject: "English Literature",   tutor: "Helena Brandt",  student: "Aarav Sharma",  day: 1, start: 11,   duration: 1,   status: "completed", color: "chart-3", zoom: "https://zoom.us/j/3" },
  { id: "s4",  subject: "Calculus II",          tutor: "Daniel Okafor",  student: "Aarav Sharma",  day: 2, start: 9,    duration: 1,   status: "live",      color: "chart-1", zoom: "https://zoom.us/j/4" },
  { id: "s5",  subject: "Chemistry Lab Review", tutor: "Mei Lin",        student: "Aarav Sharma",  day: 2, start: 14,   duration: 1,   status: "upcoming",  color: "chart-4", zoom: "https://zoom.us/j/5" },
  { id: "s6",  subject: "Physics — Waves",      tutor: "Daniel Okafor",  student: "Aarav Sharma",  day: 3, start: 10,   duration: 1.5, status: "upcoming",  color: "chart-2", zoom: "https://zoom.us/j/6" },
  { id: "s7",  subject: "English Essay Clinic", tutor: "Helena Brandt",  student: "Aarav Sharma",  day: 4, start: 13,   duration: 1,   status: "upcoming",  color: "chart-3", zoom: "https://zoom.us/j/7" },
  { id: "s8",  subject: "Calculus II",          tutor: "Daniel Okafor",  student: "Aarav Sharma",  day: 4, start: 16,   duration: 1,   status: "upcoming",  color: "chart-1", zoom: "https://zoom.us/j/8" },
  { id: "s9",  subject: "IB Theory of Knowledge", tutor: "Helena Brandt", student: "Aarav Sharma", day: 5, start: 10,   duration: 1.5, status: "upcoming",  color: "chart-3", zoom: "https://zoom.us/j/9" },
]

export const upcomingClasses = [
  { id: "u1", subject: "Calculus II",            topic: "Integration by parts",       tutor: "Daniel Okafor",  time: "Today · 9:00 AM",   status: "live",     color: "chart-1" },
  { id: "u2", subject: "Chemistry Lab Review",   topic: "Titration analysis",         tutor: "Mei Lin",        time: "Today · 2:00 PM",   status: "upcoming", color: "chart-4" },
  { id: "u3", subject: "Physics — Waves",        topic: "Standing waves & resonance", tutor: "Daniel Okafor",  time: "Thu · 10:00 AM",    status: "upcoming", color: "chart-2" },
  { id: "u4", subject: "English Essay Clinic",   topic: "Comparative close reading",  tutor: "Helena Brandt",  time: "Fri · 1:00 PM",     status: "upcoming", color: "chart-3" },
]

export const resources = [
  { id: "r1", title: "Integration Techniques — Complete Reference",  type: "PDF", subject: "Calculus II", size: "1.2 MB", date: "Jun 18", tutor: "Daniel Okafor" },
  { id: "r2", title: "Mechanics Problem Set 4 — Worked Solutions",   type: "PDF", subject: "Physics",     size: "880 KB", date: "Jun 17", tutor: "Daniel Okafor" },
  { id: "r3", title: "Titration Lab — Annotated Worked Example",     type: "DOC", subject: "Chemistry",   size: "640 KB", date: "Jun 15", tutor: "Mei Lin"       },
  { id: "r4", title: "Essay Structure & Argumentation Template",     type: "DOC", subject: "English",     size: "320 KB", date: "Jun 12", tutor: "Helena Brandt" },
]

export const recordings = [
  { id: "rec1", title: "Calculus II — Derivatives Deep Dive",       tutor: "Daniel Okafor", duration: "58:21",   date: "Jun 16", thumb: "chart-1" },
  { id: "rec2", title: "Physics — Newton's Laws & Applications",    tutor: "Daniel Okafor", duration: "1:04:10", date: "Jun 14", thumb: "chart-2" },
  { id: "rec3", title: "English — Thesis Construction Masterclass", tutor: "Helena Brandt", duration: "47:55",   date: "Jun 11", thumb: "chart-3" },
]

// Progress over the term (per month)
export const progressTrend = [
  { label: "Jan", score: 68, attendance: 80 },
  { label: "Feb", score: 72, attendance: 86 },
  { label: "Mar", score: 75, attendance: 90 },
  { label: "Apr", score: 79, attendance: 87 },
  { label: "May", score: 84, attendance: 93 },
  { label: "Jun", score: 89, attendance: 97 },
]

export const subjectProgress = [
  { subject: "Calculus",  score: 89, color: "chart-1" },
  { subject: "Physics",   score: 83, color: "chart-2" },
  { subject: "Chemistry", score: 77, color: "chart-4" },
  { subject: "English",   score: 93, color: "chart-3" },
]

export const studyHours = [
  { label: "Mon", hours: 2.5 },
  { label: "Tue", hours: 1.5 },
  { label: "Wed", hours: 3.5 },
  { label: "Thu", hours: 2 },
  { label: "Fri", hours: 3 },
  { label: "Sat", hours: 4.5 },
  { label: "Sun", hours: 1.5 },
]

export const packageInfo = {
  total: 60,
  used: 42,
  remaining: 18,
  expiry: "Aug 31, 2026",
  plan: "Scholar Plus",
}

// Chat — shared thread with multiple roles
export type ChatMessage = {
  id: string
  author: string
  role: Role
  initials: string
  time: string
  text: string
  deleted?: boolean
}

export const chatThread: ChatMessage[] = [
  { id: "m1", author: "Sofia Reyes",    role: "admin",   initials: "SR", time: "9:02 AM", text: "Good morning — Aarav's Calculus & Physics track is now fully assigned to Daniel. Welcome aboard!" },
  { id: "m2", author: "Daniel Okafor",  role: "tutor",   initials: "DO", time: "9:05 AM", text: "Thanks Sofia! Aarav, really looking forward to our first session. I've shared an integration reference sheet in the resources tab." },
  { id: "m3", author: "Aarav Sharma",   role: "student", initials: "AS", time: "9:11 AM", text: "Thank you! The worked examples are really helpful. I had a question on the integration by parts section — specifically the tabular method." },
  { id: "m4", author: "Priya Sharma",   role: "parent",  initials: "PS", time: "9:20 AM", text: "This is wonderful to see. Would it be possible to receive a short progress note after each week's sessions?" },
  { id: "m5", author: "Daniel Okafor",  role: "tutor",   initials: "DO", time: "9:24 AM", text: "Absolutely Priya — I'll post a structured weekly summary every Friday covering focus areas, homework, and next steps." },
  { id: "m6", author: "Aarav Sharma",   role: "student", initials: "AS", time: "9:31 AM", text: "wrong link sorry", deleted: true },
  { id: "m7", author: "Aarav Sharma",   role: "student", initials: "AS", time: "9:32 AM", text: "Here's the practice problem I'm stuck on — I'll bring it to the session at 9. Looking forward to it!" },
]

export const deletedMessagesLog = [
  { id: "d1", author: "Aarav Sharma",  role: "student" as Role, time: "Today 9:31 AM",    text: "wrong link sorry",                      deletedBy: "Author" },
  { id: "d2", author: "Marco Ferraro", role: "parent"  as Role, time: "Jun 18 4:12 PM",   text: "Is the invoice for May still pending?", deletedBy: "Author" },
  { id: "d3", author: "Helena Brandt", role: "tutor"   as Role, time: "Jun 17 11:40 AM",  text: "Rescheduling — ignore previous message", deletedBy: "Admin (Sofia R.)" },
]

export const conversations = [
  { id: "c1", title: "Aarav Sharma — Math & Sciences", members: ["Aarav S.", "Priya S.", "Daniel O.", "Sofia R."], last: "Here's the practice problem I'm stuck on…", time: "9:32 AM",  unread: 2, active: true  },
  { id: "c2", title: "Lena Müller — Sciences Track",   members: ["Lena M.", "Klaus M.", "Mei Lin", "Sofia R."],    last: "Lab report uploaded ✓",                  time: "8:48 AM",  unread: 0 },
  { id: "c3", title: "Diego Torres — Languages",       members: ["Diego T.", "Helena B.", "Sofia R."],             last: "Great session today, well done!",         time: "Yesterday", unread: 0 },
  { id: "c4", title: "Yuki Tanaka — Full IB Program",  members: ["Yuki T.", "Akira T.", "Daniel O.", "Helena B."], last: "Next invoice scheduled for Jul 1",        time: "Yesterday", unread: 5 },
]

// Parent / Admin reports
export const reports = [
  { id: "rp1", title: "Weekly Progress — Calculus II",   tutor: "Daniel Okafor", date: "Jun 20", rating: 4.7, summary: "Aarav has a strong grasp of integration fundamentals. Recommend additional practice on integration by parts under time constraints." },
  { id: "rp2", title: "Weekly Progress — Physics",       tutor: "Daniel Okafor", date: "Jun 20", rating: 4.4, summary: "Mechanics is solid. Wave mechanics needs reinforcement — will cover standing waves and resonance next session." },
  { id: "rp3", title: "Monthly Summary — May 2026",      tutor: "Helena Brandt",  date: "May 31", rating: 4.9, summary: "Remarkable improvement in essay structure and argumentation. Ready for advanced comparative analysis." },
]

export const tutorFeedback = [
  { id: "tf1", tutor: "Daniel Okafor", subject: "Mathematics", text: "Aarav arrives consistently prepared and asks genuinely insightful questions. Key development area: timed problem solving under exam conditions.", rating: 5, date: "Jun 20" },
  { id: "tf2", tutor: "Mei Lin",       subject: "Chemistry",   text: "Good lab intuition and analytical thinking. Should revisit stoichiometry fundamentals before advancing to the next module.", rating: 4, date: "Jun 18" },
  { id: "tf3", tutor: "Helena Brandt", subject: "English",     text: "Outstanding analytical writing voice. Aarav is ready for advanced comparative essay structures and extended response formats.", rating: 5, date: "Jun 15" },
]

export const payments = [
  { id: "p1", invoice: "INV-2041", plan: "Scholar Plus — 20h", amount: 640, status: "paid", date: "Jun 1, 2026",  method: "Visa ···· 4421" },
  { id: "p2", invoice: "INV-1988", plan: "Scholar Plus — 20h", amount: 640, status: "paid", date: "May 1, 2026",  method: "Visa ···· 4421" },
  { id: "p3", invoice: "INV-1922", plan: "Top-up — 10h",       amount: 340, status: "paid", date: "Apr 18, 2026", method: "PayPal"         },
  { id: "p4", invoice: "INV-2099", plan: "Scholar Plus — 20h", amount: 640, status: "due",  date: "Jul 1, 2026",  method: "Visa ···· 4421" },
]

// Tutor data
export const assignedStudents = [
  { id: "as1", name: "Aarav Sharma",  grade: "Grade 10 · IB Diploma",  subjects: ["Calculus", "Physics"],    nextClass: "Today 9:00 AM",      progress: 89, initials: "AS", color: "chart-1", status: "active" },
  { id: "as2", name: "Lena Müller",   grade: "Grade 11 · A-Level",     subjects: ["Physics"],               nextClass: "Tomorrow 10:30 AM",  progress: 74, initials: "LM", color: "chart-2", status: "active" },
  { id: "as3", name: "Diego Torres",  grade: "Grade 9",                subjects: ["Mathematics"],           nextClass: "Thu 4:00 PM",        progress: 81, initials: "DT", color: "chart-3", status: "active" },
  { id: "as4", name: "Yuki Tanaka",   grade: "Grade 12 · IB Diploma",  subjects: ["Calculus", "Physics"],   nextClass: "Fri 11:00 AM",       progress: 94, initials: "YT", color: "chart-4", status: "active" },
  { id: "as5", name: "Amara Okeke",   grade: "Grade 10",               subjects: ["Mathematics"],           nextClass: "Not scheduled",      progress: 67, initials: "AO", color: "chart-5", status: "paused" },
]

export const tutorAvailability = [
  { day: "Mon", slots: ["09:00", "10:00", "15:00", "16:00"] },
  { day: "Tue", slots: ["11:00", "14:00"] },
  { day: "Wed", slots: ["09:00", "14:00", "15:00"] },
  { day: "Thu", slots: ["10:00", "11:00", "16:00"] },
  { day: "Fri", slots: ["13:00", "16:00"] },
  { day: "Sat", slots: ["10:00", "11:00", "12:00"] },
]

export const earningsTrend = [
  { label: "Jan", amount: 2840 },
  { label: "Feb", amount: 3120 },
  { label: "Mar", amount: 3460 },
  { label: "Apr", amount: 3280 },
  { label: "May", amount: 3920 },
  { label: "Jun", amount: 4310 },
]

export const earningsBreakdown = [
  { label: "Mathematics", value: 2480, color: "chart-1" },
  { label: "Physics",     value: 1380, color: "chart-2" },
  { label: "Bonuses",     value: 450,  color: "chart-4" },
]

// Admin data
export const adminStats = {
  students: 1284,
  tutors: 186,
  activeClasses: 342,
  revenue: 248900,
}

export const revenueTrend = [
  { label: "Jan", revenue: 182000, expenses: 96000 },
  { label: "Feb", revenue: 196500, expenses: 101000 },
  { label: "Mar", revenue: 211000, expenses: 104000 },
  { label: "Apr", revenue: 224800, expenses: 110000 },
  { label: "May", revenue: 238400, expenses: 113500 },
  { label: "Jun", revenue: 248900, expenses: 118200 },
]

export const enrollmentByRegion = [
  { label: "Europe",    value: 412, color: "chart-1" },
  { label: "Asia",      value: 386, color: "chart-2" },
  { label: "N. America",value: 298, color: "chart-3" },
  { label: "Africa",    value: 124, color: "chart-4" },
  { label: "Other",     value: 64,  color: "chart-5" },
]

export const adminStudents = [
  { id: "ast1", name: "Aarav Sharma",  region: "Asia",       tutor: "Daniel Okafor",  plan: "Scholar Plus", hours: 18, status: "active",  initials: "AS", color: "chart-1" },
  { id: "ast2", name: "Lena Müller",   region: "Europe",     tutor: "Daniel Okafor",  plan: "Premium",      hours: 24, status: "active",  initials: "LM", color: "chart-2" },
  { id: "ast3", name: "Diego Torres",  region: "N. America", tutor: "Unassigned",     plan: "Starter",      hours: 6,  status: "pending", initials: "DT", color: "chart-3" },
  { id: "ast4", name: "Yuki Tanaka",   region: "Asia",       tutor: "Helena Brandt",  plan: "Premium",      hours: 30, status: "active",  initials: "YT", color: "chart-4" },
  { id: "ast5", name: "Amara Okeke",   region: "Africa",     tutor: "Unassigned",     plan: "Scholar Plus", hours: 2,  status: "at-risk", initials: "AO", color: "chart-5" },
  { id: "ast6", name: "Marco Ferraro", region: "Europe",     tutor: "Mei Lin",        plan: "Starter",      hours: 9,  status: "active",  initials: "MF", color: "chart-1" },
]

export const adminTutors = [
  { id: "atu1", name: "Daniel Okafor", subjects: "Math · Physics",      students: 14, rating: 4.9, load: 86, initials: "DO", color: "chart-1", status: "active"     },
  { id: "atu2", name: "Helena Brandt", subjects: "English · History",   students: 11, rating: 4.8, load: 72, initials: "HB", color: "chart-3", status: "active"     },
  { id: "atu3", name: "Mei Lin",       subjects: "Chemistry · Biology", students: 9,  rating: 4.7, load: 64, initials: "ML", color: "chart-2", status: "active"     },
  { id: "atu4", name: "Klaus Weber",   subjects: "Economics",           students: 6,  rating: 4.6, load: 41, initials: "KW", color: "chart-4", status: "onboarding" },
]

export const quickActions = [
  { id: "qa1", label: "Assign Tutor",     desc: "Match students to tutors"   },
  { id: "qa2", label: "Schedule Class",   desc: "Create a new session"       },
  { id: "qa3", label: "Add Student",      desc: "Onboard a new learner"      },
  { id: "qa4", label: "Generate Report",  desc: "Export term summary"        },
]

export type SchedulerLeadStatus = "new" | "contacted" | "follow_up" | "trial_scheduled" | "converted" | "lost"

export type SchedulerLead = {
  id: string
  name: string
  parent: string
  subject: string
  curriculum: string
  location: string
  contact: string
  priority: "High" | "Medium" | "Low"
  status: SchedulerLeadStatus
  nextAction: string
  activity: string[]
}

export const schedulerLeads: SchedulerLead[] = [
  {
    id: "lead-1",
    name: "Riya Patel",
    parent: "Meera Patel",
    subject: "Math Foundations",
    curriculum: "IB Grade 10",
    location: "Dubai",
    contact: "+971 50 111 2233",
    priority: "High",
    status: "follow_up",
    nextAction: "Call back today and confirm whether the family wants a trial",
    activity: [
      "10:32 AM — call completed",
      "11:05 AM — parent asked for a weekday evening slot",
      "Yesterday — trial request captured",
    ],
  },
  {
    id: "lead-2",
    name: "Noah Brooks",
    parent: "Lina Brooks",
    subject: "Physics",
    curriculum: "GCSE",
    location: "London",
    contact: "+44 7700 900123",
    priority: "Medium",
    status: "contacted",
    nextAction: "Book a trial after collecting the preferred tutor and time",
    activity: [
      "09:10 AM — contact attempt logged",
      "09:40 AM — parent replied with availability",
    ],
  },
  {
    id: "lead-3",
    name: "Mina Hassan",
    parent: "Omar Hassan",
    subject: "English",
    curriculum: "A-Level",
    location: "Abu Dhabi",
    contact: "+971 56 332 8877",
    priority: "High",
    status: "trial_scheduled",
    nextAction: "Send reminder to tutor and parent before the trial",
    activity: [
      "Yesterday — trial booked for 4:30 PM",
      "Today — meeting link prepared",
    ],
  },
  {
    id: "lead-4",
    name: "Sasha Kim",
    parent: "Jin Kim",
    subject: "Chemistry",
    curriculum: "IGCSE",
    location: "Seoul",
    contact: "+82 10 5555 4444",
    priority: "Low",
    status: "new",
    nextAction: "Send a welcome note and confirm the preferred curriculum",
    activity: ["Just arrived from the website form"],
  },
]

export const schedulerTodayItems = [
  { id: "today-1", title: "Call with Meera Patel", detail: "Confirm trial preferences and next follow-up date", time: "10:30 AM" },
  { id: "today-2", title: "Trial with Mina Hassan", detail: "English A-Level trial with Daniel Okafor", time: "4:30 PM" },
  { id: "today-3", title: "Tutor availability review", detail: "Check Thursday evening slots for Physics", time: "6:00 PM" },
]

export const schedulerCalendarEvents = [
  { id: "cal-1", day: "Today", title: "Lead callback", detail: "Riya Patel · follow-up call", type: "call" },
  { id: "cal-2", day: "Tomorrow", title: "Trial session", detail: "Mina Hassan · English A-Level", type: "trial" },
  { id: "cal-3", day: "Thu", title: "Tutor check-in", detail: "Physics coverage review", type: "ops" },
]

export const activityFeed = [
  { id: "af1", text: "Daniel Okafor uploaded a resource to Calculus II",             time: "12m ago",  type: "resource" },
  { id: "af2", text: "Invoice INV-2099 generated for Yuki Tanaka ($640)",            time: "38m ago",  type: "payment"  },
  { id: "af3", text: "Amara Okeke flagged as at-risk — low attendance this month",   time: "1h ago",   type: "alert"    },
  { id: "af4", text: "Helena Brandt completed 3 sessions today",                     time: "2h ago",   type: "class"    },
  { id: "af5", text: "New student Diego Torres awaiting tutor assignment",           time: "3h ago",   type: "student"  },
]
