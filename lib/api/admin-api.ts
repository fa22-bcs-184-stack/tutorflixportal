import { apiClient } from './api-client';

export interface PaymentItem {
  id: string;
  studentId: string;
  studentPurchaseId: string;
  amount: number;
  paymentMethod: string;
  receiptUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isConversionPayment: boolean;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  student?: {
    id: string;
    studentName: string;
    parentName: string;
    parentPhone?: string;
    caseAdminId?: string;
  };
  studentPurchase?: {
    id: string;
    packageName?: string;
    purchasedHours: number;
    remainingHours: number;
    status: string;
  };
}

export interface FamilyItem {
  id: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  grade?: string;
  curriculum?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AT_RISK';
  caseAdminId?: string | null;
  remainingHours: number;
  totalHoursPurchased: number;
  assignedTutor?: {
    id: string;
    fullName: string;
  } | null;
  createdAt: string;
}

export interface TutorAdminItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  subjects: string[];
  active: boolean;
  assignedStudentCount: number;
  rejectedClassesCount: number;
  flaggedMessagesCount: number;
  hourlyRate?: number;
}

export interface ClassRequestItem {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  title: string;
  recurrence: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  studentName: string;
  tutorName: string;
  sessionsGeneratedCount?: number;
}

export interface PurchaseItem {
  id: string;
  studentId: string;
  packageName?: string;
  purchasedHours: number;
  remainingHours: number;
  packagePrice: number;
  status: 'PENDING' | 'ACTIVE' | 'DEPLETED' | 'CANCELLED';
  purchaseDate: string;
  studentName: string;
  transactions?: PurchaseTransactionItem[];
}

export interface PurchaseTransactionItem {
  id: string;
  studentPurchaseId: string;
  type: 'CREDIT' | 'DEDUCTION' | 'ADJUSTMENT';
  hoursDelta: number;
  reason?: string;
  createdAt: string;
}

export interface MessageFlagItem {
  id: string;
  conversationId: string;
  messageId: string;
  studentId: string;
  studentName: string;
  flaggedContent: string;
  reason: string;
  status: 'PENDING' | 'SAFE' | 'RED_ZONE';
  reviewDueAt: string;
  isOverdue?: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  module: string;
  action: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
}

// ── Payment Verification API ───────────────────────────────────────────────────

export async function getPendingPayments(): Promise<PaymentItem[]> {
  try {
    const data = await apiClient('/payments?status=PENDING');
    const items = Array.isArray(data) ? data : data?.payments || [];
    // Filter to non-conversion payments only
    return items.filter((p: PaymentItem) => !p.isConversionPayment);
  } catch {
    return [
      {
        id: 'pmt-101',
        studentId: 'st-01',
        studentPurchaseId: 'sp-01',
        amount: 280,
        paymentMethod: 'Bank Transfer',
        receiptUrl: '/placeholder-receipt.png',
        status: 'PENDING',
        isConversionPayment: false,
        createdAt: new Date().toISOString(),
        student: {
          id: 'st-01',
          studentName: 'Aarav Sharma',
          parentName: 'Rajesh Sharma',
          parentPhone: '+91 98765 43210',
        },
        studentPurchase: {
          id: 'sp-01',
          packageName: 'Silver Package (20 hrs)',
          purchasedHours: 20,
          remainingHours: 2,
          status: 'ACTIVE',
        },
      },
    ];
  }
}

export async function approvePayment(paymentId: string): Promise<PaymentItem> {
  return apiClient(`/payments/${paymentId}/verify`, {
    method: 'POST',
  });
}

