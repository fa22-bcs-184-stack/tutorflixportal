import { apiClient } from './api-client';

export interface LeadItem {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentName: string;
  studentGrade?: string;
  preferredCurriculum?: string;
  preferredSubject?: string;
  preferredTime?: string;
  status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'TRIAL_SCHEDULED' | 'TRIAL_DONE' | 'CONVERTED' | 'LOST';
  nextFollowUpAt?: string | null;
  assignedSchedulerId?: string | null;
  salesMemberId?: string | null;
  salesMember?: {
    id: string;
    name: string;
    phone?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  performedBy?: string;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  noteText: string;
  createdBy: string;
  createdAt: string;
}

export interface SalesMember {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface TutorItem {
  id: string;
  userId: string;
  user?: {
    fullName: string;
    email: string;
  };
  subjects?: string[];
}

export interface PackageItem {
  id: string;
  packageName: string;
  hours: number;
  packagePrice: number;
  active: boolean;
}

export interface TrialItem {
  id: string;
  leadId: string;
  tutorId: string;
  subject: string;
  scheduledAt: string;
  status: 'SCHEDULED' | 'TRIAL_DONE' | 'CANCELLED';
  meetingLink?: string;
  tutorNotifiedAt?: string | null;
  parentNotifiedAt?: string | null;
  salesMemberNotifiedAt?: string | null;
  tutor?: {
    user?: {
      fullName: string;
    };
  };
  lead?: {
    studentName: string;
    parentName: string;
    parentPhone: string;
  };
}

// ── Lead API Functions ─────────────────────────────────────────────────────────

export async function getAssignedLeads(params?: { search?: string; status?: string; curriculum?: string }): Promise<LeadItem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.curriculum) query.append('curriculum', params.curriculum);
  
  const endpoint = `/leads${query.toString() ? `?${query.toString()}` : ''}`;
  try {
    const data = await apiClient(endpoint);
    return Array.isArray(data) ? data : data?.leads || [];
  } catch {
    return [];
  }
}

export async function getLeadDetails(id: string): Promise<{ lead: LeadItem; activities: LeadActivity[]; notes: LeadNote[] }> {
  const data = await apiClient(`/leads/${id}`);
  return {
    lead: data.lead || data,
    activities: data.activities || [],
    notes: data.notes || [],
  };
}

export async function updateLeadStatus(id: string, status: string, nextFollowUpAt?: string | null): Promise<LeadItem> {
  return apiClient(`/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, nextFollowUpAt }),
  });
}

export async function logCallAndNote(id: string, data: { noteText: string; status: string; nextFollowUpAt?: string | null }): Promise<void> {
  // Add note
  await apiClient(`/leads/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ noteText: data.noteText }),
  });
  // Update status (forced)
  await apiClient(`/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: data.status, nextFollowUpAt: data.nextFollowUpAt }),
  });
}

export async function assignSalesMember(id: string, salesMemberId: string): Promise<LeadItem> {
  return apiClient(`/leads/${id}/sales-member`, {
    method: 'PATCH',
    body: JSON.stringify({ salesMemberId }),
  });
}

export async function getSalesMembers(): Promise<SalesMember[]> {
  try {
    const data = await apiClient('/leads/sales-members');
    return Array.isArray(data) ? data : [];
  } catch {
    return [
      { id: 'sm-1', name: 'John Doe (Sales)', phone: '+1234567890' },
      { id: 'sm-2', name: 'Jane Smith (Sales)', phone: '+0987654321' },
    ];
  }
}

// ── Tutor & Package API Functions ──────────────────────────────────────────────

export async function getActiveTutors(): Promise<TutorItem[]> {
  try {
    const data = await apiClient('/tutors?activeOnly=true');
    return Array.isArray(data) ? data : [];
  } catch {
    return [
      { id: 'tut-1', userId: 'u-tut-1', user: { fullName: 'Dr. Alan Turing', email: 'alan@tutorflix.com' } },
      { id: 'tut-2', userId: 'u-tut-2', user: { fullName: 'Prof. Ada Lovelace', email: 'ada@tutorflix.com' } },
    ];
  }
}

export async function getCatalogPackages(): Promise<PackageItem[]> {
  try {
    const data = await apiClient('/billing/packages');
    return Array.isArray(data) ? data : [];
  } catch {
    return [
      { id: 'pkg-bronze', packageName: 'Bronze Package (10 hrs)', hours: 10, packagePrice: 300, active: true },
      { id: 'pkg-silver', packageName: 'Silver Package (20 hrs)', hours: 20, packagePrice: 560, active: true },
      { id: 'pkg-gold', packageName: 'Gold Package (40 hrs)', hours: 40, packagePrice: 1040, active: true },
    ];
  }
}

// ── Trial API Functions ────────────────────────────────────────────────────────

export async function scheduleTrial(data: {
  leadId: string;
  tutorId: string;
  subject: string;
  scheduledAt: string;
  notes?: string;
}): Promise<TrialItem> {
  return apiClient('/trials', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function markTrialNotified(trialId: string, data: {
  tutorNotified?: boolean;
  parentNotified?: boolean;
  salesMemberNotified?: boolean;
}): Promise<TrialItem> {
  return apiClient(`/trials/${trialId}/notify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ── Lead Conversion Function ───────────────────────────────────────────────────

export async function convertLead(leadId: string, data: {
  packageId?: string;
  purchasedHours?: number;
  pricePaid: number;
  notes?: string;
}): Promise<{ student: any; parent: any; tempPassword: string; message: string }> {
  return apiClient(`/leads/${leadId}/convert`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
