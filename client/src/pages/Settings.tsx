import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  MapPin, 
  Building, 
  Link as LinkIcon,
  Key,
  Bell,
  Shield,
  Database,
  HelpCircle,
  Camera,
  Trash2
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

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.madarik.com',
    smtpPort: '587',
    smtpUsername: 'noreply@madarik.com',
    smtpPassword: '',
    fromName: 'Madarik Real Estate',
    fromEmail: 'noreply@madarik.com',
    notificationEmails: ['admin@madarik.com', 'leads@madarik.com']
  });

  const [mapSettings, setMapSettings] = useState({
    provider: 'google',
    googleMapsApiKey: '',
    mapboxApiKey: '',
    defaultZoom: 12,
    defaultLat: 25.2048,
    defaultLng: 55.2708
  });

  const tabs = [
    { id: 'company', name: 'Company Profile', icon: Building },
    { id: 'email', name: 'Email Configuration', icon: Mail },
    { id: 'maps', name: 'Maps & Location', icon: MapPin },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
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

  const renderEmailSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SMTP Host"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
          />
          <Input
            label="SMTP Port"
            type="number"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
          />
          <Input
            label="SMTP Username"
            value={emailSettings.smtpUsername}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
          />
          <Input
            label="SMTP Password"
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Email Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="From Name"
            value={emailSettings.fromName}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
          />
          <Input
            label="From Email"
            type="email"
            value={emailSettings.fromEmail}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Notification Recipients</h3>
        <div className="space-y-3">
          {emailSettings.notificationEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                value={email}
                onChange={(e) => {
                  const newEmails = [...emailSettings.notificationEmails];
                  newEmails[index] = e.target.value;
                  setEmailSettings({ ...emailSettings, notificationEmails: newEmails });
                }}
                className="flex-1"
              />
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEmailSettings({
                ...emailSettings,
                notificationEmails: [...emailSettings.notificationEmails, '']
              });
            }}
          >
            Add Email
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave('email')}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderMapSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Map Provider</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="google-maps"
              name="mapProvider"
              value="google"
              checked={mapSettings.provider === 'google'}
              onChange={(e) => setMapSettings({ ...mapSettings, provider: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20"
            />
            <label htmlFor="google-maps" className="text-sm font-medium text-gray-200">
              Google Maps
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="mapbox"
              name="mapProvider"
              value="mapbox"
              checked={mapSettings.provider === 'mapbox'}
              onChange={(e) => setMapSettings({ ...mapSettings, provider: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-transparent border-white/20"
            />
            <label htmlFor="mapbox" className="text-sm font-medium text-gray-200">
              Mapbox
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">API Configuration</h3>
        <div className="space-y-6">
          {mapSettings.provider === 'google' && (
            <Input
              label="Google Maps API Key"
              type="password"
              value={mapSettings.googleMapsApiKey}
              onChange={(e) => setMapSettings({ ...mapSettings, googleMapsApiKey: e.target.value })}
              helpText="Required for maps, geocoding, and location services"
            />
          )}
          {mapSettings.provider === 'mapbox' && (
            <Input
              label="Mapbox API Key"
              type="password"
              value={mapSettings.mapboxApiKey}
              onChange={(e) => setMapSettings({ ...mapSettings, mapboxApiKey: e.target.value })}
              helpText="Required for maps and geocoding services"
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4">Default Map Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Default Zoom Level"
            type="number"
            min="1"
            max="20"
            value={mapSettings.defaultZoom.toString()}
            onChange={(e) => setMapSettings({ ...mapSettings, defaultZoom: parseInt(e.target.value) })}
          />
          <Input
            label="Default Latitude"
            type="number"
            step="0.000001"
            value={mapSettings.defaultLat.toString()}
            onChange={(e) => setMapSettings({ ...mapSettings, defaultLat: parseFloat(e.target.value) })}
          />
          <Input
            label="Default Longitude"
            type="number"
            step="0.000001"
            value={mapSettings.defaultLng.toString()}
            onChange={(e) => setMapSettings({ ...mapSettings, defaultLng: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave('maps')}>
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
      case 'email':
        return renderEmailSettings();
      case 'maps':
        return renderMapSettings();
      case 'notifications':
        return (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Notification settings coming soon</p>
          </div>
        );
      case 'security':
        return (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Security settings coming soon</p>
          </div>
        );
      case 'integrations':
        return (
          <div className="text-center py-12">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Integration settings coming soon</p>
          </div>
        );
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

          {/* Help Card */}
          <Card className="p-4 mt-6">
            <div className="flex items-center mb-3">
              <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-100">Need Help?</h3>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Check our documentation for detailed configuration guides.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Docs
            </Button>
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

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Database className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Last Backup</p>
              <p className="text-lg font-bold text-gray-100">2 hours ago</p>
              <p className="text-sm text-green-400 mt-1">All systems operational</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">API Status</p>
              <p className="text-lg font-bold text-gray-100">99.9%</p>
              <p className="text-sm text-blue-400 mt-1">All integrations active</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Key className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Security Score</p>
              <p className="text-lg font-bold text-gray-100">A+</p>
              <p className="text-sm text-purple-400 mt-1">Excellent security</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
