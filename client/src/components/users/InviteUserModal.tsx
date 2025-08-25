import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mail, 
  User, 
  Shield, 
  MessageSquare, 
  AlertCircle, 
  Check,
  Clock,
  Key
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface InviteForm {
  email: string;
  role: 'ADMIN' | 'MANAGER';
  message: string;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteForm) => Promise<void>;
  isLoading?: boolean;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [form, setForm] = useState<InviteForm>({
    email: '',
    role: 'MANAGER',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<InviteForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<InviteForm> = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onSubmit(form);
      // Reset form on success
      setForm({ email: '', role: 'MANAGER', message: '' });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleInputChange = (field: keyof InviteForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const roleOptions = [
    {
      value: 'MANAGER' as const,
      label: 'Manager',
      description: 'Can manage properties, leads, and view analytics',
      icon: User,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      value: 'ADMIN' as const,
      label: 'Administrator',
      description: 'Full access to all features and user management',
      icon: Shield,
      color: 'text-purple-400 bg-purple-500/10'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite New User"
      size="lg"
    >
      <div className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@example.com"
              error={errors.email}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <Key className="inline h-4 w-4 mr-1" />
              User Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = form.role === option.value;
                
                return (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-blue-500/60 bg-blue-500/10'
                        : 'border-slate-800 hover:border-slate-700 hover:bg-white/5'
                    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => !isLoading && handleInputChange('role', option.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${option.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-100">
                            {option.label}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Personal Message (Optional)
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Add a personal welcome message to the invitation..."
            />
            <p className="mt-1 text-xs text-slate-400">
              This message will be included in the invitation email
            </p>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-100 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>User receives email invitation instantly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Key className="h-3 w-3 text-slate-400" />
                  <span>Secure link to set up their account</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-slate-400" />
                  <span>Access to {form.role.toLowerCase()} dashboard features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-3 w-3 text-slate-400" />
                  <span>Invitation expires in 7 days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!form.email.trim() || isLoading}
            className="min-w-[140px]"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteUserModal;
