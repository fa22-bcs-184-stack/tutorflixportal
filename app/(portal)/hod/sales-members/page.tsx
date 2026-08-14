'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CreateSalesMemberModal } from '@/components/hod/create-sales-member-modal';
import { EditSalesMemberModal } from '@/components/hod/edit-sales-member-modal';
import { Users, UserPlus, Edit, Power, ShieldCheck, RefreshCw } from 'lucide-react';
import { getSalesMembers, toggleSalesMemberStatus, SalesMemberItem } from '@/lib/api/hod-api';

export default function HodSalesMembersPage() {
  const [salesMembers, setSalesMembers] = useState<SalesMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SalesMemberItem | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getSalesMembers();
      setSalesMembers(data);
    } catch {
      setSalesMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenEdit = (member: SalesMemberItem) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      await toggleSalesMemberStatus(id, !currentActive);
      setSalesMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: !currentActive } : m))
      );
    } catch {
      setSalesMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: !currentActive } : m))
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Members Management (Full CRUD)"
        subtitle="Manage off-platform call agents for Intro Scheduler lead assignments."
        breadcrumbs={[
          { label: 'HOD', href: '/hod' },
          { label: 'Sales Members' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <UserPlus className="size-4" /> Create Sales Member
          </Button>
        }
      />

      {/* Scope Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <strong>Exclusive Sales Member Management:</strong> HOD possesses full CRUD authority over Sales Members. Intro Schedulers can assign existing Sales Members to calls, but cannot create or edit them.
        </div>
      </div>

      {/* Sales Members Roster Table */}
      <Panel title="Sales Members Roster" description="Off-platform telephone call agents">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading sales members...
          </div>
        ) : salesMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Users className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Sales Members Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Sales Member Name</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Commission Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salesMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{m.name}</td>
                    <td className="p-3 text-muted-foreground">{m.email}</td>
                    <td className="p-3 font-medium text-foreground">{m.phone}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {m.commissionTier}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          m.isActive
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-danger-subtle text-danger border-danger/30'
                        }`}
                      >
                        {m.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(m)}
                        className="text-xs h-8 gap-1"
                      >
                        <Edit className="size-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={m.isActive ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(m.id, m.isActive)}
                        className={`text-xs h-8 gap-1 ${
                          m.isActive ? 'text-danger border-danger/30 hover:bg-danger-subtle' : 'bg-success text-white'
                        }`}
                      >
                        <Power className="size-3.5" />
                        {m.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Modals */}
      <CreateSalesMemberModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchMembers}
      />

      {selectedMember && (
        <EditSalesMemberModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          salesMember={selectedMember}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  );
}
