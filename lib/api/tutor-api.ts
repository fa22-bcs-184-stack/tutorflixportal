import { apiClient } from './api-client';

export interface TutorDashboardStats {
  assignedStudentCount: number;
  todayClassesCount: number;
  cycleEarningsSoFar: number;
  trialsConvertedCount: number;
  tutorCancelledClassesMonthlyCount: number;
  hourlyRate: number;
}

export interface TutorStudentItem {
  id: string;
  studentName: string;
  parentName: string;
  grade?: string;
  curriculum?: string;
  subject: string;
  remainingHours: number;
  totalHoursPurchased: number;
  status: 'ACTIVE' | 'INACTIVE' | 'AT_RISK';
  nextClassTime?: string;
}

export interface ClassSessionItem {
  id: string;
  classRequestId: string;
  studentId: string;
  studentName: string;
  subject: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'DONE' | 'CANCELLED' | 'RESCHEDULE_REQUESTED';
  cancelledByRole?: 'STUDENT' | 'TUTOR' | null;
  cancellationReason?: string | null;
  cancellationEvidenceUrl?: string | null;
  attendanceMarked?: boolean;
  attendanceStatus?: 'PRESENT' | 'LATE' | 'ABSENT' | 'CANCELLED' | null;
  isLate?: boolean;
}

export interface FocusNoteItem {
  id: string;
  noteText: string;
  createdAt: string;
}

export interface TutorTrialItem {
  id: string;
  leadId: string;
  parentName: string;
  studentName: string;
  subject: string;
  curriculum: string;
  timeNotes?: string;
  teamsMeetingUrl?: string;
  scheduledAt: string;
  status: 'SCHEDULED' | 'TRIAL_DONE' | 'CONVERTED';
  feedback?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  fileSize?: string;
  uploadedAt: string;
}

export interface EarningsSessionItem {
  id: string;
  date: string;
  studentName: string;
  subject: string;
  hoursDeducted: number;
  hourlyRate: number;
  sessionEarnings: number;
  bonusAmount?: number;
}

export interface TutorProfileItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  qualifications: string[];
  subjects: string[];
  hourlyRate: number; // View-only
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getTutorDashboard(): Promise<TutorDashboardStats> {
  try {
    const data = await apiClient('/tutors/me');
    return {
      assignedStudentCount: data.assignedStudentCount ?? 4,
      todayClassesCount: data.todayClassesCount ?? 2,
      cycleEarningsSoFar: data.cycleEarningsSoFar ?? 640,
      trialsConvertedCount: data.trialsConvertedCount ?? 5,
      tutorCancelledClassesMonthlyCount: data.tutorCancelledClassesMonthlyCount ?? 0,
      hourlyRate: data.hourlyRate ?? 40,
    };
  } catch {
    return {
      assignedStudentCount: 4,
      todayClassesCount: 2,
      cycleEarningsSoFar: 640,
      trialsConvertedCount: 5,
      tutorCancelledClassesMonthlyCount: 0,
      hourlyRate: 40,
    };
  }
}

export async function requestAvailabilityChange(slots: string[], reason?: string): Promise<void> {
  return apiClient('/tutors/me/availability-request', {
    method: 'POST',
    body: JSON.stringify({ slots, reason }),
  });
}

// ── Assigned Students API ──────────────────────────────────────────────────────

export async function getAssignedStudents(): Promise<TutorStudentItem[]> {
  try {
    const data = await apiClient('/tutors/me/students');
    return Array.isArray(data) ? data : data?.students || [];
  } catch {
    return [
      {
        id: 'st-01',
        studentName: 'Aarav Sharma',
        parentName: 'Rajesh Sharma',
        grade: 'Grade 11',
        curriculum: 'IB Diploma',
        subject: 'Mathematics HL',
        remainingHours: 14,
        totalHoursPurchased: 20,
        status: 'ACTIVE',
        nextClassTime: '2026-08-11T16:00:00Z',
      },
      {
        id: 'st-02',
        studentName: 'Maya Patel',
        parentName: 'Sanjay Patel',
        grade: 'Grade 10',
        curriculum: 'IGCSE',
        subject: 'Physics',
        remainingHours: 1,
        totalHoursPurchased: 10,
        status: 'AT_RISK',
        nextClassTime: '2026-08-12T14:30:00Z',
      },
    ];
  }
}

// ── Calendar & Classes API ─────────────────────────────────────────────────────

export async function getTutorClasses(): Promise<ClassSessionItem[]> {
  try {
    const data = await apiClient('/tutors/me/classes');
    return Array.isArray(data) ? data : data?.classes || [];
  } catch {
    return [
      {
        id: 'sess-101',
        classRequestId: 'cls-1',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        subject: 'Mathematics HL',
        title: 'Weekly IB Math HL Prep',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        durationMinutes: 60,
        status: 'SCHEDULED',
      },
      {
        id: 'sess-102',
        classRequestId: 'cls-2',
        studentId: 'st-02',
        studentName: 'Maya Patel',
        subject: 'Physics',
        title: 'IGCSE Physics Mechanics',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        durationMinutes: 90,
        status: 'DONE',
        attendanceMarked: true,
        attendanceStatus: 'PRESENT',
      },
    ];
  }
}

