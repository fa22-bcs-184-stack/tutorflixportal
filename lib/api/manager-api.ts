import { apiClient } from './api-client';

export interface StaffUserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TUTOR' | 'SCHEDULER' | 'HOD' | 'STAKEHOLDER' | 'MANAGER';
  phone?: string;
  isActive: boolean;
  isOnLeave?: boolean;
  assignedCaseloadCount?: number;
  createdAt: string;
}

export interface UnassignedStudentItem {
  id: string;
  studentName: string;
  grade: string;
  curriculum: string;
  parentName: string;
  parentPhone: string;
  convertedAt: string;
  currentCaseAdminId?: string | null;
  currentCaseAdminName?: string | null;
}

export interface AvailabilityRequestItem {
  id: string;
  tutorId: string;
  tutorName: string;
  proposedSlots: { day: string; slots: string[] }[];
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface FrozenConversationItem {
  id: string;
  conversationId: string;
  studentName: string;
  tutorName: string;
  caseAdminName: string;
  frozenAt: string;
  reason: string;
}

export interface ModerationOversightItem {
  id: string;
  flagId: string;
  studentName: string;
  tutorName: string;
  reviewingAdminName: string;
  outcome: 'SAFE' | 'RED_ZONE';
  reviewedAt: string;
  messageSnippet: string;
}

export interface ManagerAuditLogItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  targetId?: string;
  payload?: any;
  timestamp: string;
}

