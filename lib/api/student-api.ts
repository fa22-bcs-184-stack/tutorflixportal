import { apiClient } from './api-client';

export interface StudentDashboardStats {
  studentName: string;
  grade: string;
  curriculum: string;
  remainingHours: number;
  totalHoursPurchased: number;
  assignedTutorName: string;
  assignedTutorSubject: string;
  liveClass?: {
    id: string;
    title: string;
    subject: string;
    tutorName: string;
    scheduledAt: string;
    zoomUrl: string;
  } | null;
  subjectBreakdown: {
    subject: string;
    classesCount: number;
    hoursCount: number;
  }[];
}

export interface StudentClassSession {
  id: string;
  title: string;
  subject: string;
  tutorName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'DONE' | 'CANCELLED';
  attendanceStatus?: 'PRESENT' | 'LATE' | 'ABSENT' | 'CANCELLED' | null;
  zoomUrl?: string;
}

export interface StudentResourceItem {
  id: string;
  title: string;
  subject: string;
  tutorName: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOC' | 'SLIDES';
  fileSize: string;
  uploadedAt: string;
}

export interface StudentProgressData {
  overallAttendanceRate: number;
  totalStudyHours: number;
  completedSessionsCount: number;
  subjectAttendance: {
    subject: string;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    cancelledCount: number;
  }[];
  tutorNotes: {
    id: string;
    tutorName: string;
    subject: string;
    date: string;
    noteText: string; // Qualitative notes only (no numeric rating)
  }[];
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getStudentDashboard(): Promise<StudentDashboardStats> {
  try {
    return await apiClient('/students/me');
  } catch {
    return {
      studentName: 'Aarav Sharma',
      grade: 'Grade 10',
      curriculum: 'IB Diploma Programme',
      remainingHours: 14,
      totalHoursPurchased: 20,
      assignedTutorName: 'Dr. Alan Turing',
      assignedTutorSubject: 'Mathematics HL',
      liveClass: {
        id: 'sess-live-01',
        title: 'Weekly IB Math HL Calculus Prep',
        subject: 'Mathematics HL',
        tutorName: 'Dr. Alan Turing',
        scheduledAt: new Date(Date.now() + 1800000).toISOString(),
        zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
      },
      subjectBreakdown: [
        { subject: 'Mathematics HL', classesCount: 8, hoursCount: 8 },
        { subject: 'Physics', classesCount: 4, hoursCount: 6 },
        { subject: 'Chemistry', classesCount: 2, hoursCount: 2 },
      ],
    };
  }
}

export async function initiateTopUpPurchase(data: {
  packageId?: string;
  customHours?: number;
}): Promise<{ purchaseId: string; amount: number }> {
  return apiClient('/purchases/topup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Classes & Calendar API ─────────────────────────────────────────────────────

export async function getStudentClasses(): Promise<StudentClassSession[]> {
  try {
    const data = await apiClient('/students/me/classes');
    return Array.isArray(data) ? data : data?.classes || [];
  } catch {
    return [
      {
        id: 'sess-live-01',
        title: 'Weekly IB Math HL Calculus Prep',
        subject: 'Mathematics HL',
        tutorName: 'Dr. Alan Turing',
        scheduledAt: new Date(Date.now() + 1800000).toISOString(),
        durationMinutes: 60,
        status: 'SCHEDULED',
        zoomUrl: 'https://teams.microsoft.com/l/meetup-join/math-hl',
      },
      {
        id: 'sess-past-01',
        title: 'Physics Mechanics Vectors & Dynamics',
        subject: 'Physics',
        tutorName: 'Prof. Ada Lovelace',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        durationMinutes: 90,
        status: 'DONE',
        attendanceStatus: 'PRESENT',
      },
    ];
  }
}

export async function requestStudentSession(data: {
  subject: string;
  tutorId?: string;
  slotTime: string;
  recurrence: string;
  startDate: string;
  endDate: string;
}): Promise<void> {
  return apiClient('/classes/request', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function rescheduleStudentSession(
  sessionId: string,
  data: { proposedDateTime: string; reason: string }
): Promise<void> {
  return apiClient(`/classes/sessions/${sessionId}/reschedule`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelStudentSession(sessionId: string, reason: string): Promise<void> {
  return apiClient(`/classes/sessions/${sessionId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ cancelledByRole: 'STUDENT', reason }),
  });
}

// ── Student-Scoped Resources API ───────────────────────────────────────────────

export async function getStudentResources(): Promise<StudentResourceItem[]> {
  try {
    const data = await apiClient('/students/me/resources');
    return Array.isArray(data) ? data : data?.resources || [];
  } catch {
    return [
      {
        id: 'res-st-1',
        title: 'IB Math HL Calculus Past Paper 2025 Worked Solutions',
        subject: 'Mathematics HL',
        tutorName: 'Dr. Alan Turing',
        fileUrl: '/placeholder-resource.pdf',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'res-st-2',
        title: 'Physics Mechanics Formulas & Key Revision Notes',
        subject: 'Physics',
        tutorName: 'Prof. Ada Lovelace',
        fileUrl: '/placeholder-resource.pdf',
        fileType: 'SLIDES',
        fileSize: '4.1 MB',
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }
}

// ── Progress & Attendance API ──────────────────────────────────────────────────

export async function getStudentProgress(): Promise<StudentProgressData> {
  try {
    return await apiClient('/students/me/progress');
  } catch {
    return {
      overallAttendanceRate: 94,
      totalStudyHours: 16,
      completedSessionsCount: 14,
      subjectAttendance: [
        { subject: 'Mathematics HL', presentCount: 8, lateCount: 0, absentCount: 0, cancelledCount: 0 },
        { subject: 'Physics', presentCount: 4, lateCount: 1, absentCount: 0, cancelledCount: 0 },
        { subject: 'Chemistry', presentCount: 2, lateCount: 0, absentCount: 0, cancelledCount: 0 },
      ],
      tutorNotes: [
        {
          id: 'tn-1',
          tutorName: 'Dr. Alan Turing',
          subject: 'Mathematics HL',
          date: 'August 8, 2026',
          noteText: 'Aarav demonstrated excellent grasp of integration by parts. Recommend practicing timed problem solving under exam conditions.',
        },
        {
          id: 'tn-2',
          tutorName: 'Prof. Ada Lovelace',
          subject: 'Physics',
          date: 'August 4, 2026',
          noteText: 'Strong analytical problem-solving in vector kinematics. We will cover wave optics in the upcoming session.',
        },
      ],
    };
  }
}
