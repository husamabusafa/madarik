import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  User, 
  Shield, 
  MessageSquare, 
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2
} from 'lucide-react';

interface InviteUserData {
  email: string;
  role: 'ADMIN' | 'MANAGER';
  message?: string;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteUserData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  email?: string;
  general?: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<InviteUserData>({
    email: '',
    role: 'MANAGER',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', role: 'MANAGER', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = useCallback((email: string): string | null => {
    if (!email.trim()) {
      return 'Email address is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [errors.email]);

  const handleRoleChange = useCallback((role: 'ADMIN' | 'MANAGER') => {
    setFormData(prev => ({ ...prev, role }));
  }, []);

  const handleMessageChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, message: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onInvite({
        email: formData.email.trim(),
        role: formData.role,
        message: formData.message?.trim() || undefined
      });
      
      // Success - modal will be closed by parent component
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to send invitation'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateEmail, onInvite]);

  const handleClose = useCallback(() => {
    if (!isSubmitting && !isLoading) {
      onClose();
    }
  }, [isSubmitting, isLoading, onClose]);

  const roleOptions = [
    {
      value: 'MANAGER' as const,
      title: 'Manager',
      description: 'Can manage properties, leads, and view analytics',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    },
    {
      value: 'ADMIN' as const,
      title: 'Administrator',
      description: 'Full access including user management and system settings',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Invite New User</h2>
                <p className="text-sm text-slate-400">Send an invitation to join your team</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-300">{errors.general}</span>
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  placeholder="user@company.com"
                  className={`w-full pl-10 pr-3 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email 
                      ? 'border-red-500/50 focus:ring-red-500/50' 
                      : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500/50'
                  }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400 flex items-center space-x-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </motion.p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                User Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleChange(option.value)}
                      disabled={isSubmitting || isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? `${option.borderColor} ${option.bgColor}`
                          : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-slate-100">{option.title}</h3>
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Personal Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Personal Message <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  value={formData.message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  placeholder="Add a welcome message that will be included in the invitation email..."
                  rows={3}
                  className="w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-200">What happens next?</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• User receives an email invitation immediately</li>
                    <li>• They can set up their account using a secure link</li>
                    <li>• Invitation expires automatically after 7 days</li>
                    <li>• You can resend or revoke the invitation anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !formData.email.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
              >
                {isSubmitting || isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InviteUserModal;
