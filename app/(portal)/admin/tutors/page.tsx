'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Phone,
  Mail,
  BookOpen,
} from 'lucide-react';
import { getAllTutors, TutorAdminItem } from '@/lib/api/admin-api';

export default function AdminTutorsRosterPage() {
  const [tutors, setTutors] = useState<TutorAdminItem[]>([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal State
  const [selectedTutor, setSelectedTutor] = useState<TutorAdminItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTutors();
      setTutors(data);
    } catch {
      setTutors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter((t) => {
    const matchesSearch =
      !search ||
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subjectFilter === 'ALL' || t.subjects.includes(subjectFilter);

    return matchesSearch && matchesSubject;
  });

  const handleOpenDetail = (tutor: TutorAdminItem) => {
    setSelectedTutor(tutor);
    setDetailModalOpen(true);
  };

  const handleToggleActive = (tutorId: string, currentActive: boolean) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, active: !currentActive } : t))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Roster (Platform-Wide)"
        subtitle="Browse all registered tutors across the platform, load indicators, and performance logs."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Tutors' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchTutors} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Roster
          </Button>
        }
      />

      {/* Shared Screen Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Shared Roster Exception:</strong> This is the single screen in the Admin Portal that is NOT caseload-scoped, since individual tutors teach students across multiple caseworkers' caseloads.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tutor name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={subjectFilter} onValueChange={(val) => val && setSubjectFilter(val)}>
            <SelectTrigger className="w-full sm:w-48 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Subjects</SelectItem>
              <SelectItem value="Mathematics HL">Mathematics HL</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Advanced Calculus">Advanced Calculus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tutors Roster Table */}
      <Panel title="Platform Tutor Roster" description="All active and inactive tutors in the system">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading tutor roster...
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <GraduationCap className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Tutors Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Tutor Name</th>
                  <th className="p-3">Subjects Taught</th>
                  <th className="p-3">Active Students</th>
                  <th className="p-3">Rejected Classes</th>
                  <th className="p-3">Flagged Messages</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTutors.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{t.fullName}</div>
                      <div className="text-[11px] text-muted-foreground">{t.email}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {t.subjects.map((sub) => (
                          <Badge key={sub} variant="outline" className="text-[10px] px-1.5 py-0">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-foreground">{t.assignedStudentCount} students</td>
                    <td className="p-3">
                      <span className={t.rejectedClassesCount > 0 ? 'text-warning font-semibold' : 'text-muted-foreground'}>
                        {t.rejectedClassesCount} rejected
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={t.flaggedMessagesCount > 0 ? 'text-danger font-semibold' : 'text-muted-foreground'}>
                        {t.flaggedMessagesCount} flags
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          t.active
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t.active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetail(t)}
                        className="text-xs h-8"
                      >
                        View Profile & Logs
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(t.id, t.active)}
                        className={`text-xs h-8 ${t.active ? 'text-danger hover:bg-danger-subtle' : 'text-success hover:bg-success-subtle'}`}
                      >
                        {t.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Tutor Profile & Performance Logs Detail Modal */}
      {selectedTutor && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                {selectedTutor.fullName} — Tutor Profile & Performance Log
              </DialogTitle>
              <DialogDescription>{selectedTutor.email}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-card border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Assigned Load</span>
                  <p className="font-bold text-foreground text-sm">{selectedTutor.assignedStudentCount} Students</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Account Status</span>
                  <p className="font-bold text-foreground text-sm">{selectedTutor.active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">
                  Performance & Audit Logs
                </h4>

                <div className="space-y-2 rounded-lg bg-muted/20 p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <XCircle className="size-4 text-warning" /> Class Rejections Log
                    </span>
                    <Badge variant="outline">{selectedTutor.rejectedClassesCount} Events</Badge>
                  </div>
                  {selectedTutor.rejectedClassesCount > 0 ? (
                    <p className="text-[11px] text-muted-foreground pl-5">
                      Rejected 1 class request on July 14, 2026 (Reason: Time slot conflict).
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic pl-5">No class requests rejected.</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <AlertTriangle className="size-4 text-danger" /> Moderation Flags Log
                    </span>
                    <Badge variant="outline">{selectedTutor.flaggedMessagesCount} Flags</Badge>
                  </div>
                  {selectedTutor.flaggedMessagesCount > 0 ? (
                    <p className="text-[11px] text-muted-foreground pl-5">
                      1 message soft-flagged for URL inclusion on August 2, 2026 (Reviewed as Safe).
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic pl-5">No chat messages flagged.</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