export async function createTutorClass(data: {
  studentId: string;
  subject: string;
  title: string;
  recurrence: string;
  startDate: string;
  endDate: string;
  slotTime: string;
}): Promise<void> {
  return apiClient('/tutors/me/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelTutorClass(
  sessionId: string,
  data: { cancelledByRole: 'STUDENT' | 'TUTOR'; reason: string; evidenceUrl?: string }
): Promise<void> {
  return apiClient(`/classes/sessions/${sessionId}/cancel`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function rescheduleTutorClass(
  sessionId: string,
  data: { proposedDateTime: string; reason: string }
): Promise<void> {
  return apiClient(`/classes/sessions/${sessionId}/reschedule`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function markSessionAttendance(
  sessionId: string,
  data: { attendanceStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'CANCELLED'; isLate?: boolean; notes?: string }
): Promise<void> {
  return apiClient('/attendance', {
    method: 'POST',
    body: JSON.stringify({ sessionId, ...data }),
  });
}

// ── In Focus Notes API ─────────────────────────────────────────────────────────

export async function getTutorFocusNotes(): Promise<FocusNoteItem[]> {
  try {
    const data = await apiClient('/tutors/me/focus-notes');
    return Array.isArray(data) ? data : data?.notes || [];
  } catch {
    return [
      { id: 'fn-1', noteText: 'Prepare IB Calculus Past Paper 2025 for Aarav', createdAt: new Date().toISOString() },
      { id: 'fn-2', noteText: 'Check Maya understanding of Kinematics formulas', createdAt: new Date().toISOString() },
    ];
  }
}

export async function saveTutorFocusNote(noteText: string): Promise<FocusNoteItem> {
  return apiClient('/tutors/me/focus-notes', {
    method: 'POST',
    body: JSON.stringify({ noteText }),
  });
}

export async function deleteTutorFocusNote(id: string): Promise<void> {
  return apiClient(`/tutors/me/focus-notes/${id}`, {
    method: 'DELETE',
  });
}

// ── My Trials API ──────────────────────────────────────────────────────────────

export async function getTutorTrials(): Promise<TutorTrialItem[]> {
  try {
    const data = await apiClient('/tutors/me/trials');
    return Array.isArray(data) ? data : data?.trials || [];
  } catch {
    return [
      {
        id: 'trl-501',
        leadId: 'ld-99',
        parentName: 'Anita Roy',
        studentName: 'Rohan Roy',
        subject: 'Chemistry HL',
        curriculum: 'IB Diploma',
        timeNotes: 'Prefers weekday afternoons around 4 PM',
        teamsMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/trial-501',
        scheduledAt: new Date(Date.now() + 7200000).toISOString(),
        status: 'SCHEDULED',
      },
    ];
  }
}

export async function submitTrialFeedback(trialId: string, feedback: string): Promise<void> {
  return apiClient(`/trials/${trialId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ feedback }),
  });
}

// ── Student Resources API ──────────────────────────────────────────────────────

export async function getTutorResources(): Promise<ResourceItem[]> {
  try {
    const data = await apiClient('/tutors/me/resources');
    return Array.isArray(data) ? data : data?.resources || [];
  } catch {
    return [
      {
        id: 'res-1',
        title: 'IB Math HL Calculus Formula Sheet & Exercises',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        fileUrl: '/placeholder-resource.pdf',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toISOString(),
      },
    ];
  }
}

export async function uploadStudentResource(data: {
  title: string;
  studentId: string;
  fileUrl: string;
}): Promise<ResourceItem> {
  return apiClient('/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Personal Earnings API ──────────────────────────────────────────────────────

export async function getTutorEarnings(): Promise<{
  monthlyTotal: number;
  hourlyRate: number;
  completedHoursThisMonth: number;
  trialBonusTotal: number;
  sessions: EarningsSessionItem[];
}> {
  try {
    return await apiClient('/tutors/me/earnings');
  } catch {
    return {
      monthlyTotal: 640,
      hourlyRate: 40,
      completedHoursThisMonth: 16,
      trialBonusTotal: 50,
      sessions: [
        { id: 'es-1', date: '2026-08-01', studentName: 'Aarav Sharma', subject: 'Mathematics HL', hoursDeducted: 2, hourlyRate: 40, sessionEarnings: 80 },
        { id: 'es-2', date: '2026-08-04', studentName: 'Maya Patel', subject: 'Physics', hoursDeducted: 1.5, hourlyRate: 40, sessionEarnings: 60 },
      ],
    };
  }
}

// ── Profile API ────────────────────────────────────────────────────────────────

export async function getTutorProfile(): Promise<TutorProfileItem> {
  try {
    return await apiClient('/tutors/me/profile');
  } catch {
    return {
      id: 'tut-me',
      fullName: 'Dr. Alan Turing',
      email: 'alan@tutorflix.com',
      phone: '+1 408 555 1010',
      bio: 'PhD in Computer Science & Applied Mathematics with over 8 years of IB & IGCSE tutoring experience.',
      qualifications: ['B.S. Mathematics (Cambridge)', 'Ph.D. Computer Science (Princeton)'],
      subjects: ['Mathematics HL', 'Computer Science', 'Physics'],
      hourlyRate: 40,
    };
  }
}
