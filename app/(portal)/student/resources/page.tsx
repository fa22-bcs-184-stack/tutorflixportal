'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen, Search, Filter, Download, FileText, ShieldCheck, RefreshCw } from 'lucide-react';
import { getStudentResources, StudentResourceItem } from '@/lib/api/student-api';

export default function StudentResourcesPage() {
  const [resources, setResources] = useState<StudentResourceItem[]>([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await getStudentResources();
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tutorName.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subjectFilter === 'ALL' || r.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning Resources"
        subtitle="Study guides, worksheets, and past papers uploaded specifically for you by your tutor."
        breadcrumbs={[
          { label: 'Student', href: '/student' },
          { label: 'Resources' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchResources} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Resources
          </Button>
        }
      />

      {/* Student-Scoped Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Personalized Learning Library:</strong> Resources shown here are uploaded specifically for your learning plan by your assigned tutor.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search material title or tutor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={subjectFilter} onValueChange={(val) => val && setSubjectFilter(val)}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Subjects</SelectItem>
              <SelectItem value="Mathematics HL">Mathematics HL</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resources Table */}
      <Panel title="Study Materials Library" description="Personalized documents, worksheets, and past papers">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading learning materials...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <BookOpen className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Learning Materials Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Material Title</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Uploaded By</th>
                  <th className="p-3">File Type & Size</th>
                  <th className="p-3">Uploaded Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResources.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span>{r.title}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{r.subject}</td>
                    <td className="p-3 text-muted-foreground">{r.tutorName}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] mr-1.5 font-bold">
                        {r.fileType}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{r.fileSize}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(r.uploadedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <a href={r.fileUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                          <Download className="size-3.5" /> Download
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
