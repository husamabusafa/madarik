import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Users, 
  Download, 
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

interface BulkInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkInvite: (emails: string[]) => Promise<void>;
  isLoading?: boolean;
}

interface EmailValidation {
  email: string;
  isValid: boolean;
  error?: string;
}

interface FormErrors {
  general?: string;
}

const BulkInviteModal: React.FC<BulkInviteModalProps> = ({
  isOpen,
  onClose,
  onBulkInvite,
  isLoading = false
}) => {
  const [emailText, setEmailText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setEmailText('');
      setShowPreview(false);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = useCallback((email: string): { isValid: boolean; error?: string } => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return { isValid: false, error: 'Empty email' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Invalid format' };
    }
    
    return { isValid: true };
  }, []);

  const parsedEmails = useMemo((): EmailValidation[] => {
    if (!emailText.trim()) return [];
    
    // Split by comma, semicolon, or newline and filter out empty strings
    const emails = emailText
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    // Remove duplicates while preserving order
    const uniqueEmails = emails.filter((email, index) => emails.indexOf(email) === index);
    
    return uniqueEmails.map(email => {
      const validation = validateEmail(email);
      return {
        email,
        isValid: validation.isValid,
        error: validation.error
      };
    });
  }, [emailText, validateEmail]);

  const validEmails = useMemo(() => 
    parsedEmails.filter(item => item.isValid), 
    [parsedEmails]
  );

  const invalidEmails = useMemo(() => 
    parsedEmails.filter(item => !item.isValid), 
    [parsedEmails]
  );

  const handleEmailTextChange = useCallback((value: string) => {
    setEmailText(value);
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  }, [errors.general]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validEmails.length === 0) {
      setErrors({ general: 'Please enter at least one valid email address' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onBulkInvite(validEmails.map(item => item.email));
      // Success - modal will be closed by parent component
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to send invitations'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validEmails, onBulkInvite]);

  const handleClose = useCallback(() => {
    if (!isSubmitting && !isLoading) {
      onClose();
    }
  }, [isSubmitting, isLoading, onClose]);

  const downloadTemplate = useCallback(() => {
    const csvContent = [
      'Email Address',
      'john.doe@company.com',
      'jane.smith@company.com',
      'mike.johnson@company.com',
      'sarah.wilson@company.com',
      'david.brown@company.com'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-invite-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const loadExampleData = useCallback(() => {
    const exampleEmails = [
      'john.doe@company.com',
      'jane.smith@company.com',
      'mike.johnson@company.com'
    ].join('\n');
    setEmailText(exampleEmails);
  }, []);

  const clearAll = useCallback(() => {
    setEmailText('');
    setShowPreview(false);
    setErrors({});
  }, []);

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
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Bulk Invite Users</h2>
                <p className="text-sm text-slate-400">Invite multiple users at once</p>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
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

              {/* Instructions */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">How to use bulk invite:</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• Enter email addresses separated by commas, semicolons, or new lines</li>
                      <li>• All users will be invited with Manager role by default</li>
                      <li>• Invalid emails will be highlighted and skipped</li>
                      <li>• Duplicate emails will be automatically removed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tools */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadTemplate}
                  disabled={isSubmitting || isLoading}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Template</span>
                </button>
                <button
                  type="button"
                  onClick={loadExampleData}
                  disabled={isSubmitting || isLoading}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-4 w-4" />
                  <span>Load Example</span>
                </button>
                {parsedEmails.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={isSubmitting || isLoading}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                  </button>
                )}
                {emailText.trim() && (
                  <button
                    type="button"
                    onClick={clearAll}
                    disabled={isSubmitting || isLoading}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email Addresses
                </label>
                <textarea
                  value={emailText}
                  onChange={(e) => handleEmailTextChange(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  placeholder="Enter email addresses separated by commas or new lines:&#10;&#10;john@company.com, jane@company.com&#10;mike@company.com&#10;sarah@company.com"
                  rows={8}
                  className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                
                {/* Email Count Summary */}
                {parsedEmails.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {validEmails.length > 0 && (
                        <span className="flex items-center text-green-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {validEmails.length} valid
                        </span>
                      )}
                      {invalidEmails.length > 0 && (
                        <span className="flex items-center text-red-400">
                          <XCircle className="h-4 w-4 mr-1" />
                          {invalidEmails.length} invalid
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400">
                      Total: {parsedEmails.length} email{parsedEmails.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Preview */}
              {showPreview && parsedEmails.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-slate-700 rounded-lg overflow-hidden"
                >
                  <div className="p-3 bg-slate-800/50 border-b border-slate-700">
                    <h4 className="text-sm font-medium text-slate-200">
                      Email Preview ({parsedEmails.length} total)
                    </h4>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="p-3 space-y-2">
                      {parsedEmails.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            item.isValid
                              ? 'bg-green-500/10 border border-green-500/20'
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}
                        >
                          <span className={`font-mono ${item.isValid ? 'text-green-300' : 'text-red-300'}`}>
                            {item.email}
                          </span>
                          <div className="flex items-center space-x-2">
                            {item.error && (
                              <span className="text-xs text-red-400">{item.error}</span>
                            )}
                            {item.isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Warning for invalid emails */}
              {invalidEmails.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-400">
                        Invalid Email Addresses Detected
                      </h4>
                      <p className="text-sm text-amber-300 mt-1">
                        {invalidEmails.length} email address{invalidEmails.length !== 1 ? 'es are' : ' is'} invalid and will be skipped. 
                        Only {validEmails.length} valid email{validEmails.length !== 1 ? 's' : ''} will receive invitations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || validEmails.length === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
            >
              {isSubmitting || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>
                    Send {validEmails.length} Invitation{validEmails.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BulkInviteModal;
