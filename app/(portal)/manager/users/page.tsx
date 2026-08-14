'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CreateStaffModal } from '@/components/manager/create-staff-modal';
import { Users, UserPlus, Search, Filter, ShieldCheck, Power, Palmtree, RefreshCw } from 'lucide-react';
import { getStaffUsers, toggleStaffStatus, toggleStaffLeave, StaffUserItem } from '@/lib/api/manager-api';

export default function ManagerUsersPage() {
  const [users, setUsers] = useState<StaffUserItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [createStaffModalOpen, setCreateStaffModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getStaffUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentActive: boolean) => {
    try {
      await toggleStaffStatus(userId, !currentActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
      );
    }
  };

  const handleToggleLeave = async (userId: string, currentLeave?: boolean) => {
    try {
      await toggleStaffLeave(userId, !currentLeave);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isOnLeave: !currentLeave } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isOnLeave: !currentLeave } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & User Management"
        subtitle="Create staff accounts, assign system roles, toggle active status, and manage staff leave."
        breadcrumbs={[
          { label: 'Admin Manager', href: '/manager' },
          { label: 'Staff Accounts' },
        ]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateStaffModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 font-semibold"
          >
            <UserPlus className="size-4" /> Create Staff Account
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-muted/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={roleFilter} onValueChange={(val) => val && setRoleFilter(val)}>
            <SelectTrigger className="w-full sm:w-44 text-xs h-9 bg-muted/30">
              <SelectValue placeholder="All System Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin (Caseworker)</SelectItem>
              <SelectItem value="TUTOR">Tutor</SelectItem>
              <SelectItem value="SCHEDULER">Intro Scheduler</SelectItem>
              <SelectItem value="HOD">HOD</SelectItem>
              <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
              <SelectItem value="MANAGER">Admin Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Staff Roster Table */}
      <Panel title="Platform Staff Accounts Roster" description="All registered staff members across system roles">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading staff accounts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <Users className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Staff Members Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-3">Staff Name & Email</th>
                  <th className="p-3">System Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Leave Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {u.role}
                      </Badge>
                      {u.assignedCaseloadCount !== undefined && (
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {u.assignedCaseloadCount} assigned families
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{u.phone || '—'}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          u.isActive
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-danger-subtle text-danger border-danger/30'
                        }`}
                      >
                        {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {(u.role === 'ADMIN' || u.role === 'TUTOR') ? (
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            u.isOnLeave
                              ? 'bg-warning-subtle text-warning border-warning/30'
                              : 'bg-muted/50 text-muted-foreground'
                          }`}
                        >
                          {u.isOnLeave ? 'ON LEAVE' : 'On Duty'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[10px]">N/A</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {(u.role === 'ADMIN' || u.role === 'TUTOR') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleLeave(u.id, u.isOnLeave)}
                          className="text-xs h-8 gap-1"
                        >
                          <Palmtree className="size-3.5" />
                          {u.isOnLeave ? 'Return to Duty' : 'Put on Leave'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={u.isActive ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(u.id, u.isActive)}
                        className={`text-xs h-8 gap-1 ${
                          u.isActive ? 'text-danger border-danger/30 hover:bg-danger-subtle' : 'bg-success text-white'
                        }`}
                      >
                        <Power className="size-3.5" />
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Create Staff Modal */}
      <CreateStaffModal
        open={createStaffModalOpen}
        onOpenChange={setCreateStaffModalOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
