'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  UserPlus,
  Shield,
  Eye,
  Edit3,
  Trash2,
  Mail,
  Search,
  ChevronDown,
  Check,
  X,
  Lock,
  Database,
  BarChart2,
  FileText,
  Upload,
} from 'lucide-react';

type Role = 'Admin' | 'Editor' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'pending';
  joinedAt: string;
  avatar: string;
}

interface DataPermission {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const initialMembers: TeamMember[] = [
  { id: 'm1', name: 'Manas Verma', email: 'manas@company.com', role: 'Admin', status: 'active', joinedAt: 'Jan 2026', avatar: 'MV' },
  { id: 'm2', name: 'Krishna', email: 'krishna@company.com', role: 'Editor', status: 'active', joinedAt: 'Mar 2026', avatar: 'KR' },
  { id: 'm3', name: 'Hetaksh Pandey', email: 'hetaksh@company.com', role: 'Editor', status: 'active', joinedAt: 'Apr 2026', avatar: 'HP' },
  { id: 'm4', name: 'Sneha Patel', email: 'sneha@company.com', role: 'Editor', status: 'active', joinedAt: 'May 2026', avatar: 'SP' },
];

const dataPermissions: DataPermission[] = [
  { id: 'dp-upload', label: 'Data Upload', icon: Upload, description: 'Upload and manage raw datasets' },
  { id: 'dp-forecast', label: 'Forecast Runs', icon: BarChart2, description: 'Trigger and view forecast runs' },
  { id: 'dp-analysis', label: 'Forecast Analysis', icon: Database, description: 'Access detailed analysis & diagnostics' },
  { id: 'dp-reports', label: 'Reports & Export', icon: FileText, description: 'Generate and export reports' },
];

const rolePermissions: Record<Role, string[]> = {
  Admin: ['dp-upload', 'dp-forecast', 'dp-analysis', 'dp-reports'],
  Editor: ['dp-upload', 'dp-forecast', 'dp-analysis'],
  Viewer: ['dp-forecast', 'dp-analysis'],
};

const roleColors: Record<Role, { bg: string; color: string }> = {
  Admin: { bg: 'var(--negative-bg)', color: 'var(--negative)' },
  Editor: { bg: 'var(--info-bg)', color: 'var(--primary)' },
  Viewer: { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
};

const roleIcons: Record<Role, React.ElementType> = {
  Admin: Shield,
  Editor: Edit3,
  Viewer: Eye,
};

export default function WorkspaceAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Viewer');
  const [searchQuery, setSearchQuery] = useState('');
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [selectedMemberForPerms, setSelectedMemberForPerms] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;
    const newMember: TeamMember = {
      id: `m${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: '—',
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const handleRoleChange = (memberId: string, newRole: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    setOpenRoleDropdown(null);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    if (selectedMemberForPerms === memberId) setSelectedMemberForPerms(null);
  };

  const selectedMember = members.find((m) => m.id === selectedMemberForPerms);

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Workspace Admin</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Invite team members, assign roles, and control forecast data access.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Members', value: members.length, sub: 'active' },
            { label: 'Pending Invites', value: members.filter((m) => m.status === 'pending').length, sub: 'awaiting acceptance' },
            { label: 'Admins', value: members.filter((m) => m.role === 'Admin').length, sub: 'full access' },
          ].map((stat) => (
            <div key={stat.label} className="card-elevated p-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Members List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Invite Form */}
            <div className="card-elevated p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <UserPlus size={16} style={{ color: 'var(--primary)' }} />
                Invite New Member
              </h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    className="input-field pl-9"
                  />
                </div>
                {/* Role selector */}
                <div className="relative">
                  <button
                    onClick={() => setOpenRoleDropdown(openRoleDropdown === 'invite' ? null : 'invite')}
                    className="input-field flex items-center gap-2 w-32 justify-between"
                  >
                    <span className="text-sm">{inviteRole}</span>
                    <ChevronDown size={14} style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                  {openRoleDropdown === 'invite' && (
                    <div
                      className="absolute top-full mt-1 right-0 w-36 rounded-lg z-20 shadow-lg overflow-hidden"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      {(['Admin', 'Editor', 'Viewer'] as Role[]).map((r) => {
                        const RIcon = roleIcons[r];
                        return (
                          <button
                            key={r}
                            onClick={() => { setInviteRole(r); setOpenRoleDropdown(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                            style={{ color: 'var(--foreground)' }}
                          >
                            <RIcon size={13} />
                            {r}
                            {inviteRole === r && <Check size={12} className="ml-auto" style={{ color: 'var(--primary)' }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button onClick={handleInvite} className="btn-primary whitespace-nowrap">
                  Send Invite
                </button>
              </div>
              {inviteSuccess && (
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--positive)' }}>
                  <Check size={12} /> Invite sent successfully!
                </p>
              )}
            </div>

            {/* Members Table */}
            <div className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-8 text-xs h-8 w-48"
                  />
                </div>
              </div>

              <div className="space-y-1">
                {filteredMembers.map((member) => {
                  const RoleIcon = roleIcons[member.role];
                  const roleStyle = roleColors[member.role];
                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMemberForPerms(member.id === selectedMemberForPerms ? null : member.id)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                      style={{
                        background: selectedMemberForPerms === member.id ? 'var(--info-bg)' : 'transparent',
                        border: selectedMemberForPerms === member.id ? '1px solid rgba(59,111,212,0.2)' : '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMemberForPerms !== member.id)
                          e.currentTarget.style.background = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMemberForPerms !== member.id)
                          e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'var(--primary)' }}
                      >
                        {member.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                          {member.status === 'pending' && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{member.email}</p>
                      </div>

                      {/* Role Dropdown */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenRoleDropdown(openRoleDropdown === member.id ? null : member.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                          style={{ background: roleStyle.bg, color: roleStyle.color }}
                        >
                          <RoleIcon size={11} />
                          {member.role}
                          <ChevronDown size={10} />
                        </button>
                        {openRoleDropdown === member.id && (
                          <div
                            className="absolute top-full mt-1 right-0 w-32 rounded-lg z-20 shadow-lg overflow-hidden"
                            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                          >
                            {(['Admin', 'Editor', 'Viewer'] as Role[]).map((r) => {
                              const RI = roleIcons[r];
                              return (
                                <button
                                  key={r}
                                  onClick={() => handleRoleChange(member.id, r)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
                                  style={{ color: 'var(--foreground)' }}
                                >
                                  <RI size={12} />
                                  {r}
                                  {member.role === r && <Check size={11} className="ml-auto" style={{ color: 'var(--primary)' }} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Joined */}
                      <span className="text-xs w-20 text-right hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
                        {member.joinedAt}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--negative)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Permissions Panel */}
          <div className="space-y-4">
            {/* Role Legend */}
            <div className="card-elevated p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lock size={14} style={{ color: 'var(--primary)' }} />
                Role Capabilities
              </h2>
              <div className="space-y-3">
                {(['Admin', 'Editor', 'Viewer'] as Role[]).map((role) => {
                  const RIcon = roleIcons[role];
                  const style = roleColors[role];
                  return (
                    <div key={role} className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: style.bg, color: style.color }}
                        >
                          <RIcon size={11} />
                          {role}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dataPermissions.map((perm) => {
                          const hasAccess = rolePermissions[role].includes(perm.id);
                          const PIcon = perm.icon;
                          return (
                            <div key={perm.id} className="flex items-center gap-2">
                              {hasAccess ? (
                                <Check size={11} style={{ color: 'var(--positive)' }} />
                              ) : (
                                <X size={11} style={{ color: 'var(--muted-foreground)' }} />
                              )}
                              <PIcon size={11} style={{ color: hasAccess ? 'var(--foreground)' : 'var(--muted-foreground)' }} />
                              <span
                                className="text-xs"
                                style={{ color: hasAccess ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                              >
                                {perm.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Member Permissions */}
            {selectedMember && (
              <div className="card-elevated p-5" style={{ border: '1px solid rgba(59,111,212,0.25)' }}>
                <h2 className="text-sm font-semibold text-foreground mb-1">
                  {selectedMember.name}&apos;s Access
                </h2>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Based on <span className="font-semibold" style={{ color: roleColors[selectedMember.role].color }}>{selectedMember.role}</span> role
                </p>
                <div className="space-y-2">
                  {dataPermissions.map((perm) => {
                    const hasAccess = rolePermissions[selectedMember.role].includes(perm.id);
                    const PIcon = perm.icon;
                    return (
                      <div
                        key={perm.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg"
                        style={{ background: hasAccess ? 'var(--positive-bg)' : 'var(--muted)' }}
                      >
                        <PIcon size={13} style={{ color: hasAccess ? 'var(--positive)' : 'var(--muted-foreground)', marginTop: 1 }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: hasAccess ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                            {perm.label}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{perm.description}</p>
                        </div>
                        <div className="ml-auto">
                          {hasAccess ? (
                            <Check size={13} style={{ color: 'var(--positive)' }} />
                          ) : (
                            <X size={13} style={{ color: 'var(--muted-foreground)' }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!selectedMember && (
              <div className="card-elevated p-5 text-center" style={{ border: '1px dashed var(--border)' }}>
                <Eye size={20} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Click a member to view their data access permissions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
