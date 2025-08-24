import React from 'react';
import { Outlet } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';

const AuthLayout: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Brand panel */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium ring-1 ring-inset ring-blue-500/30">
                Madarik Platform
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {t('app.title')}
            </h1>
            <p className="mt-4 text-gray-300">
              Real Estate Management Platform
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 text-gray-300">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">AR/EN</div>
                <div className="text-sm">Bilingual UI</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">Map</div>
                <div className="text-sm">Search & Filters</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">Leads</div>
                <div className="text-sm">Capture & Assign</div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