export async function rejectPayment(paymentId: string, reason: string): Promise<PaymentItem> {
  return apiClient(`/payments/${paymentId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// ── My Families API ────────────────────────────────────────────────────────────

export async function getMyFamilies(params?: { search?: string; status?: string }): Promise<FamilyItem[]> {
  const query = new URLSearchParams();
  query.append('myCaseload', 'true');
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);

  try {
    const data = await apiClient(`/students?${query.toString()}`);
    return Array.isArray(data) ? data : data?.students || [];
  } catch {
    return [
      {
        id: 'st-01',
        studentName: 'Aarav Sharma',
        parentName: 'Rajesh Sharma',
        parentEmail: 'rajesh.sharma@example.com',
        parentPhone: '+91 98765 43210',
        grade: 'Grade 11',
        curriculum: 'IB Diploma',
        status: 'ACTIVE',
        caseAdminId: 'usr-demo-01',
        remainingHours: 14,
        totalHoursPurchased: 20,
        assignedTutor: { id: 'tut-1', fullName: 'Dr. Alan Turing' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'st-02',
        studentName: 'Maya Patel',
        parentName: 'Sanjay Patel',
        parentEmail: 'sanjay.patel@example.com',
        parentPhone: '+91 98123 45678',
        grade: 'Grade 10',
        curriculum: 'IGCSE',
        status: 'AT_RISK',
        caseAdminId: 'usr-demo-01',
        remainingHours: 1,
        totalHoursPurchased: 10,
        assignedTutor: { id: 'tut-2', fullName: 'Prof. Ada Lovelace' },
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function getFamilyCredentials(studentId: string): Promise<{ username: string; tempPassword: string }> {
  return apiClient(`/students/${studentId}/regenerate-credentials`, {
    method: 'POST',
  });
}

export async function archiveStudent(studentId: string): Promise<void> {
  return apiClient(`/students/${studentId}`, {
    method: 'DELETE',
  });
}

// ── Shared Tutor Roster API ────────────────────────────────────────────────────

export async function getAllTutors(): Promise<TutorAdminItem[]> {
  try {
    const data = await apiClient('/tutors');
    return Array.isArray(data) ? data : data?.tutors || [];
  } catch {
    return [
      {
        id: 'tut-1',
        userId: 'u-1',
        fullName: 'Dr. Alan Turing',
        email: 'alan@tutorflix.com',
        phone: '+1 408 555 1010',
        subjects: ['Mathematics HL', 'Computer Science'],
        active: true,
        assignedStudentCount: 5,
        rejectedClassesCount: 1,
        flaggedMessagesCount: 0,
      },
      {
        id: 'tut-2',
        userId: 'u-2',
        fullName: 'Prof. Ada Lovelace',
        email: 'ada@tutorflix.com',
        phone: '+1 408 555 2020',
        subjects: ['Physics', 'Advanced Calculus'],
        active: true,
        assignedStudentCount: 3,
        rejectedClassesCount: 0,
        flaggedMessagesCount: 1,
      },
    ];
  }
}

export async function assignTutorToStudent(studentId: string, tutorId: string): Promise<void> {
  return apiClient('/tutors/assign', {
    method: 'POST',
    body: JSON.stringify({ studentId, tutorId }),
  });
}

// ── Classes & Scheduling API ───────────────────────────────────────────────────

export async function getAdminClasses(): Promise<ClassRequestItem[]> {
  try {
    const data = await apiClient('/classes');
    return Array.isArray(data) ? data : data?.classes || [];
  } catch {
    return [
      {
        id: 'cls-1',
        studentId: 'st-01',
        tutorId: 'tut-1',
        subject: 'Mathematics HL',
        title: 'Weekly IB Math HL Prep',
        recurrence: 'WEEKLY',
        startDate: '2026-08-15',
        endDate: '2026-10-15',
        status: 'ACCEPTED',
        studentName: 'Aarav Sharma',
        tutorName: 'Dr. Alan Turing',
        sessionsGeneratedCount: 8,
      },
    ];
  }
}

export async function createClassRequest(data: {
  studentId: string;
  tutorId: string;
  subject: string;
  title: string;
  recurrence: string;
  startDate: string;
  endDate: string;
}): Promise<ClassRequestItem> {
  return apiClient('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Purchases & Ledger API ─────────────────────────────────────────────────────

export async function getStudentPurchases(): Promise<PurchaseItem[]> {
  try {
    const data = await apiClient('/purchases');
    return Array.isArray(data) ? data : data?.purchases || [];
  } catch {
    return [
      {
        id: 'sp-01',
        studentId: 'st-01',
        packageName: 'Silver Package (20 hrs)',
        purchasedHours: 20,
        remainingHours: 14,
        packagePrice: 560,
        status: 'ACTIVE',
        purchaseDate: '2026-07-01',
        studentName: 'Aarav Sharma',
        transactions: [
          { id: 'tx-1', studentPurchaseId: 'sp-01', type: 'CREDIT', hoursDelta: 20, reason: 'Initial Package Purchase', createdAt: '2026-07-01' },
          { id: 'tx-2', studentPurchaseId: 'sp-01', type: 'DEDUCTION', hoursDelta: -2, reason: 'Session completed on July 5', createdAt: '2026-07-05' },
          { id: 'tx-3', studentPurchaseId: 'sp-01', type: 'DEDUCTION', hoursDelta: -4, reason: 'Session completed on July 12', createdAt: '2026-07-12' },
        ],
      },
    ];
  }
}

export async function createPurchaseAdjustment(data: {
  studentPurchaseId: string;
  hoursDelta: number;
  reason: string;
}): Promise<void> {
  return apiClient('/purchases/adjustment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Moderation Review API ──────────────────────────────────────────────────────

export async function getModerationFlags(): Promise<MessageFlagItem[]> {
  try {
    const data = await apiClient('/moderation/flags');
    return Array.isArray(data) ? data : data?.flags || [];
  } catch {
    return [
      {
        id: 'flag-301',
        conversationId: 'conv-01',
        messageId: 'msg-99',
        studentId: 'st-02',
        studentName: 'Maya Patel',
        flaggedContent: 'Call me at 555-0199 or email me@domain.com',
        reason: 'Contact details shared in message',
        status: 'PENDING',
        reviewDueAt: new Date(Date.now() + 14400000).toISOString(),
        isOverdue: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function reviewModerationFlag(flagId: string, action: 'SAFE' | 'RED_ZONE'): Promise<void> {
  return apiClient(`/moderation/flags/${flagId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}

// ── Audit Logs API ─────────────────────────────────────────────────────────────

export async function getCaseloadAuditLogs(): Promise<AuditLogItem[]> {
  try {
    const data = await apiClient('/audit-logs');
    return Array.isArray(data) ? data : data?.logs || [];
  } catch {
    return [
      {
        id: 'log-1',
        userId: 'usr-demo-01',
        module: 'payments',
        action: 'PAYMENT_VERIFIED',
        entityId: 'pmt-101',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
