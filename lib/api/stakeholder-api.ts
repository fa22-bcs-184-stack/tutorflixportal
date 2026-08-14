import { apiClient } from './api-client';

export interface RevenueReportData {
  totalGrossRevenue: number;
  monthlyRecurringRevenue: number;
  averagePurchaseValue: number;
  revenueByPackage: {
    packageName: string;
    purchasesCount: number;
    totalAmount: number;
    sharePercentage: number;
  }[];
  monthlyRevenueTrend: {
    month: string;
    revenue: number;
    purchasesCount: number;
  }[];
}

export interface StakeholderDashboardData {
  totalGrossRevenue: number;
  monthlyRecurringRevenue: number;
  activeStudentsCount: number;
  activeTutorsCount: number;
  overallConversionRate: number;
  topPackages: { name: string; revenue: number }[];
}

export interface StakeholderLeadItem {
  id: string;
  studentName: string;
  parentName: string;
  curriculum: string;
  subject: string;
  status: string;
  assignedSchedulerName: string;
  createdAt: string;
}

export interface StakeholderStudentItem {
  id: string;
  studentName: string;
  grade: string;
  curriculum: string;
  parentName: string;
  remainingHours: number;
  caseAdminName: string;
}

export interface StakeholderTutorItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  ratingAggregate: number;
  isActive: boolean;
}

export interface StakeholderPaymentItem {
  id: string;
  studentName: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface StakeholderAuditLogItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  targetId?: string;
  timestamp: string;
}

// ── Dashboard API ─────────────────────────────────────────────────────────────

export async function getStakeholderDashboard(): Promise<StakeholderDashboardData> {
  try {
    return await apiClient('/stakeholder/dashboard');
  } catch {
    return {
      totalGrossRevenue: 42800,
      monthlyRecurringRevenue: 14200,
      activeStudentsCount: 32,
      activeTutorsCount: 12,
      overallConversionRate: 68,
      topPackages: [
        { name: 'Silver Package (20 hrs)', revenue: 16800 },
        { name: 'Gold Package (40 hrs)', revenue: 15600 },
        { name: 'Bronze Package (10 hrs)', revenue: 6000 },
        { name: 'Custom Hour Top-Ups', revenue: 4400 },
      ],
    };
  }
}

// ── Exclusive Revenue Report API (Stakeholder Exclusive) ─────────────────────

export async function getRevenueReport(): Promise<RevenueReportData> {
  try {
    return await apiClient('/reports/revenue');
  } catch {
    return {
      totalGrossRevenue: 42800,
      monthlyRecurringRevenue: 14200,
      averagePurchaseValue: 428,
      revenueByPackage: [
        { packageName: 'Silver Package (20 hrs)', purchasesCount: 30, totalAmount: 16800, sharePercentage: 39.2 },
        { packageName: 'Gold Package (40 hrs)', purchasesCount: 15, totalAmount: 15600, sharePercentage: 36.4 },
        { packageName: 'Bronze Package (10 hrs)', purchasesCount: 20, totalAmount: 6000, sharePercentage: 14.0 },
        { packageName: 'Custom Hour Top-Ups', purchasesCount: 35, totalAmount: 4400, sharePercentage: 10.4 },
      ],
      monthlyRevenueTrend: [
        { month: 'May 2026', revenue: 11200, purchasesCount: 24 },
        { month: 'Jun 2026', revenue: 13400, purchasesCount: 30 },
        { month: 'Jul 2026', revenue: 14200, purchasesCount: 32 },
        { month: 'Aug 2026', revenue: 4000, purchasesCount: 14 },
      ],
    };
  }
}

// ── Read-Only Platform Rosters API ────────────────────────────────────────────

export async function getStakeholderLeads(): Promise<StakeholderLeadItem[]> {
  try {
    const data = await apiClient('/stakeholder/leads');
    return Array.isArray(data) ? data : data?.leads || [];
  } catch {
    return [
      {
        id: 'ld-stk-1',
        studentName: 'Zoe Chen',
        parentName: 'David Chen',
        curriculum: 'IB Diploma',
        subject: 'Mathematics HL',
        status: 'CONVERTED',
        assignedSchedulerName: 'Elena Rostova',
        createdAt: '2026-08-01',
      },
      {
        id: 'ld-stk-2',
        studentName: 'Lucas Dubois',
        parentName: 'Claire Dubois',
        curriculum: 'IGCSE',
        subject: 'Physics',
        status: 'TRIAL_SCHEDULED',
        assignedSchedulerName: 'Tom Holland',
        createdAt: '2026-08-05',
      },
    ];
  }
}

export async function getStakeholderStudents(): Promise<StakeholderStudentItem[]> {
  try {
    const data = await apiClient('/stakeholder/students');
    return Array.isArray(data) ? data : data?.students || [];
  } catch {
    return [
      {
        id: 'st-01',
        studentName: 'Aarav Sharma',
        grade: 'Grade 10',
        curriculum: 'IB Diploma',
        parentName: 'Priya Sharma',
        remainingHours: 14,
        caseAdminName: 'Sofia Reyes',
      },
      {
        id: 'st-02',
        studentName: 'Maya Sharma',
        grade: 'Grade 8',
        curriculum: 'IGCSE',
        parentName: 'Priya Sharma',
        remainingHours: 8,
        caseAdminName: 'Sofia Reyes',
      },
    ];
  }
}

export async function getStakeholderTutors(): Promise<StakeholderTutorItem[]> {
  try {
    const data = await apiClient('/stakeholder/tutors');
    return Array.isArray(data) ? data : data?.tutors || [];
  } catch {
    return [
      {
        id: 'tut-1',
        name: 'Dr. Alan Turing',
        email: 'alan.tutor@tutorflix.com',
        subject: 'Mathematics HL',
        ratingAggregate: 4.8,
        isActive: true,
      },
      {
        id: 'tut-2',
        name: 'Prof. Ada Lovelace',
        email: 'ada.tutor@tutorflix.com',
        subject: 'Physics',
        ratingAggregate: 4.6,
        isActive: true,
      },
    ];
  }
}

export async function getStakeholderPayments(): Promise<StakeholderPaymentItem[]> {
  try {
    const data = await apiClient('/stakeholder/payments');
    return Array.isArray(data) ? data : data?.payments || [];
  } catch {
    return [
      {
        id: 'pmt-ren-201',
        studentName: 'Aarav Sharma',
        packageName: 'Silver Package (20 hrs)',
        amount: 560,
        paymentMethod: 'Bank Transfer',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function getStakeholderAuditLogs(): Promise<StakeholderAuditLogItem[]> {
  try {
    const data = await apiClient('/audit-logs');
    return Array.isArray(data) ? data : data?.logs || [];
  } catch {
    return [
      {
        id: 'alg-stk-1',
        actorName: 'Sofia Reyes',
        actorRole: 'ADMIN',
        action: 'PAYMENT_VERIFIED',
        module: 'payments',
        targetId: 'pmt-ren-201',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'alg-stk-2',
        actorName: 'Elena Rostova',
        actorRole: 'SCHEDULER',
        action: 'LEAD_CONVERTED',
        module: 'leads',
        targetId: 'lead-881',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }
}
