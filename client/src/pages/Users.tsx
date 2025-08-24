import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Mail, 
  Shield, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Trash2,
  Edit,
  Send,
  UserCheck,
  UserX,
  Upload,
  Download,
  Copy,
  AlertCircle,
  Key,
  Ban,
  RotateCcw
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';
import InviteUserModal from '../components/users/InviteUserModal';
import BulkInviteModal from '../components/users/BulkInviteModal';
import { ToastContainer } from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { apiService, type UserInvite } from '../lib/api';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast, hideToast } = useToast();

  // Mock data
  const users = [
    {
      id: 1,
      email: 'admin@madarik.com',
      role: 'ADMIN',
      isActive: true,
      emailVerifiedAt: '2024-01-01T10:00:00Z',
      lastLoginAt: '2024-01-23T09:30:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      preferredLocale: 'EN',
      listingsCreated: 45,
      leadsAssigned: 23
    },
    {
      id: 2,
      email: 'john.smith@madarik.com',
      role: 'MANAGER',
      isActive: true,
      emailVerifiedAt: '2024-01-05T14:20:00Z',
      lastLoginAt: '2024-01-22T16:45:00Z',
      createdAt: '2024-01-05T14:20:00Z',
      preferredLocale: 'EN',
      listingsCreated: 23,
      leadsAssigned: 45
    },
    {
      id: 3,
      email: 'jane.doe@madarik.com',
      role: 'MANAGER',
      isActive: true,
      emailVerifiedAt: '2024-01-10T11:15:00Z',
      lastLoginAt: '2024-01-23T08:20:00Z',
      createdAt: '2024-01-10T11:15:00Z',
      preferredLocale: 'AR',
      listingsCreated: 18,
      leadsAssigned: 38
    },
    {
      id: 4,
      email: 'pending@madarik.com',
      role: 'MANAGER',
      isActive: false,
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: '2024-01-20T15:30:00Z',
      preferredLocale: 'EN',
      listingsCreated: 0,
      leadsAssigned: 0
    }
  ];

  const [invites, setInvites] = useState<UserInvite[]>([]);

  // Fetch data on component mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, invitesData] = await Promise.all([
        apiService.getUsers(),
        apiService.getInvites(),
      ]);
      
      // Update state with real data
      // setUsers(usersData); // Uncomment when you have real users data
      setInvites(invitesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast({
        type: 'error',
        title: 'Data Fetch Failed',
        message: 'Failed to load users and invitations data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate dynamic stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive && user.emailVerifiedAt).length;
  const pendingInvites = invites.filter(invite => invite.status === 'PENDING').length;
  const adminUsers = users.filter(user => user.role === 'ADMIN').length;

  const stats = [
    { 
      title: 'Total Users', 
      value: totalUsers.toString(), 
      icon: User, 
      change: { value: 2, type: 'increase' as const }, 
      color: 'blue' as const 
    },
    { 
      title: 'Active Users', 
      value: activeUsers.toString(), 
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
      value: adminUsers.toString(), 
      icon: Shield, 
      change: { value: 0, type: 'increase' as const }, 
      color: 'purple' as const 
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'MANAGER': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string, isActive: boolean, emailVerifiedAt: string | null) => {
    if (!isActive) return 'bg-red-100 text-red-700';
    if (!emailVerifiedAt) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (isActive: boolean, emailVerifiedAt: string | null) => {
    if (!isActive) return 'Inactive';
    if (!emailVerifiedAt) return 'Pending Verification';
    return 'Active';
  };

  const getInviteStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED': return 'bg-green-100 text-green-700';
      case 'EXPIRED': return 'bg-red-100 text-red-700';
      case 'REVOKED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
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
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">
              ID: {row.id} • {row.preferredLocale}
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
      render: (value: boolean, row: any) => {
        const statusText = getStatusText(value, row.emailVerifiedAt);
        const statusColor = getStatusColor(statusText, value, row.emailVerifiedAt);
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
        <div className="text-sm text-gray-900">{formatDate(value)}</div>
      )
    },
    {
      key: 'listingsCreated',
      label: 'Activity',
      render: (listings: number, row: any) => (
        <div className="text-sm">
          <div className="text-gray-900">{listings} listings</div>
          <div className="text-gray-500">{row.leadsAssigned} leads</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <div className="text-sm text-gray-900">{formatDate(value)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" title="Edit User">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Reset Password">
            <Key className="h-4 w-4" />
          </Button>
          {row.isActive ? (
            <Button variant="ghost" size="sm" title="Deactivate" className="text-red-600">
              <Ban className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" title="Reactivate" className="text-green-600">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" title="More Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const inviteColumns = [
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
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
      render: (value: string, row: UserInvite) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(value)}</div>
          <div className="text-gray-500">by Admin</div>
        </div>
      )
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      render: (value: string) => (
        <div className="text-sm text-gray-900">{formatDate(value)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: UserInvite) => (
        <div className="flex items-center space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                title="Resend Invite"
                onClick={() => handleResendInvite(row.id)}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                title="Revoke Invite"
                onClick={() => handleRevokeInvite(row.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleSendInvite = async (inviteData: { email: string; role: 'ADMIN' | 'MANAGER'; message: string }) => {
    setIsInviting(true);
    try {
      const response = await apiService.inviteUser({
        email: inviteData.email,
        role: inviteData.role,
      });
      
      showToast({
        type: 'success',
        title: 'Invitation Sent',
        message: `Invitation sent successfully to ${inviteData.email}!`,
      });
      
      // Refresh the invites list
      await fetchData();
      
    } catch (error) {
      console.error('Failed to send invite:', error);
      showToast({
        type: 'error',
        title: 'Invitation Failed',
        message: error instanceof Error ? error.message : 'Failed to send invitation. Please try again.',
      });
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsInviting(false);
    }
  };

  const handleBulkInvite = async (emails: string[]) => {
    setIsInviting(true);
    try {
      // Send invitations one by one
      const results = await Promise.allSettled(
        emails.map(email => 
          apiService.inviteUser({
            email,
            role: 'MANAGER', // Bulk invites are always managers
          })
        )
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      if (successful > 0) {
        showToast({
          type: 'success',
          title: 'Bulk Invitations Sent',
          message: `${successful} invitation${successful !== 1 ? 's' : ''} sent successfully!`,
        });
      }
      
      if (failed > 0) {
        showToast({
          type: 'warning',
          title: 'Some Invitations Failed',
          message: `${failed} invitation${failed !== 1 ? 's' : ''} failed to send.`,
        });
      }
      
      // Refresh the invites list
      await fetchData();
      
    } catch (error) {
      console.error('Failed to send bulk invites:', error);
      showToast({
        type: 'error',
        title: 'Bulk Invitation Failed',
        message: error instanceof Error ? error.message : 'Failed to send invitations. Please try again.',
      });
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsInviting(false);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await apiService.resendInvite(inviteId);
      showToast({
        type: 'success',
        title: 'Invitation Resent',
        message: 'Invitation resent successfully!',
      });
      // Refresh the invites list
      await fetchData();
    } catch (error) {
      console.error('Failed to resend invite:', error);
      showToast({
        type: 'error',
        title: 'Resend Failed',
        message: error instanceof Error ? error.message : 'Failed to resend invitation.',
      });
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    
    try {
      await apiService.revokeInvite(inviteId);
      showToast({
        type: 'success',
        title: 'Invitation Revoked',
        message: 'Invitation revoked successfully!',
      });
      // Refresh the invites list
      await fetchData();
    } catch (error) {
      console.error('Failed to revoke invite:', error);
      showToast({
        type: 'error',
        title: 'Revoke Failed',
        message: error instanceof Error ? error.message : 'Failed to revoke invitation.',
      });
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive && user.emailVerifiedAt) ||
      (statusFilter === 'inactive' && !user.isActive) ||
      (statusFilter === 'pending' && user.isActive && !user.emailVerifiedAt);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-600">
            Manage team members, roles, and permissions for your real estate platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
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
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchData}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>

          <Table
            data={filteredUsers}
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
            <h2 className="text-xl font-semibold text-gray-900">Pending Invitations</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchData}
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
            data={invites}
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">95%</p>
              <p className="text-sm text-gray-500 mt-1">Verification rate</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Response</p>
              <p className="text-2xl font-bold text-gray-900">2.4h</p>
              <p className="text-sm text-gray-500 mt-1">To invitations</p>
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
    </div>
  );
};

export default Users;
