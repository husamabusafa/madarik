import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  UserPlus, 
  Search, 
  Shield, 
  User, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Send,
  Upload,
  Download,
  RefreshCw,
  Eye,
  Ban,
  RotateCcw,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';
import Tooltip from '../components/common/Tooltip';
import Modal from '../components/common/Modal';
import InviteUserModal from '../components/users/InviteUserModal';
import BulkInviteModal from '../components/users/BulkInviteModal';
import UserDetailsModal from '../components/users/UserDetailsModal';
import UserGridView from '../components/users/UserGridView';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../contexts/AuthContext';
import { 
  GET_USERS, 
  GET_INVITATIONS, 
  GET_USER_STATS 
} from '../lib/graphql/queries';
import {
  CREATE_INVITE,
  RESEND_INVITE,
  REVOKE_INVITE,
  DELETE_INVITE,
  UPDATE_USER_ROLE,
  UPDATE_USER_STATUS
} from '../lib/graphql/mutations';
import { type UserInvite, type User as GraphQLUser, type UserStats } from '../lib/graphql-api';

// Apollo Client query response types
interface GetUsersData {
  users: GraphQLUser[];
}

interface GetInvitesData {
  invites: UserInvite[];
}

interface GetUserStatsData {
  userStats: UserStats;
}

