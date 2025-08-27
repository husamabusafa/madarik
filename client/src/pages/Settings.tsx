import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  Building, 
  Bell,
  Users,
  TrendingUp,
  Eye,
  Camera,
  Trash2,
  Plus
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [companyData, setCompanyData] = useState({
    siteNameEn: 'Madarik Real Estate',
    siteNameAr: 'مدارك العقارية',
    logoUrl: '',
    publicEmail: 'info@madarik.com',
    publicPhone: '+971 4 123 4567',
    website: 'https://madarik.com',
    country: 'United Arab Emirates',
    city: 'Dubai',
    description: 'Premier real estate company in Dubai'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    leadNotificationEmails: ['admin@madarik.com', 'leads@madarik.com'],
    emailOnNewLead: true,
    emailOnListingPublished: true,
    emailOnUserInvited: true
  });

  const [localizationSettings, setLocalizationSettings] = useState({
    defaultLanguage: 'en',
    enabledLanguages: ['en', 'ar'],
    dateFormat: 'DD/MM/YYYY',
    currency: 'AED',
    timezone: 'Asia/Dubai'
  });

  const tabs = [
    { id: 'company', name: 'Company Profile', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'localization', name: 'Language & Region', icon: Globe },
  ];

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings...`);
    // Implementation for saving settings
  };

  const renderCompanySettings = () => (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Company Logo</h3>
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
            {companyData.logoUrl ? (
              <img src={companyData.logoUrl} alt="Company Logo" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
            {companyData.logoUrl && (
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB. Recommended: 200x200px</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Site Name (English)"
          value={companyData.siteNameEn}
          onChange={(e) => setCompanyData({ ...companyData, siteNameEn: e.target.value })}
        />
        <Input
          label="Site Name (Arabic)"
          value={companyData.siteNameAr}
          onChange={(e) => setCompanyData({ ...companyData, siteNameAr: e.target.value })}
          className="text-right"
        />
        <Input
          label="Public Email"
          type="email"
          value={companyData.publicEmail}
          onChange={(e) => setCompanyData({ ...companyData, publicEmail: e.target.value })}
        />
        <Input
          label="Public Phone"
          value={companyData.publicPhone}
          onChange={(e) => setCompanyData({ ...companyData, publicPhone: e.target.value })}
        />
        <Input
          label="Website URL"
          value={companyData.website}
          onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
        />
        <Input
          label="Country"
          value={companyData.country}
          onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
        />
        <Input
          label="City"
          value={companyData.city}
          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Company Description
        </label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-white/15 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder:text-gray-400"
          value={companyData.description}
          onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
          placeholder="Brief description of your company..."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave('company')}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-white/15 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-200">New Lead Notifications</h4>
              <p className="text-xs text-gray-400">Get notified when someone submits a lead form</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailOnNewLead}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOnNewLead: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-white/15 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-200">Listing Published</h4>
              <p className="text-xs text-gray-400">Get notified when a listing is published</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailOnListingPublished}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOnListingPublished: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-white/15 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-200">User Invitations</h4>
              <p className="text-xs text-gray-400">Get notified when new users are invited</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailOnUserInvited}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOnUserInvited: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Notification Recipients</h3>
        <p className="text-sm text-gray-400 mb-4">Email addresses that will receive notifications</p>
        <div className="space-y-3">
          {notificationSettings.leadNotificationEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                value={email}
                onChange={(e) => {
                  const newEmails = [...notificationSettings.leadNotificationEmails];
                  newEmails[index] = e.target.value;
                  setNotificationSettings({ ...notificationSettings, leadNotificationEmails: newEmails });
                }}
                className="flex-1"
                placeholder="Enter email address"
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const newEmails = notificationSettings.leadNotificationEmails.filter((_, i) => i !== index);
                  setNotificationSettings({ ...notificationSettings, leadNotificationEmails: newEmails });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNotificationSettings({
                ...notificationSettings,
                leadNotificationEmails: [...notificationSettings.leadNotificationEmails, '']
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Email
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave('notifications')}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Language Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Default Language
            </label>
            <select
              value={localizationSettings.defaultLanguage}
              onChange={(e) => setLocalizationSettings({ ...localizationSettings, defaultLanguage: e.target.value })}
              className="w-full px-3 py-2 border border-white/15 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            >
              <option value="en" className="bg-gray-800">English</option>
              <option value="ar" className="bg-gray-800">العربية (Arabic)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Enabled Languages
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lang-en"
                  checked={localizationSettings.enabledLanguages.includes('en')}
                  onChange={(e) => {
                    const langs = e.target.checked 
                      ? [...localizationSettings.enabledLanguages, 'en']
                      : localizationSettings.enabledLanguages.filter(l => l !== 'en');
                    setLocalizationSettings({ ...localizationSettings, enabledLanguages: langs });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20 rounded"
                />
                <label htmlFor="lang-en" className="text-sm text-gray-200">English</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lang-ar"
                  checked={localizationSettings.enabledLanguages.includes('ar')}
                  onChange={(e) => {
                    const langs = e.target.checked 
                      ? [...localizationSettings.enabledLanguages, 'ar']
                      : localizationSettings.enabledLanguages.filter(l => l !== 'ar');
                    setLocalizationSettings({ ...localizationSettings, enabledLanguages: langs });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20 rounded"
                />
                <label htmlFor="lang-ar" className="text-sm text-gray-200">العربية (Arabic)</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Date Format
            </label>
            <select
              value={localizationSettings.dateFormat}
              onChange={(e) => setLocalizationSettings({ ...localizationSettings, dateFormat: e.target.value })}
              className="w-full px-3 py-2 border border-white/15 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            >
              <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Currency
            </label>
            <select
              value={localizationSettings.currency}
              onChange={(e) => setLocalizationSettings({ ...localizationSettings, currency: e.target.value })}
              className="w-full px-3 py-2 border border-white/15 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            >
              <option value="AED" className="bg-gray-800">AED (د.إ)</option>
              <option value="USD" className="bg-gray-800">USD ($)</option>
              <option value="EUR" className="bg-gray-800">EUR (€)</option>
              <option value="SAR" className="bg-gray-800">SAR (ر.س)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Timezone
            </label>
            <select
              value={localizationSettings.timezone}
              onChange={(e) => setLocalizationSettings({ ...localizationSettings, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-white/15 bg-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            >
              <option value="Asia/Dubai" className="bg-gray-800">Dubai (UTC+4)</option>
              <option value="Asia/Riyadh" className="bg-gray-800">Riyadh (UTC+3)</option>
              <option value="Europe/London" className="bg-gray-800">London (UTC+0)</option>
              <option value="America/New_York" className="bg-gray-800">New York (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave('localization')}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'localization':
        return renderLocalizationSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
          <p className="mt-2 text-gray-300">
            Configure your platform settings, integrations, and preferences.
          </p>
        </div>
      </motion.div>

      {/* Settings Layout */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-300 hover:bg-white/10 hover:text-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-4 mt-6">
            <div className="flex items-center mb-3">
              <Building className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-100">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Update Logo
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Test Notifications
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </motion.div>

      {/* Business Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Listings</p>
              <p className="text-lg font-bold text-gray-100">247</p>
              <p className="text-sm text-green-400 mt-1">+12 this month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Leads</p>
              <p className="text-lg font-bold text-gray-100">1,234</p>
              <p className="text-sm text-blue-400 mt-1">+89 this week</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Page Views</p>
              <p className="text-lg font-bold text-gray-100">45.2K</p>
              <p className="text-sm text-purple-400 mt-1">+2.1K today</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
