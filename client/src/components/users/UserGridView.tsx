import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Globe,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  RotateCcw,
  UserCheck,
  UserX,
  Mail
} from 'lucide-react';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import { type User as GraphQLUser } from '../../lib/graphql-api';

interface UserGridViewProps {
  users: GraphQLUser[];
  onViewDetails: (user: GraphQLUser) => void;
  onEditRole: (userId: string, role: 'ADMIN' | 'MANAGER') => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
}

const UserGridView: React.FC<UserGridViewProps> = ({
  users,
  onViewDetails,
  onEditRole,
  onResetPassword,
  onToggleStatus
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'MANAGER': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-800/60 text-slate-300 border-slate-600/20';
    }
  };

  const getStatusColor = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (!emailVerifiedAt) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-green-500/10 text-green-400 border-green-500/20';
  };

  const getStatusText = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return 'Inactive';
    if (!emailVerifiedAt) return 'Pending';
    return 'Active';
  };

  const getStatusIcon = (isActive: boolean, emailVerifiedAt: string | null | undefined) => {
    if (!isActive) return XCircle;
    if (!emailVerifiedAt) return Clock;
    return CheckCircle;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map((user, index) => {
        const StatusIcon = getStatusIcon(user.isActive, user.emailVerifiedAt);
        
        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
          >
            {/* User Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                <User className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-sm font-medium text-slate-100 truncate w-full" title={user.email}>
                {user.email}
              </h3>
              
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                  {user.role === 'ADMIN' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                  {user.role}
                </span>
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(user.isActive, user.emailVerifiedAt)}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {getStatusText(user.isActive, user.emailVerifiedAt)}
              </span>
            </div>

            {/* User Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Language
                </span>
                <span className="text-slate-200">{user.preferredLocale}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created
                </span>
                <span className="text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  Last Login
                </span>
                <span className="text-slate-200">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                </span>
              </div>

              {user.emailVerifiedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                  <span className="text-slate-200">{new Date(user.emailVerifiedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1 justify-center">
              <Tooltip content="View Details">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(user)}
                  className="p-2"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip content="Edit Role">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditRole(user.id, user.role === 'ADMIN' ? 'MANAGER' : 'ADMIN')}
                  className="p-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip content="Reset Password">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResetPassword(user.id)}
                  className="p-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              <Tooltip content={user.isActive ? "Deactivate" : "Activate"}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(user.id, !user.isActive)}
                  className="p-2"
                >
                  {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                </Button>
              </Tooltip>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserGridView;
