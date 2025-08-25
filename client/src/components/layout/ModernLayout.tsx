import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  Globe,
  User,
  Bell,
  Images,
  Tags,
  BarChart3,
  FileText
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const getNavigation = (t: (key: any) => string): NavItem[] => [
  { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
  { name: t('nav.properties'), href: '/properties', icon: Home },
  { name: t('nav.leads'), href: '/leads', icon: MessageSquare },
  { name: t('nav.media'), href: '/media', icon: Images },
  { name: t('nav.amenities'), href: '/amenities', icon: Tags },
  { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
  { name: t('nav.content'), href: '/content', icon: FileText },
  { name: t('nav.users'), href: '/users', icon: Users, roles: ['ADMIN'] },
  { name: t('nav.settings'), href: '/settings', icon: Settings },
];

export default function ModernLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, locale, setLocale, isRTL } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navigation = getNavigation(t);
  const filteredNavigation = navigation.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const Sidebar = ({ mobile = false }) => (
    <div className={clsx(
      'flex h-full flex-col',
      mobile ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-900 to-slate-800'
    )}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <img src="/logo.svg" alt="Madarik" className="h-8 w-8" />
        <span className={clsx(
          'text-xl font-bold',
          isRTL ? 'mr-3' : 'ml-3',
          mobile ? 'text-gray-900' : 'text-white'
        )}>
          {t('app.name')}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={mobile ? () => setSidebarOpen(false) : undefined}
                  className={clsx(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? mobile
                        ? 'bg-blue-600/20 text-white'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : mobile
                      ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'h-5 w-5 transition-colors',
                      isRTL ? 'ml-3' : 'mr-3',
                      isActive
                        ? mobile ? 'text-white' : 'text-white'
                        : mobile ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-white'
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <motion.div
                      className={clsx(
                        'h-2 w-2 rounded-full',
                        isRTL ? 'mr-auto' : 'ml-auto',
                        mobile ? 'bg-blue-600' : 'bg-white'
                      )}
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User section */}
        <div className={clsx('mt-auto pt-4', mobile ? 'border-t border-slate-800' : 'border-t border-slate-700')}>
          <div className={clsx('mb-4 px-3 py-2 rounded-lg', mobile ? 'bg-white/5' : 'bg-white/10')}>
            <div className="flex items-center">
              <div className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full',
                mobile ? 'bg-blue-500' : 'bg-blue-500'
              )}>
                <User className={clsx('h-4 w-4', mobile ? 'text-white' : 'text-white')} />
              </div>
              <div className={clsx('flex-1 min-w-0', isRTL ? 'mr-3' : 'ml-3')}>
                <p className={clsx(
                  'truncate text-xs font-medium',
                  mobile ? 'text-white' : 'text-white'
                )}>
                  {user?.email}
                </p>
                <p className={clsx(
                  'truncate text-xs',
                  mobile ? 'text-slate-300' : 'text-slate-300'
                )}>
                  {user?.role === 'ADMIN' ? t('users.admin') : t('users.manager')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setLocale(locale === 'EN' ? 'AR' : 'EN')}
              className={clsx(
                'group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                mobile
                  ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Globe className={clsx(
                'h-5 w-5',
                isRTL ? 'ml-3' : 'mr-3',
                mobile ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-white'
              )} />
              {locale === 'EN' ? t('common.arabic') : t('common.english')}
            </button>

            <button
              onClick={handleLogout}
              className={clsx(
                'group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                mobile
                  ? 'text-red-300 hover:bg-red-500/10 hover:text-red-200'
                  : 'text-red-300 hover:bg-red-500/10 hover:text-red-200'
              )}
            >
              <LogOut className={clsx(
                'h-5 w-5',
                isRTL ? 'ml-3' : 'mr-3',
                mobile ? 'text-red-400 group-hover:text-red-300' : 'text-red-400 group-hover:text-red-300'
              )} />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className={clsx(
                'fixed inset-y-0 z-50 flex w-64 flex-col lg:hidden',
                isRTL ? 'right-0' : 'left-0'
              )}
              initial={{ x: isRTL ? 256 : -256 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 256 : -256 }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-slate-100">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-200"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
