import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Globe } from 'lucide-react';

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
  const { t, isRTL, locale, setLocale } = useI18n();

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
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Language Toggle */}
      <motion.div
        className="flex justify-end mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.button
            onClick={() => setLocale(locale === 'EN' ? 'AR' : 'EN')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe className="h-4 w-4 text-blue-300 group-hover:text-blue-200 transition-colors" />
            <span className="text-sm font-medium">
              {locale === 'EN' ? 'EN' : 'العربية'}
            </span>
            <motion.div
              className="w-0.5 h-4 bg-blue-300 opacity-50"
              initial={false}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
          
          {/* Tooltip */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            initial={{ opacity: 0, y: -5 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            {locale === 'EN' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
          </motion.div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          {t('auth.resetPasswordTitle')}
        </h2>
        <p className="mt-2 text-gray-300">
          {t('auth.resetPasswordSubtitle')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Reset Password Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
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
      </motion.form>
    </motion.div>
  );
}
