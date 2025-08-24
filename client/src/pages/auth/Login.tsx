import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Globe } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(1, 'validation.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, isRTL, locale, setLocale } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

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
          {t('auth.loginTitle')}
        </h2>
        <p className="mt-2 text-gray-300">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
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

        {/* Password Field */}
        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label={t('auth.password')}
            placeholder="••••••••"
            error={errors.password ? t(errors.password.message || 'validation.required') : undefined}
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

        {/* Forgot Password Link */}
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-300 hover:text-blue-200"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          {t('auth.signInButton')}
        </Button>
      </motion.form>
      {/* Temporary admin credentials for testing */}
      <motion.div
        className="mt-4 text-xs rounded-md border border-white/10 bg-white/5 p-4 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="font-semibold text-gray-200 mb-2">Admin test credentials</div>
        <div className="grid grid-cols-1 gap-1">
          <div>
            <span className="text-gray-400">Email:</span> admin@madarik.com
          </div>
          <div>
            <span className="text-gray-400">Password:</span> Admin123!
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
