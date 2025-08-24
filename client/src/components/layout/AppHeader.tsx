import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { User, LogOut, Building } from 'lucide-react';

export default function AppHeader() {
  const { user, logout, isAuthenticated, isCompanyOwner, isCompanyMember } = useAuth();
  const { t } = useI18n();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">
                {t('app.title').split(' - ')[0]}
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 rtl:space-x-reverse">
            {isAuthenticated ? (
              <>
                {/* Dashboard link for company members/owners */}
                {(isCompanyOwner || isCompanyMember) && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {/* User menu */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-md"
                    title={t('auth.logout')}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('auth.signUp')}
                </Link>
              </>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
