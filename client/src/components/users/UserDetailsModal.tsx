import React from 'react';
import {
  User,
  Mail,
  Shield,
  Globe,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Eye,
  FileText,
  Users
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { type User as GraphQLUser } from '../../lib/graphql-api';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GraphQLUser | null;
  onEditRole: (userId: string, role: 'ADMIN' | 'MANAGER') => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onEditRole,
  onResetPassword,
  onToggleStatus
}) => {
  if (!user) return null;

  const getStatusColor = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (!emailVerifiedAt) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-green-500/10 text-green-400 border-green-500/20';
  };

  const getStatusText = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return 'Inactive';
    if (!emailVerifiedAt) return 'Pending Verification';
    return 'Active & Verified';
  };

  const getStatusIcon = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return XCircle;
    if (!emailVerifiedAt) return Clock;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon(user.isActive, user.emailVerifiedAt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* User Header */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 truncate">{user.email}</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {user.role === 'ADMIN' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                {user.role}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.isActive, user.emailVerifiedAt)}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {getStatusText(user.isActive, user.emailVerifiedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* User Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Basic Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-200">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Preferred Language</p>
                  <p className="text-sm text-slate-200">{user.preferredLocale === 'EN' ? 'English' : 'Arabic'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Role</p>
                  <p className="text-sm text-slate-200">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Activity</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Last Login</p>
                  <p className="text-sm text-slate-200">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email Verified</p>
                  <p className="text-sm text-slate-200">
                    {user.emailVerifiedAt ? new Date(user.emailVerifiedAt).toLocaleDateString() : 'Not verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">0</p>
                <p className="text-xs text-slate-400">Created Listings</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">0</p>
                <p className="text-xs text-slate-400">Assigned Leads</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">0</p>
                <p className="text-xs text-slate-400">Invites Sent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={() => onEditRole(user.id, user.role === 'ADMIN' ? 'MANAGER' : 'ADMIN')}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Change Role to {user.role === 'ADMIN' ? 'Manager' : 'Admin'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onResetPassword(user.id)}
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Send Password Reset</span>
          </Button>

          <Button
            variant={user.isActive ? "outline" : "primary"}
            onClick={() => onToggleStatus(user.id, !user.isActive)}
            className={`flex items-center space-x-2 ${
              user.isActive 
                ? 'border-red-500 text-red-400 hover:bg-red-500/10' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <span>{user.isActive ? 'Deactivate User' : 'Activate User'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
