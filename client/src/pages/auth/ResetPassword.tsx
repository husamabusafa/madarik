import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Eye, EyeOff, Lock } from 'lucide-react';

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'validation.password'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { t, isRTL } = useI18n();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth/forgot-password');
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, data.password);
      
      // Redirect to login with success message
      navigate('/auth/login?message=password-reset-success');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect to forgot password
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {t('auth.resetPasswordTitle')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('auth.resetPasswordSubtitle')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Field */}
        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label={t('auth.password')}
            placeholder="••••••••"
            error={errors.password ? t(errors.password.message || 'validation.password') : undefined}
            className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
          />
          <Lock className={`absolute top-9 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400`} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-9 ${isRTL ? 'left-3' : 'right-3'} h-5 w-5 text-gray-400 hover:text-gray-600`}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label={t('auth.confirmPassword')}
            placeholder="••••••••"
            error={errors.confirmPassword ? t(errors.confirmPassword.message || 'validation.passwordMismatch') : undefined}
            className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
          />
          <Lock className={`absolute top-9 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400`} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute top-9 ${isRTL ? 'left-3' : 'right-3'} h-5 w-5 text-gray-400 hover:text-gray-600`}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          {t('auth.updatePassword')}
        </Button>
      </form>
    </div>
  );
}
