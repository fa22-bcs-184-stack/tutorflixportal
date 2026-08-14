'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { UploadResourceModal } from '@/components/tutor/upload-resource-modal';
import { BookOpen, FileUp, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import { getTutorResources, getAssignedStudents, ResourceItem, TutorStudentItem } from '@/lib/api/tutor-api';

export default function TutorResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [students, setStudents] = useState<TutorStudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resList, stList] = await Promise.all([
        getTutorResources(),
        getAssignedStudents(),
      ]);
      setResources(resList);
      setStudents(stList);
    } catch {
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Learning Resources"
        subtitle="Upload and manage study materials assigned specifically per student."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Resources' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <FileUp className="size-4" /> Upload Material
          </Button>
        }
      />

      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Student-Scoped Materials:</strong> Resources uploaded here are assigned directly to individual students (not a broad broadcast).
        </div>
      </div>

      <Panel title="Uploaded Student Resources" description="Study guides, worksheets, and past papers">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <BookOpen className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Resources Uploaded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Resource Title</th>
                  <th className="p-3">Assigned Student</th>
                  <th className="p-3">File Size</th>
                  <th className="p-3">Uploaded Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{r.title}</td>
                    <td className="p-3 font-medium text-foreground">{r.studentName}</td>
                    <td className="p-3 text-muted-foreground">{r.fileSize || 'PDF Document'}</td>
                    <td className="p-3 text-muted-foreground">{new Date(r.uploadedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                        <Download className="size-3.5" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Upload Resource Modal */}
      <UploadResourceModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        students={students}
        onSuccess={loadData}
      />
    </div>
  );
}
