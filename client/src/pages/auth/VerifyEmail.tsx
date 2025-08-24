import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, resendVerification } = useAuth();
  const { t } = useI18n();

  const token = searchParams.get('token');

  // Auto-verify if token is present
  useEffect(() => {
    if (token && !isVerifying) {
      handleTokenVerification(token);
    }
  }, [token]);

  const handleTokenVerification = async (verificationToken: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      await verifyEmail(verificationToken);
      setVerificationStatus('success');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(err.message || t('common.error'));
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage(null);
    setError(null);

    try {
      await resendVerification();
      setResendMessage('Verification email sent successfully');
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsResending(false);
    }
  };

  // Show success state if verification was successful
  if (verificationStatus === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Email Verified Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Your email has been verified. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* Header */}
      <div className="mb-8">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
          verificationStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          {verificationStatus === 'error' ? (
            <AlertCircle className="h-6 w-6 text-red-600" />
          ) : (
            <Mail className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {verificationStatus === 'error' ? 'Verification Failed' : t('auth.verifyEmailTitle')}
        </h2>
        <p className="mt-2 text-gray-600">
          {verificationStatus === 'error' 
            ? 'The verification link is invalid or has expired.'
            : t('auth.verifyEmailSubtitle')
          }
        </p>
        {user?.email && (
          <p className="mt-2 text-sm font-medium text-gray-900">
            {user.email}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isVerifying && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-sm text-blue-700">Verifying your email...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {resendMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <p className="text-sm text-green-700">{resendMessage}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!token && !verificationStatus && (
        <div className="mb-8 text-sm text-gray-600">
          <p>
            Check your email and click the verification link to activate your account.
            If you don't see the email, check your spam folder.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        {user && (
          <Button
            onClick={handleResendVerification}
            loading={isResending}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('auth.resendVerification')}
          </Button>
        )}
        
        <Link to="/auth/login">
          <Button variant="ghost" className="w-full">
            {t('auth.backToLogin')}
          </Button>
        </Link>
      </div>

      {/* Additional Help */}
      <div className="mt-8 text-xs text-gray-500">
        <p>
          Having trouble? Contact support at support@madarik.com
        </p>
      </div>
    </div>
  );
}
