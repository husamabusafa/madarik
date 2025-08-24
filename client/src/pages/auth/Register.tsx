import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Eye, EyeOff, Lock, Globe } from 'lucide-react';

// Accept Invite schema
const acceptInviteSchema = z.object({
  password: z.string().min(8, 'validation.password'),
  confirmPassword: z.string(),
  preferredLocale: z.enum(['EN', 'AR']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
});

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { acceptInvite } = useAuth();
  const { t, isRTL, locale } = useI18n();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      // Without token, redirect to login since registration is invite-only
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      preferredLocale: locale === 'AR' ? 'AR' : 'EN',
    },
  });

  const onSubmit = async (data: AcceptInviteFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('Missing invite token');
      await acceptInvite(token, data.password, data.preferredLocale);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Accept Invitation
        </h2>
        <p className="mt-2 text-gray-600">
          Set your password to activate your account.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Register Form */}
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

        {/* Preferred Language */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            {...register('preferredLocale')}
            className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          >
            <option value="EN">{t('common.english')}</option>
            <option value="AR">{t('common.arabic')}</option>
          </select>
          <Globe className={`absolute top-9 ${isRTL ? 'right-3' : 'left-3'} h-5 w-5 text-gray-400`} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          Accept Invitation
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('auth.hasAccount')}{' '}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
