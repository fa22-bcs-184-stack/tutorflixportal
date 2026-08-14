'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AssignCaseAdminModal } from '@/components/manager/assign-case-admin-modal';
import { UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import { getUnassignedCaseStudents, getStaffUsers, UnassignedStudentItem, StaffUserItem } from '@/lib/api/manager-api';

export default function ManagerCaseAssignmentsPage() {
  const [students, setStudents] = useState<UnassignedStudentItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<StaffUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UnassignedStudentItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stData, staffData] = await Promise.all([
        getUnassignedCaseStudents(),
        getStaffUsers(),
      ]);
      setStudents(stData);
      setAdminUsers(staffData.filter((s) => s.role === 'ADMIN'));
    } catch {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAssign = (st: UnassignedStudentItem) => {
    setSelectedStudent(st);
    setAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Admin Assignments Queue"
        subtitle="Assign caseworkers to newly converted student families to unblock tutor assignments and class scheduling."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Case Assignments' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Queue
          </Button>
        }
      />

      {/* Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Platform-Wide Scope:</strong> Admin Managers possess platform-wide visibility across all converted student families to assign or reassign caseworkers (`Student.caseAdminId`).
        </div>
      </div>

      {/* Unassigned Students Queue Table */}
      <Panel title="Newly Converted Families Queue" description="Student families awaiting Case Admin assignment">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading assignment queue...
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <UserCheck className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">All Converted Families Assigned!</p>
            <p className="text-[11px] text-muted-foreground mt-1">No unassigned converted families in queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Grade & Curriculum</th>
                  <th className="p-3">Parent Name & Phone</th>
                  <th className="p-3">Converted Date</th>
                  <th className="p-3">Case Admin Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{st.studentName}</td>
                    <td className="p-3 text-muted-foreground">{st.grade} · {st.curriculum}</td>
                    <td className="p-3">
                      <div className="font-medium text-foreground">{st.parentName}</div>
                      <div className="text-[10px] text-muted-foreground">{st.parentPhone}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(st.convertedAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-warning-subtle text-warning border-warning/30 text-[10px] font-semibold">
                        Unassigned
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenAssign(st)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
                      >
                        <UserCheck className="size-3.5" /> Assign Case Admin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Assign Case Admin Modal */}
      {selectedStudent && (
        <AssignCaseAdminModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          studentId={selectedStudent.id}
          studentName={selectedStudent.studentName}
          parentName={selectedStudent.parentName}
          adminUsers={adminUsers}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
