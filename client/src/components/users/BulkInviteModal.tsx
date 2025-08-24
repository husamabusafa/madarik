import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  FileText,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface BulkInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emails: string[]) => Promise<void>;
  isLoading?: boolean;
}

const BulkInviteModal: React.FC<BulkInviteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const parsedEmails = useMemo(() => {
    const emails = emailInput
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emails.map(email => ({
      email,
      isValid: emailRegex.test(email)
    }));
  }, [emailInput]);

  const validEmails = parsedEmails.filter(item => item.isValid);
  const invalidEmails = parsedEmails.filter(item => !item.isValid);

  const handleSubmit = async () => {
    if (validEmails.length === 0) return;
    
    try {
      await onSubmit(validEmails.map(item => item.email));
      setEmailInput('');
      setShowPreview(false);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Email Address\nexample1@company.com\nexample2@company.com\nexample3@company.com";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-invite-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exampleEmails = [
    'john.doe@company.com',
    'jane.smith@company.com',
    'mike.johnson@company.com'
  ].join('\n');

  const handleUseExample = () => {
    setEmailInput(exampleEmails);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Invite Users"
      size="xl"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Bulk Invitation Instructions
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enter email addresses separated by commas or new lines</li>
                <li>• All users will be invited with Manager role</li>
                <li>• Invalid email addresses will be skipped</li>
                <li>• Each user will receive an individual invitation email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseExample}
            disabled={isLoading}
          >
            <FileText className="h-4 w-4 mr-2" />
            Use Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            disabled={isLoading || parsedEmails.length === 0}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview Emails
              </>
            )}
          </Button>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Addresses
          </label>
          <textarea
            rows={8}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none font-mono text-sm"
            placeholder="Enter email addresses, one per line:&#10;john@example.com&#10;jane@example.com&#10;admin@example.com&#10;&#10;Or separated by commas:&#10;john@example.com, jane@example.com, admin@example.com"
          />
          
          {/* Email Count Summary */}
          {parsedEmails.length > 0 && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {validEmails.length > 0 && (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {validEmails.length} valid
                  </span>
                )}
                {invalidEmails.length > 0 && (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {invalidEmails.length} invalid
                  </span>
                )}
              </div>
              <span className="text-gray-500">
                Total: {parsedEmails.length} emails
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
            className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Email Preview ({parsedEmails.length} total)
            </h4>
            <div className="space-y-2">
              {parsedEmails.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    item.isValid
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="font-mono">{item.email}</span>
                  {item.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Warning for invalid emails */}
        {invalidEmails.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-900">
                  Invalid Email Addresses Detected
                </h4>
                <p className="text-sm text-yellow-800 mt-1">
                  {invalidEmails.length} email address(es) are invalid and will be skipped. 
                  Only {validEmails.length} valid email(s) will receive invitations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
            disabled={validEmails.length === 0 || isLoading}
            className="min-w-[180px]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Send {validEmails.length} Invitation{validEmails.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkInviteModal;
