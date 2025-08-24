import React from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { useI18n } from '../contexts/I18nContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // const { t } = useI18n(); // Uncomment when translations are needed

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Welcome, {user.email}!
            </h2>
            <p className="text-blue-700">
              Role: {user.role} | Locale: {user.preferredLocale}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Properties
          </h3>
          <p className="text-gray-600">
            Manage your real estate listings
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Leads
          </h3>
          <p className="text-gray-600">
            Track and manage inquiries
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Users
          </h3>
          <p className="text-gray-600">
            Manage team members and permissions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