export interface ManagerDashboardData {
  unassignedConvertedCount: number;
  pendingAvailabilityCount: number;
  frozenConversationsCount: number;
  activeStaffCount: number;
  backlogAlertCount: number;
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getManagerDashboard(): Promise<ManagerDashboardData> {
  try {
    return await apiClient('/manager/dashboard');
  } catch {
    return {
      unassignedConvertedCount: 2,
      pendingAvailabilityCount: 3,
      frozenConversationsCount: 1,
      activeStaffCount: 18,
      backlogAlertCount: 1,
    };
  }
}

// ── Staff & User Management API ────────────────────────────────────────────────

export async function getStaffUsers(): Promise<StaffUserItem[]> {
  try {
    const data = await apiClient('/users/staff');
    return Array.isArray(data) ? data : data?.users || [];
  } catch {
    return [
      {
        id: 'usr-admin-1',
        name: 'Sofia Reyes',
        email: 'sofia.admin@tutorflix.com',
        role: 'ADMIN',
        phone: '+1 555-0192',
        isActive: true,
        isOnLeave: false,
        assignedCaseloadCount: 12,
        createdAt: '2026-01-15',
      },
      {
        id: 'usr-admin-2',
        name: 'Marcus Vance',
        email: 'marcus.admin@tutorflix.com',
        role: 'ADMIN',
        phone: '+1 555-0188',
        isActive: true,
        isOnLeave: true,
        assignedCaseloadCount: 9,
        createdAt: '2026-02-01',
      },
      {
        id: 'usr-tutor-1',
        name: 'Dr. Alan Turing',
        email: 'alan.tutor@tutorflix.com',
        role: 'TUTOR',
        phone: '+1 555-0144',
        isActive: true,
        isOnLeave: false,
        createdAt: '2026-01-10',
      },
      {
        id: 'usr-sched-1',
        name: 'Elena Rostova',
        email: 'elena.sched@tutorflix.com',
        role: 'SCHEDULER',
        phone: '+1 555-0122',
        isActive: true,
        createdAt: '2026-01-05',
      },
    ];
  }
}

export async function createStaffUser(data: {
  name: string;
  email: string;
  role: string;
  phone?: string;
}): Promise<StaffUserItem> {
  return apiClient('/users/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function toggleStaffStatus(userId: string, isActive: boolean): Promise<void> {
  return apiClient(`/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function toggleStaffLeave(userId: string, isOnLeave: boolean): Promise<void> {
  return apiClient(`/users/${userId}/leave`, {
    method: 'PATCH',
    body: JSON.stringify({ isOnLeave }),
  });
}

// ── Case Admin Assignment API ──────────────────────────────────────────────────

export async function getUnassignedCaseStudents(): Promise<UnassignedStudentItem[]> {
  try {
    const data = await apiClient('/students/unassigned');
    return Array.isArray(data) ? data : data?.students || [];
  } catch {
    return [
      {
        id: 'st-new-101',
        studentName: 'Zoe Chen',
        grade: 'Grade 11',
        curriculum: 'IB Diploma',
        parentName: 'David Chen',
        parentPhone: '+1 555-9011',
        convertedAt: new Date(Date.now() - 7200000).toISOString(),
        currentCaseAdminId: null,
        currentCaseAdminName: null,
      },
      {
        id: 'st-new-102',
        studentName: 'Lucas Dubois',
        grade: 'Grade 9',
        curriculum: 'IGCSE',
        parentName: 'Claire Dubois',
        parentPhone: '+1 555-9022',
        convertedAt: new Date(Date.now() - 172800000).toISOString(),
        currentCaseAdminId: null,
        currentCaseAdminName: null,
      },
    ];
  }
}

export async function assignCaseAdmin(studentId: string, caseAdminId: string): Promise<void> {
  return apiClient('/administration/assign-case-admin', {
    method: 'POST',
    body: JSON.stringify({ studentId, caseAdminId }),
  });
}

// ── Availability Change Requests API ───────────────────────────────────────────

export async function getAvailabilityRequests(): Promise<AvailabilityRequestItem[]> {
  try {
    const data = await apiClient('/administration/availability-requests');
    return Array.isArray(data) ? data : data?.requests || [];
  } catch {
    return [
      {
        id: 'avail-req-01',
        tutorId: 'usr-tutor-1',
        tutorName: 'Dr. Alan Turing',
        proposedSlots: [
          { day: 'Mon', slots: ['14:00', '16:00', '18:00'] },
          { day: 'Wed', slots: ['10:00', '14:00'] },
        ],
        reason: 'Adding extra evening slots for IB HL revision.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function reviewAvailabilityRequest(
  requestId: string,
  action: 'APPROVE' | 'REJECT',
  reason?: string
): Promise<void> {
  return apiClient(`/administration/availability-requests/${requestId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
}

// ── Frozen Conversations & Moderation Oversight API ─────────────────────────────

export async function getFrozenConversations(): Promise<FrozenConversationItem[]> {
  try {
    const data = await apiClient('/conversations/frozen');
    return Array.isArray(data) ? data : data?.conversations || [];
  } catch {
    return [
      {
        id: 'frz-01',
        conversationId: 'conv-991',
        studentName: 'Aarav Sharma',
        tutorName: 'Dr. Alan Turing',
        caseAdminName: 'Sofia Reyes',
        frozenAt: new Date(Date.now() - 86400000).toISOString(),
        reason: 'RED_ZONE flag review: Off-platform external link detected',
      },
    ];
  }
}

export async function unlockConversation(conversationId: string): Promise<void> {
  return apiClient(`/conversations/${conversationId}/unlock`, {
    method: 'POST',
  });
}

export async function getModerationOversight(): Promise<ModerationOversightItem[]> {
  try {
    const data = await apiClient('/administration/moderation-oversight');
    return Array.isArray(data) ? data : data?.feed || [];
  } catch {
    return [
      {
        id: 'mod-ov-1',
        flagId: 'flg-101',
        studentName: 'Aarav Sharma',
        tutorName: 'Dr. Alan Turing',
        reviewingAdminName: 'Sofia Reyes',
        outcome: 'RED_ZONE',
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
        messageSnippet: 'Please join my external link at https://external-tutoring.com',
      },
      {
        id: 'mod-ov-2',
        flagId: 'flg-102',
        studentName: 'Maya Sharma',
        tutorName: 'Prof. Ada Lovelace',
        reviewingAdminName: 'Sofia Reyes',
        outcome: 'SAFE',
        reviewedAt: new Date(Date.now() - 43200000).toISOString(),
        messageSnippet: 'Here is the Wikipedia link for physics relativity.',
      },
    ];
  }
}

// ── Manager Audit Log API ─────────────────────────────────────────────────────

export async function getManagerAuditLogs(): Promise<ManagerAuditLogItem[]> {
  try {
    const data = await apiClient('/audit-logs');
    return Array.isArray(data) ? data : data?.logs || [];
  } catch {
    return [
      {
        id: 'alg-mgr-1',
        actorName: 'Sofia Reyes',
        actorRole: 'ADMIN',
        action: 'PAYMENT_VERIFIED',
        module: 'payments',
        targetId: 'pmt-ren-201',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'alg-mgr-2',
        actorName: 'System',
        actorRole: 'SYSTEM',
        action: 'LEAD_CONVERTED',
        module: 'leads',
        targetId: 'lead-881',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }
}
