'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { GraduationCap, Lock, Mail, Phone, BookOpen, ShieldCheck } from 'lucide-react';
import { getTutorProfile, TutorProfileItem } from '@/lib/api/tutor-api';

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfileItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getTutorProfile();
        setProfile(data);
      } catch {
        setProfile({
          id: 'tut-me',
          fullName: 'Dr. Alan Turing',
          email: 'alan@tutorflix.com',
          phone: '+1 408 555 1010',
          bio: 'PhD in Computer Science & Applied Mathematics with over 8 years of IB & IGCSE tutoring experience.',
          qualifications: ['B.S. Mathematics (Cambridge)', 'Ph.D. Computer Science (Princeton)'],
          subjects: ['Mathematics HL', 'Computer Science', 'Physics'],
          hourlyRate: 40,
        });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Profile"
        subtitle="View your teaching qualifications, subjects, and locked hourly rate."
        breadcrumbs={[
          { label: 'Tutor', href: '/tutor' },
          { label: 'Profile' },
        ]}
      />

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center text-xs text-muted-foreground">
          <Spinner className="mr-2" /> Loading profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Panel title="Professional Bio & Summary" description="Personal biography and teaching background">
              <div className="space-y-4 pt-2 text-xs">
                <p className="text-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border">
                  {profile?.bio}
                </p>

                <div className="space-y-2">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">
                    Academic Qualifications
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-foreground">
                    {profile?.qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-muted-foreground">
                    Approved Subjects Taught
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.subjects.map((sub) => (
                      <Badge key={sub} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/30">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Locked Hourly Rate & Contact Side Panel */}
          <div className="space-y-6">
            <Panel title="Pay Rate & Contact" description="Account details">
              <div className="space-y-4 pt-2 text-xs">
                {/* Locked Hourly Rate Card */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Lock className="size-3.5 text-warning" /> Hourly Pay Rate
                    </span>
                    <Badge variant="outline" className="text-[9px] bg-warning-subtle text-warning">
                      View Only
                    </Badge>
                  </div>
                  <p className="font-bold text-foreground text-3xl">${profile?.hourlyRate} <span className="text-xs font-normal text-muted-foreground">/ hr</span></p>
                  <p className="text-[10px] text-muted-foreground">
                    Hourly rate is set exclusively by Admin and cannot be edited by tutors directly.
                  </p>
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span>{profile?.phone}</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
