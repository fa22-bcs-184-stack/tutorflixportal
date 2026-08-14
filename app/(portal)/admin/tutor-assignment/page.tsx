'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TutorAssignModal } from '@/components/admin/tutor-assign-modal';
import { UserCheck, ShieldCheck, RefreshCw, AlertCircle, GraduationCap } from 'lucide-react';
import { getMyFamilies, FamilyItem } from '@/lib/api/admin-api';

export default function AdminTutorAssignmentPage() {
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<FamilyItem | null>(null);

  const fetchCaseload = async () => {
    setIsLoading(true);
    try {
      const data = await getMyFamilies();
      setFamilies(data);
    } catch {
      setFamilies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseload();
  }, []);

  const handleOpenAssignModal = (student: FamilyItem) => {
    setSelectedStudent(student);
    setAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Assignment"
        subtitle="Assign or reassign tutors for your assigned caseload students."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Tutor Assignment' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchCaseload} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Roster
          </Button>
        }
      />

      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Caseload Assignment Scoping:</strong> Tutor assignment is restricted to students assigned to your caseload (`case_admin_id = currentAdmin.id`). Unassigned converted leads must first have a Case Admin assigned by Admin Manager before tutors can be assigned.
        </div>
      </div>

      <Panel title="Caseload Students Tutor Assignments" description="Tutor assignment state across your assigned student families">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading caseload students...
          </div>
        ) : families.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <UserCheck className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Assigned Students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student & Parent</th>
                  <th className="p-3">Curriculum</th>
                  <th className="p-3">Currently Assigned Tutor</th>
                  <th className="p-3">Hours Remaining</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {families.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{f.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">{f.parentName}</div>
                    </td>
                    <td className="p-3 font-medium">{f.curriculum || 'Standard'}</td>
                    <td className="p-3">
                      {f.assignedTutor ? (
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <GraduationCap className="size-3.5 text-primary" /> {f.assignedTutor.fullName}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-warning-subtle text-warning border-warning/30">
                          Unassigned Tutor
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{f.remainingHours} hrs</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenAssignModal(f)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5"
                      >
                        <UserCheck className="size-3.5" />
                        {f.assignedTutor ? 'Reassign Tutor' : 'Assign Tutor'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Tutor Assign Modal */}
      {selectedStudent && (
        <TutorAssignModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          studentId={selectedStudent.id}
          studentName={selectedStudent.studentName}
          currentTutorName={selectedStudent.assignedTutor?.fullName}
          onSuccess={fetchCaseload}
        />
      )}
    </div>
  );
}
