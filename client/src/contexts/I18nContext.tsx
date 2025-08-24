import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Locale = 'EN' | 'AR';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

// Basic translations - in a real app, these would come from translation files
const translations = {
  EN: {
    'app.title': 'Madarik Real Estate - Property Management Platform',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    // Auth common
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password?',
    // Auth screen text
    'auth.loginTitle': 'Welcome back',
    'auth.loginSubtitle': 'Sign in to your staff account',
    'auth.signInButton': 'Sign In',
    'auth.forgotPasswordTitle': 'Forgot your password?',
    'auth.forgotPasswordSubtitle': 'Enter your email to receive a reset link',
    'auth.sendResetLink': 'Send reset link',
    'auth.backToLogin': 'Back to Login',
    'auth.resetPasswordTitle': 'Reset your password',
    'auth.resetPasswordSubtitle': 'Enter a new password to access your account',
    'auth.confirmPassword': 'Confirm password',
    'auth.updatePassword': 'Update password',
    'auth.verifyEmailTitle': 'Verify your email',
    'auth.verifyEmailSubtitle': 'We have sent a verification link to your email',
    'auth.resendVerification': 'Resend verification email',
    'auth.noAccount': "Don’t have an account?",
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.english': 'English',
    'common.arabic': 'Arabic',
    // Validation
    'validation.email': 'Please enter a valid email address',
    'validation.required': 'This field is required',
    'validation.password': 'Password must be at least 8 characters',
    'validation.passwordMismatch': 'Passwords do not match',
  },
  AR: {
    'app.title': 'مداريك العقارية - منصة إدارة العقارات',
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    // Auth common
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.forgot_password': 'نسيت كلمة المرور؟',
    'auth.register': 'إنشاء حساب',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    // Auth screen text
    'auth.loginTitle': 'مرحباً بعودتك',
    'auth.loginSubtitle': 'سجّل الدخول إلى حساب الموظفين',
    'auth.signInButton': 'تسجيل الدخول',
    'auth.forgotPasswordTitle': 'هل نسيت كلمة المرور؟',
    'auth.forgotPasswordSubtitle': 'أدخل بريدك الإلكتروني لإرسال رابط الاستعادة',
    'auth.sendResetLink': 'إرسال رابط الاستعادة',
    'auth.backToLogin': 'العودة لتسجيل الدخول',
    'auth.resetPasswordTitle': 'إعادة تعيين كلمة المرور',
    'auth.resetPasswordSubtitle': 'أدخل كلمة مرور جديدة للوصول إلى حسابك',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.updatePassword': 'تحديث كلمة المرور',
    'auth.verifyEmailTitle': 'تأكيد البريد الإلكتروني',
    'auth.verifyEmailSubtitle': 'قمنا بإرسال رابط تأكيد إلى بريدك الإلكتروني',
    'auth.resendVerification': 'إعادة إرسال رسالة التأكيد',
    'auth.noAccount': 'ليس لديك حساب؟',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.english': 'الإنجليزية',
    'common.arabic': 'العربية',
    // Validation
    'validation.email': 'يرجى إدخال بريد إلكتروني صالح',
    'validation.required': 'هذا الحقل مطلوب',
    'validation.password': 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    'validation.passwordMismatch': 'كلمتا المرور غير متطابقتين',
  },
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('EN');

  useEffect(() => {
    // Check for stored locale preference
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && (storedLocale === 'EN' || storedLocale === 'AR')) {
      setLocaleState(storedLocale);
    }
  }, []);

  // Ensure html dir/lang reflect current locale on mount and when locale changes
  useEffect(() => {
    document.documentElement.dir = locale === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale === 'AR' ? 'ar' : 'en';
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update document direction and language
    document.documentElement.dir = newLocale === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale === 'AR' ? 'ar' : 'en';
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || key;
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isRTL: locale === 'AR',
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
