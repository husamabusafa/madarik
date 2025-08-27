import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Eye, EyeOff, Lock, Globe } from 'lucide-react';

// Accept Invite schema
const acceptInviteSchema = z.object({
  password: z.string().min(8, 'validation.password'),
  confirmPassword: z.string(),
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
  const { t, isRTL, locale, setLocale } = useI18n();

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
  });

  const onSubmit = async (data: AcceptInviteFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('Missing invite token');
      await acceptInvite(token, data.password);
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
        </div>
      </motion.div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          Accept Invitation
        </h2>
        <p className="mt-2 text-gray-300">
          Set your password to activate your account.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Register Form */}
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
            error={errors.password ? (errors.password.message ? t(errors.password.message as any) : 'Password must be at least 8 characters') : undefined}
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
            error={errors.confirmPassword ? (errors.confirmPassword.message ? t(errors.confirmPassword.message as any) : 'Passwords do not match') : undefined}
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
          Accept Invitation
        </Button>
      </motion.form>

    </motion.div>
  );
}
