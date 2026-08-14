import { apiClient } from './api-client';

export interface LinkedChildItem {
  id: string;
  studentName: string;
  grade: string;
  curriculum: string;
  assignedTutorName: string;
  assignedTutorSubject: string;
  caseAdminId: string;
  remainingHours: number;
  totalHoursPurchased: number;
}

export interface ParentDashboardData {
  parentName: string;
  linkedChildren: LinkedChildItem[];
  reportsSubmittedThisMonthCount: number;
  totalReportsExpectedThisMonthCount: number;
  nextClass?: {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    subject: string;
    tutorName: string;
    scheduledAt: string;
    zoomUrl: string;
  } | null;
  paymentsSummary: {
    totalSpent: number;
    pendingCount: number;
    dueAmount: number;
  };
}

export interface ParentClassSession {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  subject: string;
  tutorName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'DONE' | 'CANCELLED';
  attendanceStatus?: 'PRESENT' | 'LATE' | 'ABSENT' | 'CANCELLED' | null;
  zoomUrl?: string;
}

export interface TutorReportItem {
  id: string;
  studentId: string;
  studentName: string;
  tutorName: string;
  subject: string;
  period: string; // e.g. "Weekly - August 2026"
  ratingScore: number; // 1-5 tutor evaluation rating of student's progress
  progressNotes: string;
  recommendations: string;
  createdAt: string;
}

export interface ParentPaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isConversionPayment: boolean;
  receiptUrl?: string | null;
  createdAt: string;
  caseAdminId: string;
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getParentDashboard(): Promise<ParentDashboardData> {
  try {
    return await apiClient('/parents/me');
  } catch {
    return {
      parentName: 'Priya Sharma',
      linkedChildren: [
        {
          id: 'st-01',
          studentName: 'Aarav Sharma',
          grade: 'Grade 10',
          curriculum: 'IB Diploma Programme',
          assignedTutorName: 'Dr. Alan Turing',
          assignedTutorSubject: 'Mathematics HL',
          caseAdminId: 'usr-demo-01',
          remainingHours: 14,
          totalHoursPurchased: 20,
        },
        {
          id: 'st-02',
          studentName: 'Maya Sharma',
          grade: 'Grade 8',
          curriculum: 'IGCSE',
          assignedTutorName: 'Prof. Ada Lovelace',
          assignedTutorSubject: 'Physics',
          caseAdminId: 'usr-demo-01',
          remainingHours: 8,
          totalHoursPurchased: 10,
        },
      ],
      reportsSubmittedThisMonthCount: 3,
      totalReportsExpectedThisMonthCount: 4,
      nextClass: {
        id: 'sess-live-01',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        title: 'Weekly IB Math HL Calculus Prep',
        subject: 'Mathematics HL',
        tutorName: 'Dr. Alan Turing',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
      },
      paymentsSummary: {
        totalSpent: 1200,
        pendingCount: 1,
        dueAmount: 0,
      },
    };
  }
}

// ── Classes API ───────────────────────────────────────────────────────────────

export async function getParentClasses(childId?: string): Promise<ParentClassSession[]> {
  try {
    const query = childId && childId !== 'ALL' ? `?studentId=${childId}` : '';
    const data = await apiClient(`/parents/me/classes${query}`);
    return Array.isArray(data) ? data : data?.classes || [];
  } catch {
    const all: ParentClassSession[] = [
      {
        id: 'sess-live-01',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        title: 'Weekly IB Math HL Calculus Prep',
        subject: 'Mathematics HL',
        tutorName: 'Dr. Alan Turing',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        durationMinutes: 60,
        status: 'SCHEDULED',
        zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
      },
      {
        id: 'sess-live-02',
        studentId: 'st-02',
        studentName: 'Maya Sharma',
        title: 'IGCSE Physics Mechanics',
        subject: 'Physics',
        tutorName: 'Prof. Ada Lovelace',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        status: 'SCHEDULED',
      },
    ];

    if (childId && childId !== 'ALL') {
      return all.filter((s) => s.studentId === childId);
    }
    return all;
  }
}

// ── Tutor Reports API ──────────────────────────────────────────────────────────

export async function getParentReports(childId?: string): Promise<TutorReportItem[]> {
  try {
    const query = childId && childId !== 'ALL' ? `?studentId=${childId}` : '';
    const data = await apiClient(`/parents/me/reports${query}`);
    return Array.isArray(data) ? data : data?.reports || [];
  } catch {
    const all = [
      {
        id: 'tr-1',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        tutorName: 'Dr. Alan Turing',
        subject: 'Mathematics HL',
        period: 'Monthly - July 2026',
        ratingScore: 5,
        progressNotes: 'Aarav shows exceptional analytical skills in differential calculus and vector geometry.',
        recommendations: 'Continue practicing past IB HL exam questions under timed conditions.',
        createdAt: '2026-07-31',
      },
      {
        id: 'tr-2',
        studentId: 'st-02',
        studentName: 'Maya Sharma',
        tutorName: 'Prof. Ada Lovelace',
        subject: 'Physics',
        period: 'Monthly - July 2026',
        ratingScore: 4,
        progressNotes: 'Maya has improved steadily in kinematic equation derivation.',
        recommendations: 'Review stoichiometry and unit conversion basics before next unit.',
        createdAt: '2026-07-30',
      },
    ];

    if (childId && childId !== 'ALL') {
      return all.filter((r) => r.studentId === childId);
    }
    return all;
  }
}

// ── Payments & Receipt Upload API ──────────────────────────────────────────────

export async function getParentPayments(): Promise<ParentPaymentItem[]> {
  try {
    const data = await apiClient('/parents/me/payments');
    return Array.isArray(data) ? data : data?.payments || [];
  } catch {
    return [
      {
        id: 'pmt-ren-201',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        packageName: 'Silver Package (20 hrs)',
        amount: 560,
        paymentMethod: 'Bank Transfer',
        status: 'PENDING',
        isConversionPayment: false,
        receiptUrl: undefined,
        createdAt: new Date().toISOString(),
        caseAdminId: 'usr-demo-01',
      },
    ];
  }
}

export async function uploadPaymentReceipt(paymentId: string, receiptUrl: string): Promise<void> {
  return apiClient(`/payments/${paymentId}/receipt`, {
    method: 'POST',
    body: JSON.stringify({ receiptUrl }),
  });
}

// ── Rate Your Tutor API ────────────────────────────────────────────────────────

export async function rateTutor(data: {
  studentId: string;
  tutorId: string;
  ratingScore: number;
  comment?: string;
}): Promise<void> {
  return apiClient('/tutors/rate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
