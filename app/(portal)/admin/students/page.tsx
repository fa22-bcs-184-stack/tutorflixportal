'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FamilyCredentialsModal } from '@/components/admin/family-credentials-modal';
import {
  Users,
  Search,
  Filter,
  Key,
  ShieldCheck,
  GraduationCap,
  Clock,
  Phone,
  Mail,
  Archive,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { getMyFamilies, archiveStudent, FamilyItem } from '@/lib/api/admin-api';

export default function MyFamiliesPage() {
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Credentials Modal State
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<FamilyItem | null>(null);

  // Archive Dialog State
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<FamilyItem | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const fetchFamilies = async () => {
    setIsLoading(true);
    try {
      const data = await getMyFamilies({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setFamilies(data);
    } catch {
      setFamilies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, [search, statusFilter]);

  const handleOpenCredentials = (family: FamilyItem) => {
    setSelectedFamily(family);
    setCredentialsModalOpen(true);
  };

  const handlePromptArchive = (family: FamilyItem) => {
    setArchiveTarget(family);
    setArchiveDialogOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      await archiveStudent(archiveTarget.id);
      fetchFamilies();
      setArchiveDialogOpen(false);
    } catch {
      // Local optimistic removal
      setFamilies((prev) => prev.filter((f) => f.id !== archiveTarget.id));
      setArchiveDialogOpen(false);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Families"
        subtitle="Manage assigned student households, remaining hours, and case-admin login credentials."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'My Families' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchFamilies} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Caseload
          </Button>
        }
      />

      {/* Caseload Privacy Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Strict Caseload Privacy:</strong> You are viewing households where `case_admin_id = currentAdmin.id`. No other caseworker's students appear here, and your caseload credentials are locked exclusively to you.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search student or parent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="AT_RISK">AT RISK (Low hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Caseload Families Roster Table */}
      <Panel title="Assigned Households Roster" description="Active student households in your caseload">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading caseload roster...
          </div>
        ) : families.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Users className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Caseload Families Found</p>
            <p>No assigned students matching your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student & Parent</th>
                  <th className="p-3">Curriculum / Grade</th>
                  <th className="p-3">Assigned Tutor</th>
                  <th className="p-3">Remaining Hours</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {families.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{f.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">{f.parentName} ({f.parentPhone})</div>
                    </td>
                    <td className="p-3">
                      <div>{f.curriculum || 'Standard'}</div>
                      <div className="text-[10px] text-muted-foreground">{f.grade || 'High School'}</div>
                    </td>
                    <td className="p-3">
                      {f.assignedTutor ? (
                        <span className="font-medium text-foreground">{f.assignedTutor.fullName}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold">
                      <span className={f.remainingHours <= 2 ? 'text-danger font-bold' : 'text-foreground'}>
                        {f.remainingHours} hrs
                      </span>
                      <span className="text-[10px] text-muted-foreground block">of {f.totalHoursPurchased} purchased</span>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          f.status === 'ACTIVE'
                            ? 'bg-success-subtle text-success border-success/30'
                            : f.status === 'AT_RISK'
                            ? 'bg-danger-subtle text-danger border-danger/30'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {f.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenCredentials(f)}
                        className="text-xs h-8 gap-1.5 border-warning/40 text-warning hover:bg-warning-subtle"
                      >
                        <Key className="size-3.5" /> View Login
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePromptArchive(f)}
                        className="text-xs h-8 text-danger hover:bg-danger-subtle"
                      >
                        <Archive className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Credentials Access Modal */}
      {selectedFamily && (
        <FamilyCredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          studentId={selectedFamily.id}
          studentName={selectedFamily.studentName}
          parentName={selectedFamily.parentName}
          parentEmail={selectedFamily.parentEmail}
        />
      )}

      {/* Soft Delete Archive Confirmation Dialog */}
      <ConfirmationDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Archive Household"
        description={`Are you sure you want to soft-delete/archive ${archiveTarget?.studentName}'s household?`}
        confirmLabel="Archive Household"
        variant="destructive"
        isSubmitting={isArchiving}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
}
