import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { enTranslations, type TranslationKey } from '../translations/en';
import { arTranslations } from '../translations/ar';

type Locale = 'EN' | 'AR';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

const translations = {
  EN: enTranslations,
  AR: arTranslations,
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

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let translation = translations[locale][key] || key;
    
    // Replace parameters in the translation
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return translation;
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
