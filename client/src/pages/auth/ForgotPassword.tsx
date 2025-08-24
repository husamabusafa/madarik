import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, ArrowLeft } from 'lucide-react';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('validation.email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { forgotPassword } = useAuth();
  const { t, isRTL } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-gray-600">
            We've sent a password reset link to{' '}
            <span className="font-medium">{getValues('email')}</span>
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="w-full"
          >
            Try another email
          </Button>
          
          <Link to="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('auth.backToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {t('auth.forgotPasswordTitle')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('auth.forgotPasswordSubtitle')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <Input
            {...register('email')}
            type="email"
            label={t('auth.email')}
            placeholder="user@example.com"
            error={errors.email ? t(errors.email.message || 'validation.email') : undefined}
            className={`${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          />
          <Mail className={`absolute top-9 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400`} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          {t('auth.sendResetLink')}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          {t('auth.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