const Users: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GraphQLUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete' | 'revoke' | 'deactivate' | 'activate' | 'resetPassword' | 'changeRole' | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string; newRole: 'ADMIN' | 'MANAGER' } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  // Apollo Client queries
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery<GetUsersData>(GET_USERS);
  const { data: invitesData, loading: invitesLoading, refetch: refetchInvites } = useQuery<GetInvitesData>(GET_INVITATIONS);
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery<GetUserStatsData>(GET_USER_STATS);

  // Apollo Client mutations
  const [createInvite] = useMutation(CREATE_INVITE, {
    refetchQueries: [{ query: GET_INVITATIONS }, { query: GET_USER_STATS }],
    awaitRefetchQueries: true
  });
  
  const [resendInvite] = useMutation(RESEND_INVITE, {
    refetchQueries: [{ query: GET_INVITATIONS }],
    awaitRefetchQueries: true
  });
  
  const [revokeInvite] = useMutation(REVOKE_INVITE, {
    refetchQueries: [{ query: GET_INVITATIONS }],
    awaitRefetchQueries: true
  });
  
  const [deleteInvite] = useMutation(DELETE_INVITE, {
    refetchQueries: [{ query: GET_INVITATIONS }],
    awaitRefetchQueries: true
  });
  
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    awaitRefetchQueries: true
  });
  
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    refetchQueries: [{ query: GET_USERS }, { query: GET_USER_STATS }],
    awaitRefetchQueries: true
  });

  // Extract data from queries
  const users: GraphQLUser[] = usersData?.users || [];
  const invites: UserInvite[] = invitesData?.invites || [];
  const stats = statsData?.userStats || null;
  const isLoading = usersLoading || invitesLoading || statsLoading;

  // Refresh function
  const refresh = async () => {
    try {
      await Promise.all([
        refetchUsers(),
        refetchInvites(),
        refetchStats()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      showToast({ type: 'error', title: 'Error', message: 'Failed to refresh data' });
    }
  };

  // Actions
  const handleSendInvite = async (inviteData: { email: string; role: 'ADMIN' | 'MANAGER'; message?: string }) => {
    try {
      await createInvite({
        variables: {
          input: {
            email: inviteData.email,
            role: inviteData.role,
            message: inviteData.message || ''
          }
        }
      });
      
      showToast({ type: 'success', title: 'Invitation Sent', message: `Invitation sent to ${inviteData.email}` });
      setShowInviteModal(false);
      
    } catch (error) {
      console.error('Failed to send invitation:', error);
      throw error; // Let the modal handle the error
    }
  };

  const handleBulkInvite = async (emails: string[]) => {
    try {
      const results = await Promise.allSettled(
        emails.map(email => createInvite({
          variables: {
            input: { email, role: 'MANAGER', message: '' }
          }
        }))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        showToast({ type: 'success', title: 'Bulk Invite Complete', message: `${successful} invitations sent successfully${failed > 0 ? `, ${failed} failed` : ''}` });
      } else {
        showToast({ type: 'error', title: 'Bulk Invite Failed', message: 'All invitations failed to send' });
      }
      setShowBulkInviteModal(false);
    } catch (error) {
      console.error('Failed to send bulk invitations:', error);
      throw error; // Let the modal handle the error
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendInvite({ variables: { id: inviteId } });
      showToast({ type: 'success', title: 'Invitation Resent', message: 'Invitation has been resent successfully' });
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      showToast({ type: 'error', title: 'Error', message: 'Failed to resend invitation' });
    }
  };

  const handleUpdateUserRole = async (userId: string, role: 'ADMIN' | 'MANAGER') => {
    if (currentUser?.id === userId) {
      showToast({ type: 'error', title: 'Action Not Allowed', message: 'You cannot edit your own role' });
      return;
    }
    
    setPendingRoleChange({ userId, newRole: role });
    setConfirmAction('changeRole');
    setConfirmTarget(userId);
    setConfirmOpen(true);
  };

  const executeRoleChange = async () => {
    if (!pendingRoleChange) return;
    
    try {
      await updateUserRole({ 
        variables: { 
          id: pendingRoleChange.userId, 
          input: { role: pendingRoleChange.newRole } 
        } 
      });
      showToast({ type: 'success', title: 'Role Updated', message: `User role updated to ${pendingRoleChange.newRole}` });
    } catch (error) {
      console.error('Failed to update user role:', error);
      showToast({ type: 'error', title: 'Error', message: 'Failed to update user role' });
    } finally {
      setPendingRoleChange(null);
    }
  };


  const handleResetPassword = async (userId: string) => {
    setConfirmAction('resetPassword');
    setConfirmTarget(userId);
    setConfirmOpen(true);
  };

  const executeResetPassword = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:3100/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `mutation ForgotPasswordAdmin($userId: String!) {
            forgotPasswordAdmin(userId: $userId)
          }`,
          variables: { userId },
        }),
      });

      const json = await response.json();
      if (!response.ok || json.errors) {
        throw new Error(json.errors?.[0]?.message || 'Failed to send password reset email');
      }

      showToast({ type: 'success', title: 'Password Reset Sent', message: 'Password reset email has been sent to the user' });
    } catch (error) {
      console.error('Failed to send password reset:', error);
      showToast({ type: 'error', title: 'Error', message: 'Failed to send password reset email' });
    }
  };

  const handleViewUserDetails = (user: GraphQLUser) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };


  const confirmDelete = (inviteId: string) => {
    setConfirmAction('delete');
    setConfirmTarget(inviteId);
    setConfirmOpen(true);
  };

  const confirmRevoke = (inviteId: string) => {
    setConfirmAction('revoke');
    setConfirmTarget(inviteId);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return;
    
    try {
      if (confirmAction === 'delete') {
        await deleteInvite({ variables: { id: confirmTarget } });
        showToast({ type: 'success', title: 'Invitation Deleted', message: 'Invitation has been deleted successfully' });
      } else if (confirmAction === 'revoke') {
        await revokeInvite({ variables: { id: confirmTarget } });
        showToast({ type: 'success', title: 'Invitation Revoked', message: 'Invitation has been revoked successfully' });
      } else if (confirmAction === 'deactivate') {
        await updateUserStatus({ variables: { id: confirmTarget, input: { isActive: false } } });
        showToast({ type: 'success', title: 'User Deactivated', message: 'User has been deactivated successfully' });
      } else if (confirmAction === 'activate') {
        await updateUserStatus({ variables: { id: confirmTarget, input: { isActive: true } } });
        showToast({ type: 'success', title: 'User Activated', message: 'User has been activated successfully' });
      } else if (confirmAction === 'resetPassword') {
        await executeResetPassword(confirmTarget);
      } else if (confirmAction === 'changeRole') {
        await executeRoleChange();
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      showToast({ type: 'error', title: 'Operation Failed', message: error instanceof Error ? error.message : 'Failed to perform action.' });
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleExportUsers = () => {
    try {
      const header = ['Email', 'Role', 'Active', 'Email Verified At', 'Last Login', 'Created At'];
      const rows = users.map((u: GraphQLUser) => [
        u.email,
        u.role,
        u.isActive ? 'true' : 'false',
        u.emailVerifiedAt ?? '',
        u.lastLoginAt ?? '',
        u.createdAt,
      ]);
      const csv = [header, ...rows]
        .map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast({ type: 'success', title: 'Export Complete', message: 'Users data exported successfully!' });
    } catch (error) {
      console.error('Failed to export users:', error);
      showToast({ type: 'error', title: 'Export Failed', message: 'Could not export users.' });
    }
  };

  // Helper functions for styling
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/10 text-purple-400';
      case 'MANAGER': return 'bg-blue-500/10 text-blue-400';
      default: return 'bg-slate-800/60 text-slate-300';
    }
  };

  const getStatusColor = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return 'bg-red-500/10 text-red-400';
    if (!emailVerifiedAt) return 'bg-amber-500/10 text-amber-400';
    return 'bg-green-500/10 text-green-400';
  };

  const getStatusText = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
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

  // Enhanced filtering with sorting
  const filteredUsers = users.filter((user: GraphQLUser) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive && user.emailVerifiedAt) ||
      (statusFilter === 'inactive' && !user.isActive) ||
      (statusFilter === 'pending' && user.isActive && !user.emailVerifiedAt) ||
      (statusFilter === 'unverified' && !user.emailVerifiedAt);
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a: GraphQLUser, b: GraphQLUser) => {
    // Sort by role (ADMIN first), then by status (active first), then by creation date (newest first)
    if (a.role !== b.role) {
      return a.role === 'ADMIN' ? -1 : 1;
    }
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredInvites = invites.filter((invite: UserInvite) => {
    const matchesSearch = invite.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a: UserInvite, b: UserInvite) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Table columns
  const userColumns = [
    {
      key: 'email',
      label: 'User',
      render: (value: string, row: GraphQLUser) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-100">{value}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(value)}`}>
          {value === 'ADMIN' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: GraphQLUser) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.isActive, row.emailVerifiedAt)}`}>
          {row.isActive && row.emailVerifiedAt ? <CheckCircle className="h-3 w-3 mr-1" /> : 
           !row.isActive ? <XCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
          {getStatusText(row.isActive, row.emailVerifiedAt)}
        </span>
      )
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login',
      render: (value: string | null) => (
        <div className="text-sm text-slate-300">
          {value ? (
            <div>
              <div>{new Date(value).toLocaleDateString()}</div>
              <div className="text-xs text-slate-500">
                {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <span className="text-slate-500">Never</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: GraphQLUser) => (
        <div className="flex items-center space-x-2">
          <Tooltip content="View Details">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewUserDetails(row)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Edit Role">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentUser?.id === row.id}
              onClick={() => handleUpdateUserRole(row.id, row.role === 'ADMIN' ? 'MANAGER' : 'ADMIN')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Reset Password">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResetPassword(row.id)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content={row.isActive ? "Deactivate" : "Activate"}>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentUser?.id === row.id && row.isActive}
              onClick={() => {
                if (currentUser?.id === row.id && row.isActive) {
                  showToast({ type: 'error', title: 'Action Not Allowed', message: 'You cannot deactivate your own account' });
                  return;
                }
                setConfirmAction(row.isActive ? 'deactivate' : 'activate');
                setConfirmTarget(row.id);
                setConfirmOpen(true);
              }}
            >
              {row.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
      render: (value: string, row: UserInvite) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-100">{value}</div>
            <div className="text-xs text-slate-400">
              Invited by {row.inviter?.email || 'Unknown'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'invitedRole',
      label: 'Role',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(value)}`}>
          {value === 'ADMIN' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInviteStatusColor(value)}`}>
          {value === 'PENDING' ? <Clock className="h-3 w-3 mr-1" /> :
           value === 'ACCEPTED' ? <CheckCircle className="h-3 w-3 mr-1" /> :
           value === 'EXPIRED' ? <XCircle className="h-3 w-3 mr-1" /> : <Ban className="h-3 w-3 mr-1" />}
          {value}
        </span>
      )
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      render: (value: string) => (
        <div className="text-sm text-slate-300">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <div className="text-sm text-slate-300">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: UserInvite) => (
        <div className="flex items-center space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Tooltip content="Resend Invitation">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResendInvite(row.id)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Revoke Invitation">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmRevoke(row.id)}
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip content="Delete Invitation">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => confirmDelete(row.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Users Management</h1>
          <p className="text-slate-400 mt-2">Manage team members and invitations</p>
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

      {/* Stats Cards */}
      {stats && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toString()}
            icon={User}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toString()}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Pending Invites"
            value={invites.filter((i: UserInvite) => i.status === 'PENDING').length.toString()}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Unverified Users"
            value={users.filter((u: GraphQLUser) => !u.emailVerifiedAt).length.toString()}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Expired Invites"
            value={invites.filter((i: UserInvite) => i.status === 'EXPIRED').length.toString()}
            icon={XCircle}
            color="red"
          />
          <StatCard
            title="Admins"
            value={stats.adminUsers.toString()}
            icon={Shield}
            color="purple"
          />
        </motion.div>
      )}

      {/* Filters */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active & Verified</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending Verification</option>
          <option value="unverified">Unverified Email</option>
        </select>
        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
          >
            Grid
          </button>
        </div>
        <Button variant="outline" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Users Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-100">Active Users ({filteredUsers.length})</h2>
            </div>
            {viewMode === 'table' ? (
              <Table
                columns={userColumns}
                data={filteredUsers}
                loading={isLoading}
              />
            ) : (
              <UserGridView
                users={filteredUsers}
                onViewDetails={handleViewUserDetails}
                onEditRole={handleUpdateUserRole}
                onResetPassword={handleResetPassword}
                onToggleStatus={(userId, isActive) => {
                  if (currentUser?.id === userId && !isActive) {
                    showToast({ type: 'error', title: 'Action Not Allowed', message: 'You cannot deactivate your own account' });
                    return;
                  }
                  setConfirmAction(isActive ? 'activate' : 'deactivate');
                  setConfirmTarget(userId);
                  setConfirmOpen(true);
                }}
              />
            )}
          </div>
        </Card>
      </motion.div>

      {/* Invitations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-100">Invitations ({filteredInvites.length})</h2>
            </div>
            <Table
              columns={inviteColumns}
              data={filteredInvites}
              loading={isLoading}
            />
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleSendInvite}
        isLoading={false}
      />

      <BulkInviteModal
        isOpen={showBulkInviteModal}
        onClose={() => setShowBulkInviteModal(false)}
        onBulkInvite={handleBulkInvite}
        isLoading={false}
      />

      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        user={selectedUser}
        onEditRole={handleUpdateUserRole}
        onResetPassword={handleResetPassword}
        onToggleStatus={(userId, isActive) => {
          if (currentUser?.id === userId && !isActive) {
            showToast({ type: 'error', title: 'Action Not Allowed', message: 'You cannot deactivate your own account' });
            return;
          }
          setConfirmAction(isActive ? 'activate' : 'deactivate');
          setConfirmTarget(userId);
          setConfirmOpen(true);
        }}
      />

      {/* Confirm Dialog */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={
          confirmAction === 'delete' ? 'Delete Invitation' :
          confirmAction === 'revoke' ? 'Revoke Invitation' :
          confirmAction === 'deactivate' ? 'Deactivate User' :
          confirmAction === 'activate' ? 'Activate User' :
          confirmAction === 'resetPassword' ? 'Reset Password' :
          confirmAction === 'changeRole' ? 'Change User Role' : 'Confirm Action'
        }
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            {confirmAction === 'delete' && 'Are you sure you want to delete this invitation? This action cannot be undone.'}
            {confirmAction === 'revoke' && 'Are you sure you want to revoke this invitation? The recipient will no longer be able to accept it.'}
            {confirmAction === 'deactivate' && 'Are you sure you want to deactivate this user? They will no longer be able to access the system.'}
            {confirmAction === 'activate' && 'Are you sure you want to activate this user? They will regain access to the system.'}
            {confirmAction === 'resetPassword' && 'Are you sure you want to send a password reset email to this user?'}
            {confirmAction === 'changeRole' && pendingRoleChange && `Are you sure you want to change this user's role to ${pendingRoleChange.newRole}? This will affect their permissions in the system.`}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {confirmAction === 'delete' && 'Delete'}
              {confirmAction === 'revoke' && 'Revoke'}
              {confirmAction === 'deactivate' && 'Deactivate'}
              {confirmAction === 'activate' && 'Activate'}
              {confirmAction === 'resetPassword' && 'Send Reset Email'}
              {confirmAction === 'changeRole' && 'Change Role'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
