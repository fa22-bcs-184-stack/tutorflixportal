import { apiClient } from './api-client';

export interface HodLeadItem {
  id: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  grade: string;
  curriculum: string;
  subject: string;
  status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'TRIAL_SCHEDULED' | 'TRIAL_DONE' | 'CONVERTED' | 'LOST';
  assignedSchedulerName: string;
  assignedSalesMemberName?: string | null;
  createdAt: string;
}

export interface SalesMemberItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionTier: string;
  isActive: boolean;
  assignedCallsCount: number;
  conversionsCount: number;
  createdAt: string;
}

export interface ActivityFeedItem {
  id: string;
  actorName: string;
  actorRole: 'ADMIN' | 'SCHEDULER';
  action: string;
  details: string;
  timestamp: string;
}

export interface LeadConversionReportData {
  totalLeads: number;
  trialsScheduledCount: number;
  trialsDoneCount: number;
  convertedCount: number;
  overallConversionRate: number;
  conversionByCurriculum: {
    curriculum: string;
    leadsCount: number;
    convertedCount: number;
    rate: number;
  }[];
  conversionByScheduler: {
    schedulerName: string;
    leadsCount: number;
    convertedCount: number;
    rate: number;
  }[];
}

export interface HodDashboardData {
  totalPipelineLeads: number;
  activeSalesMembersCount: number;
  leadConversionRate: number;
  activeSchedulersCount: number;
  pendingModerationReviewsCount: number;
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getHodDashboard(): Promise<HodDashboardData> {
  try {
    return await apiClient('/hod/dashboard');
  } catch {
    return {
      totalPipelineLeads: 42,
      activeSalesMembersCount: 5,
      leadConversionRate: 68,
      activeSchedulersCount: 4,
      pendingModerationReviewsCount: 2,
    };
  }
}

// ── All-Leads Pipeline API ────────────────────────────────────────────────────

export async function getAllLeads(query?: string): Promise<HodLeadItem[]> {
  try {
    const q = query ? `?${query}` : '';
    const data = await apiClient(`/leads/all${q}`);
    return Array.isArray(data) ? data : data?.leads || [];
  } catch {
    return [
      {
        id: 'ld-hod-01',
        parentName: 'David Chen',
        parentPhone: '+1 555-9011',
        parentEmail: 'david.chen@example.com',
        studentName: 'Zoe Chen',
        grade: 'Grade 11',
        curriculum: 'IB Diploma',
        subject: 'Mathematics HL',
        status: 'CONVERTED',
        assignedSchedulerName: 'Elena Rostova',
        assignedSalesMemberName: 'Marcus Sales',
        createdAt: '2026-08-01',
      },
      {
        id: 'ld-hod-02',
        parentName: 'Sarah Jenkins',
        parentPhone: '+1 555-8833',
        parentEmail: 'sarah.j@example.com',
        studentName: 'Oliver Jenkins',
        grade: 'Grade 10',
        curriculum: 'IGCSE',
        subject: 'Physics',
        status: 'TRIAL_SCHEDULED',
        assignedSchedulerName: 'Elena Rostova',
        assignedSalesMemberName: 'Marcus Sales',
        createdAt: '2026-08-05',
      },
      {
        id: 'ld-hod-03',
        parentName: 'Claire Dubois',
        parentPhone: '+1 555-9022',
        parentEmail: 'claire.d@example.com',
        studentName: 'Lucas Dubois',
        grade: 'Grade 9',
        curriculum: 'IGCSE',
        subject: 'Chemistry',
        status: 'FOLLOW_UP',
        assignedSchedulerName: 'Tom Holland',
        assignedSalesMemberName: 'Rachel Vance',
        createdAt: '2026-08-07',
      },
    ];
  }
}

// ── Sales Members Management API (Full CRUD) ──────────────────────────────────

export async function getSalesMembers(): Promise<SalesMemberItem[]> {
  try {
    const data = await apiClient('/sales-members');
    return Array.isArray(data) ? data : data?.salesMembers || [];
  } catch {
    return [
      {
        id: 'sm-1',
        name: 'Marcus Sales',
        email: 'marcus.sales@tutorflix.com',
        phone: '+1 555-0191',
        commissionTier: 'Senior Tier (5%)',
        isActive: true,
        assignedCallsCount: 28,
        conversionsCount: 14,
        createdAt: '2026-01-10',
      },
      {
        id: 'sm-2',
        name: 'Rachel Vance',
        email: 'rachel.vance@tutorflix.com',
        phone: '+1 555-0194',
        commissionTier: 'Standard Tier (3%)',
        isActive: true,
        assignedCallsCount: 19,
        conversionsCount: 8,
        createdAt: '2026-02-15',
      },
    ];
  }
}

export async function createSalesMember(data: {
  name: string;
  email: string;
  phone: string;
  commissionTier?: string;
}): Promise<SalesMemberItem> {
  return apiClient('/sales-members', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSalesMember(
  id: string,
  data: { name: string; email: string; phone: string; commissionTier?: string }
): Promise<SalesMemberItem> {
  return apiClient(`/sales-members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function toggleSalesMemberStatus(id: string, isActive: boolean): Promise<void> {
  return apiClient(`/sales-members/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

// ── Activity Feeds API ────────────────────────────────────────────────────────

export async function getAdminActivityFeed(): Promise<ActivityFeedItem[]> {
  try {
    const data = await apiClient('/activity/admins');
    return Array.isArray(data) ? data : data?.activity || [];
  } catch {
    return [
      {
        id: 'act-adm-1',
        actorName: 'Sofia Reyes',
        actorRole: 'ADMIN',
        action: 'PAYMENT_APPROVED',
        details: 'Approved renewal payment $560 for Aarav Sharma',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'act-adm-2',
        actorName: 'Marcus Vance',
        actorRole: 'ADMIN',
        action: 'TUTOR_ASSIGNED',
        details: 'Assigned Dr. Alan Turing to Maya Sharma',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }
}

export async function getSchedulerActivityFeed(): Promise<ActivityFeedItem[]> {
  try {
    const data = await apiClient('/activity/schedulers');
    return Array.isArray(data) ? data : data?.activity || [];
  } catch {
    return [
      {
        id: 'act-sch-1',
        actorName: 'Elena Rostova',
        actorRole: 'SCHEDULER',
        action: 'LEAD_CONVERTED',
        details: 'Marked lead Zoe Chen as CONVERTED (Silver Package 20 hrs)',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'act-sch-2',
        actorName: 'Tom Holland',
        actorRole: 'SCHEDULER',
        action: 'TRIAL_SCHEDULED',
        details: 'Scheduled trial session for Lucas Dubois with Prof. Ada Lovelace',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
  }
}

// ── Lead Conversion Report API ─────────────────────────────────────────────────

export async function getLeadConversionReport(): Promise<LeadConversionReportData> {
  try {
    return await apiClient('/reports/lead-conversion');
  } catch {
    return {
      totalLeads: 42,
      trialsScheduledCount: 36,
      trialsDoneCount: 32,
      convertedCount: 28,
      overallConversionRate: 67,
      conversionByCurriculum: [
        { curriculum: 'IB Diploma', leadsCount: 20, convertedCount: 15, rate: 75 },
        { curriculum: 'IGCSE', leadsCount: 14, convertedCount: 9, rate: 64 },
        { curriculum: 'A-Levels', leadsCount: 8, convertedCount: 4, rate: 50 },
      ],
      conversionByScheduler: [
        { schedulerName: 'Elena Rostova', leadsCount: 24, convertedCount: 18, rate: 75 },
        { schedulerName: 'Tom Holland', leadsCount: 18, convertedCount: 10, rate: 56 },
      ],
    };
  }
}
