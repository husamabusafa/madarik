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
  UserX
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

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

  const invites = [
    {
      id: 1,
      email: 'newuser@example.com',
      invitedRole: 'MANAGER',
      status: 'PENDING',
      inviterEmail: 'admin@madarik.com',
      createdAt: '2024-01-22T10:00:00Z',
      expiresAt: '2024-01-29T10:00:00Z'
    },
    {
      id: 2,
      email: 'manager2@example.com',
      invitedRole: 'MANAGER',
      status: 'EXPIRED',
      inviterEmail: 'admin@madarik.com',
      createdAt: '2024-01-15T14:30:00Z',
      expiresAt: '2024-01-22T14:30:00Z'
    }
  ];

  const stats = [
    { title: 'Total Users', value: '12', icon: User, change: { value: 2, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Active Users', value: '10', icon: UserCheck, change: { value: 1, type: 'increase' as const }, color: 'green' as const },
    { title: 'Pending Invites', value: '3', icon: Clock, change: { value: 0, type: 'increase' as const }, color: 'orange' as const },
    { title: 'Admins', value: '2', icon: Shield, change: { value: 0, type: 'increase' as const }, color: 'purple' as const },
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
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="Edit User">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
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
      render: (value: string, row: any) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(value)}</div>
          <div className="text-gray-500">by {row.inviterEmail}</div>
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
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Button variant="ghost" size="sm" title="Resend Invite">
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Revoke Invite">
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

  return (
    <div className="space-y-8">
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
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
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
            data={users}
            columns={userColumns}
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table
            data={invites}
            columns={inviteColumns}
            emptyMessage="No pending invitations"
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

      {/* Invite Modal Placeholder */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New User</h3>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="user@example.com"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowInviteModal(false)}>
                Send Invitation
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Users;
