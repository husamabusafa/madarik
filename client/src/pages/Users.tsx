import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Send,
  UserCheck,
  Upload,
  Download,
  Key,
  Ban,
  RotateCcw
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';
import Tooltip from '../components/common/Tooltip';
import InviteUserModal from '../components/users/InviteUserModal';
import BulkInviteModal from '../components/users/BulkInviteModal';
import Modal from '../components/common/Modal';
import { ToastContainer } from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { graphqlApiService, type UserInvite, type User as GraphQLUser, type UserStats as GraphQLUserStats } from '../lib/graphql-api';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast, hideToast } = useToast();

  // Version key to force Table re-mount (and re-query internal state) after any mutation
  const [dataVersion, setDataVersion] = useState(0);

  // State management for real data
  const [users, setUsers] = useState<GraphQLUser[]>([]);
  const [userStats, setUserStats] = useState<GraphQLUserStats | null>(null);
  const [invites, setInvites] = useState<UserInvite[]>([]);

  // Data fetcher
  const fetchData = React.useCallback(async (opts: { silent?: boolean } = {}) => {
    const { silent = false } = opts;
    if (!silent) setIsLoading(true);
    try {
      const [usersData, invitesData, statsData] = await Promise.all([
        graphqlApiService.getUsers(),
        graphqlApiService.getInvites(),
        graphqlApiService.getUserStats(),
      ]);
      setUsers(usersData);
      setInvites(invitesData);
      setUserStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast({
        type: 'error',
        title: 'Data Fetch Failed',
        message: 'Failed to load users and invitations data.',
      });
    } finally {
      if (!silent) setIsLoading(false);
      // bump version so tables remount and re-evaluate any internal memoized state
      setDataVersion(v => v + 1);
    }
  }, [showToast]);

  // Helper: run a mutation fn then do a guaranteed refetch
  const runAndRefetch = React.useCallback(async <T,>(fn: () => Promise<T>, {
    optimistic,
  }: { optimistic?: () => void } = {}) => {
    try {
      if (optimistic) optimistic();
      const result = await fn();
      await fetchData({ silent: true }); // refetch without blocking the whole page spinner
      return result;
    } catch (error) {
      // If optimistic update happened and server failed, do a full refetch to recover
      await fetchData({ silent: false });
      throw error;
    }
  }, [fetchData]);

  // Action handlers
  const handleUpdateUserRole = async (userId: string, currentRole: 'ADMIN' | 'MANAGER') => {
    const next = prompt('Enter new role (ADMIN or MANAGER):', currentRole);
    const nextRole = (next || '').toUpperCase();
    if (nextRole !== 'ADMIN' && nextRole !== 'MANAGER') {
      if (next !== null) {
        showToast({ type: 'warning', title: 'Invalid Role', message: 'Please enter ADMIN or MANAGER.' });
      }
      return;
    }
    try {
      await runAndRefetch(
        () => graphqlApiService.updateUserRole(userId, nextRole as 'ADMIN' | 'MANAGER'),
        {
          optimistic: () => setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: nextRole as 'ADMIN' | 'MANAGER' } : u)))
        }
      );
      showToast({ type: 'success', title: 'Role Updated', message: `User role updated to ${nextRole}.` });
    } catch (error) {
      console.error('Failed to update role:', error);
      showToast({ type: 'error', title: 'Update Failed', message: error instanceof Error ? error.message : 'Could not update role.' });
    }
  };

  const handleDeleteInvite = (inviteId: string) => openConfirm('delete', inviteId);

  const handleToggleUserStatus = async (userId: string, enable: boolean) => {
    try {
      await runAndRefetch(
        () => graphqlApiService.updateUserStatus(userId, enable),
        {
          optimistic: () => setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: enable } : u)))
        }
      );
      showToast({ type: 'success', title: enable ? 'User Activated' : 'User Deactivated', message: enable ? 'User has been reactivated.' : 'User has been deactivated.' });
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast({ type: 'error', title: 'Status Update Failed', message: error instanceof Error ? error.message : 'Could not update status.' });
    }
  };

  const handleResetPassword = (email: string) => {
    showToast({ type: 'info', title: 'Reset Password', message: `Password reset flow for ${email} is not implemented yet.` });
  };

  const handleMoreActions = (user: GraphQLUser) => {
    showToast({ type: 'info', title: 'More Actions', message: `More actions for ${user.email} coming soon.` });
  };

  const handleExportUsers = () => {
    try {
      const header = ['Email', 'Role', 'Active', 'Email Verified At', 'Last Login', 'Created At', 'Preferred Locale'];
      const rows = users.map(u => [
        u.email,
        u.role,
        u.isActive ? 'true' : 'false',
        u.emailVerifiedAt || '',
        u.lastLoginAt || '',
        u.createdAt,
        u.preferredLocale,
      ]);
      const csv = [header, ...rows]
        .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export users:', error);
      showToast({ type: 'error', title: 'Export Failed', message: 'Could not export users.' });
    }
  };

  // Fetch data on component mount
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate dynamic stats
  const pendingInvites = invites.filter(invite => invite.status === 'PENDING').length;

  const stats = [
    { 
      title: 'Total Users', 
      value: userStats?.totalUsers?.toString() || '0', 
      icon: User, 
      change: { value: 2, type: 'increase' as const }, 
      color: 'blue' as const 
    },
    { 
      title: 'Active Users', 
      value: userStats?.activeUsers?.toString() || '0', 
      icon: UserCheck, 
      change: { value: 1, type: 'increase' as const }, 
      color: 'green' as const 
    },
    { 
      title: 'Pending Invites', 
      value: pendingInvites.toString(), 
      icon: Clock, 
      change: { value: 0, type: 'increase' as const }, 
      color: 'orange' as const 
    },
    { 
      title: 'Admins', 
      value: userStats?.adminUsers?.toString() || '0', 
      icon: Shield, 
      change: { value: 0, type: 'increase' as const }, 
      color: 'purple' as const 
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/10 text-purple-400';
      case 'MANAGER': return 'bg-blue-500/10 text-blue-400';
      default: return 'bg-slate-800/60 text-slate-300';
    }
  };

  const getStatusColor = (isActive: boolean, emailVerifiedAt: string | null) => {
    if (!isActive) return 'bg-red-500/10 text-red-400';
    if (!emailVerifiedAt) return 'bg-amber-500/10 text-amber-400';
    return 'bg-green-500/10 text-green-400';
  };

  const getStatusText = (isActive: boolean, emailVerifiedAt: string | null) => {
    if (!isActive) return 'Inactive';
    if (!emailVerifiedAt) return 'Pending Verification';
    return 'Active';
  };

  const getInviteStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-400';
      case 'ACCEPTED': return 'bg-green-500/10 text-green-400';
      case 'EXPIRED': return 'bg-red-500/10 text-red-400';
      case 'REVOKED': return 'bg-slate-800/60 text-slate-300';
      default: return 'bg-slate-800/60 text-slate-300';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const userColumns = [
    {
      key: 'email',
      label: 'User',
      render: (value: string, row: GraphQLUser) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="h-5 w-5 text-slate-300" />
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-100">{value}</div>
            <div className="text-sm text-slate-400">
              ID: {row.id.slice(0, 8)}... • {row.preferredLocale}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean, row: GraphQLUser) => {
        const statusText = getStatusText(value, row.emailVerifiedAt ?? null);
        const statusColor = getStatusColor(value, row.emailVerifiedAt ?? null);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {statusText}
          </span>
        );
      }
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login',
      render: (value: string | null) => (
        <div className="text-sm text-slate-100">{formatDate(value)}</div>
      )
    },
    {
      key: 'preferredLocale',
      label: 'Language',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'AR' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'
        }`}>
          {value === 'AR' ? 'العربية' : 'English'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <div className="text-sm text-slate-100">{formatDate(value)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: GraphQLUser) => (
        <div className="flex items-center space-x-1">
          <Tooltip content="Edit Role">
            <Button variant="ghost" size="sm" onClick={() => handleUpdateUserRole(row.id, row.role)}>
              <Edit className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Reset Password">
            <Button variant="ghost" size="sm" onClick={() => handleResetPassword(row.email)}>
              <Key className="h-4 w-4" />
            </Button>
          </Tooltip>
          {row.isActive ? (
            <Tooltip content="Deactivate User">
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleToggleUserStatus(row.id, false)}>
                <Ban className="h-4 w-4" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Reactivate User">
              <Button variant="ghost" size="sm" className="text-green-400" onClick={() => handleToggleUserStatus(row.id, true)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="More Actions">
            <Button variant="ghost" size="sm" onClick={() => handleMoreActions(row)}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  const inviteColumns = [
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="font-medium text-slate-100">{value}</div>
      )
    },
    {
      key: 'invitedRole',
      label: 'Role',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getInviteStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Invited',
      render: (value: string) => (
        <div className="text-sm">
          <div className="text-slate-100">{formatDate(value)}</div>
          <div className="text-slate-400">by Admin</div>
        </div>
      )
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      render: (value: string) => (
        <div className="text-sm text-slate-100">{formatDate(value)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: UserInvite) => (
        <div className="flex items-center space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Tooltip content="Resend Invite">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleResendInvite(row.id)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Revoke Invite">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRevokeInvite(row.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip content="Delete">
            <Button variant="ghost" size="sm" onClick={() => handleDeleteInvite(row.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  const handleSendInvite = async (inviteData: { email: string; role: 'ADMIN' | 'MANAGER'; message: string }) => {
    setIsInviting(true);
    try {
      await runAndRefetch(
        () => graphqlApiService.inviteUser({ email: inviteData.email, role: inviteData.role, message: inviteData.message }),
        {
          optimistic: () => setInvites(prev => [
            {
              id: `temp-${Date.now()}`,
              email: inviteData.email,
              invitedRole: inviteData.role,
              status: 'PENDING',
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
            } as unknown as UserInvite,
            ...prev,
          ])
        }
      );
      showToast({ type: 'success', title: 'Invitation Sent', message: `Invitation sent successfully to ${inviteData.email}!` });
    } catch (error) {
      console.error('Failed to send invite:', error);
      showToast({ type: 'error', title: 'Invitation Failed', message: error instanceof Error ? error.message : 'Failed to send invitation. Please try again.' });
      throw error; // keep modal open
    } finally {
      setIsInviting(false);
    }
  };

  const handleBulkInvite = async (emails: string[]) => {
    setIsInviting(true);
    try {
      const results = await Promise.allSettled(
        emails.map(email => graphqlApiService.inviteUser({ email, role: 'MANAGER' }))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (successful > 0) {
        showToast({ type: 'success', title: 'Bulk Invitations Sent', message: `${successful} invitation${successful !== 1 ? 's' : ''} sent successfully!` });
      }
      if (failed > 0) {
        showToast({ type: 'warning', title: 'Some Invitations Failed', message: `${failed} invitation${failed !== 1 ? 's' : ''} failed to send.` });
      }

      // Always refetch after a bulk op to converge UI with server
      await fetchData({ silent: false });
    } catch (error) {
      console.error('Failed to send bulk invites:', error);
      showToast({ type: 'error', title: 'Bulk Invitation Failed', message: error instanceof Error ? error.message : 'Failed to send invitations. Please try again.' });
      throw error;
    } finally {
      setIsInviting(false);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await runAndRefetch(
        () => graphqlApiService.resendInvite(inviteId),
        { optimistic: undefined }
      );
      showToast({ type: 'success', title: 'Invitation Resent', message: 'Invitation resent successfully!' });
    } catch (error) {
      console.error('Failed to resend invite:', error);
      showToast({ type: 'error', title: 'Resend Failed', message: error instanceof Error ? error.message : 'Failed to resend invitation.' });
    }
  };

  // Confirmation modal state for revoke/delete invite
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState<string>('');
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<'revoke' | 'delete'>('revoke');
  const [targetInviteId, setTargetInviteId] = useState<string | null>(null);

  const openConfirm = (action: 'revoke' | 'delete', inviteId: string) => {
    setConfirmAction(action);
    setTargetInviteId(inviteId);
    if (action === 'revoke') {
      setConfirmTitle('Revoke Invitation');
      setConfirmMessage('Are you sure you want to revoke this invitation? The invite link will no longer be valid.');
    } else {
      setConfirmTitle('Delete Invitation');
      setConfirmMessage('Are you sure you want to permanently delete this invitation from the database? This action cannot be undone.');
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetInviteId) return;
    setConfirmLoading(true);
    try {
      if (confirmAction === 'delete') {
        await runAndRefetch(
          () => graphqlApiService.deleteInvite(targetInviteId),
          { optimistic: () => setInvites(prev => prev.filter(i => i.id !== targetInviteId)) }
        );
      } else {
        await runAndRefetch(
          () => graphqlApiService.revokeInvite(targetInviteId),
          { optimistic: () => setInvites(prev => prev.map(i => (i.id === targetInviteId ? { ...i, status: 'REVOKED' } : i))) }
        );
        showToast({ type: 'success', title: 'Invitation Revoked', message: 'Invitation revoked successfully!' });
      }
      setConfirmOpen(false);
    } catch (error) {
      console.error('Failed to update invite:', error);
      showToast({ type: 'error', title: 'Operation Failed', message: error instanceof Error ? error.message : 'Failed to update invitation.' });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRevokeInvite = (inviteId: string) => openConfirm('revoke', inviteId);

  // Unified Refresh handler (same as pressing Refresh button)
  const refresh = React.useCallback(() => fetchData({ silent: false }), [fetchData]);

  // Filter users based on search and filters, then order by createdAt desc
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive && user.emailVerifiedAt) ||
      (statusFilter === 'inactive' && !user.isActive) ||
      (statusFilter === 'pending' && user.isActive && !user.emailVerifiedAt);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const orderedUsers = React.useMemo(() => {
    return [...filteredUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredUsers]);

  // Order invites: PENDING first, then by createdAt desc
  const orderedInvites = React.useMemo(() => {
    const statusRank = (s: string) => (s === 'PENDING' ? 0 : s === 'ACCEPTED' ? 1 : s === 'REVOKED' ? 2 : 3);
    return [...invites].sort((a, b) => {
      const sr = statusRank(a.status) - statusRank(b.status);
      if (sr !== 0) return sr;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [invites]);

  return (
    <div className="space-y-8">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={hideToast} />

      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Users</h1>
          <p className="mt-2 text-slate-400">
            Manage team members, roles, and permissions for your real estate platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button variant="outline" onClick={() => setShowBulkInviteModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Invite
          </Button>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Users Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Team Members</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refresh}
              disabled={isLoading}
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>

          <Table
            key={`users-${dataVersion}`}
            data={orderedUsers}
            columns={userColumns}
            emptyMessage="No users found matching your filters"
          />
        </Card>
      </motion.div>

      {/* Pending Invites Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Pending Invitations</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refresh}
                disabled={isLoading}
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Table
            key={`invites-${dataVersion}`}
            data={orderedInvites}
            columns={inviteColumns}
            emptyMessage={isLoading ? "Loading invitations..." : "No pending invitations"}
            loading={isLoading}
          />
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">New Users</p>
              <p className="text-2xl font-bold text-slate-100">3</p>
              <p className="text-sm text-slate-400 mt-1">This month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Verified</p>
              <p className="text-2xl font-bold text-slate-100">95%</p>
              <p className="text-sm text-slate-400 mt-1">Verification rate</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Avg. Response</p>
              <p className="text-2xl font-bold text-slate-100">2.4h</p>
              <p className="text-sm text-slate-400 mt-1">To invitations</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={handleSendInvite}
        isLoading={isInviting}
      />

      <BulkInviteModal
        isOpen={showBulkInviteModal}
        onClose={() => setShowBulkInviteModal(false)}
        onSubmit={handleBulkInvite}
        isLoading={isInviting}
      />

      {/* Confirm Revoke/Delete Invitation */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => !confirmLoading && setConfirmOpen(false)}
        title={confirmTitle}
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className={`h-10 min-w-10 rounded-full flex items-center justify-center ${confirmAction === 'delete' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {confirmAction === 'delete' ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-slate-300">{confirmMessage}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={confirmLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmLoading}
              className={confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'}
            >
              {confirmLoading ? (
                'Processing...'
              ) : (
                <span className="inline-flex items-center">
                  {confirmAction === 'delete' ? (
                    <Trash2 className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Confirm
                </span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
