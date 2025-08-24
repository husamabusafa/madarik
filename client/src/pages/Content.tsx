import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  FileText,
  Globe,
  Calendar,
  User,
  ExternalLink,
  Copy
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';

const Content: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPage, setNewPage] = useState({
    titleEn: '',
    titleAr: '',
    slugEn: '',
    slugAr: '',
    contentEn: '',
    contentAr: '',
    metaDescriptionEn: '',
    metaDescriptionAr: '',
    published: false,
    showInMenu: true
  });

  // Mock data for content pages
  const contentPages = [
    {
      id: 1,
      titleEn: 'About Us',
      titleAr: 'من نحن',
      slugEn: 'about-us',
      slugAr: 'من-نحن',
      published: true,
      showInMenu: true,
      views: 1234,
      lastModified: '2024-01-20T10:30:00Z',
      modifiedBy: 'John Smith'
    },
    {
      id: 2,
      titleEn: 'Contact Us',
      titleAr: 'اتصل بنا',
      slugEn: 'contact-us',
      slugAr: 'اتصل-بنا',
      published: true,
      showInMenu: true,
      views: 987,
      lastModified: '2024-01-19T14:15:00Z',
      modifiedBy: 'Jane Doe'
    },
    {
      id: 3,
      titleEn: 'Privacy Policy',
      titleAr: 'سياسة الخصوصية',
      slugEn: 'privacy-policy',
      slugAr: 'سياسة-الخصوصية',
      published: true,
      showInMenu: false,
      views: 456,
      lastModified: '2024-01-18T09:45:00Z',
      modifiedBy: 'John Smith'
    },
    {
      id: 4,
      titleEn: 'Terms of Service',
      titleAr: 'شروط الخدمة',
      slugEn: 'terms-of-service',
      slugAr: 'شروط-الخدمة',
      published: false,
      showInMenu: false,
      views: 234,
      lastModified: '2024-01-17T16:20:00Z',
      modifiedBy: 'Jane Doe'
    },
    {
      id: 5,
      titleEn: 'Investment Guide',
      titleAr: 'دليل الاستثمار',
      slugEn: 'investment-guide',
      slugAr: 'دليل-الاستثمار',
      published: true,
      showInMenu: true,
      views: 2345,
      lastModified: '2024-01-22T11:10:00Z',
      modifiedBy: 'John Smith'
    }
  ];

  const stats = [
    { title: 'Total Pages', value: '12', icon: FileText, change: { value: 2, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Published', value: '9', icon: Eye, change: { value: 1, type: 'increase' as const }, color: 'green' as const },
    { title: 'Total Views', value: '15.2K', icon: Globe, change: { value: 8.5, type: 'increase' as const }, color: 'purple' as const },
    { title: 'This Month', value: '3.4K', icon: Calendar, change: { value: 12, type: 'increase' as const }, color: 'orange' as const },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSavePage = () => {
    console.log('Saving page:', newPage);
    setShowAddModal(false);
    setNewPage({
      titleEn: '',
      titleAr: '',
      slugEn: '',
      slugAr: '',
      contentEn: '',
      contentAr: '',
      metaDescriptionEn: '',
      metaDescriptionAr: '',
      published: false,
      showInMenu: true
    });
  };

  const togglePageStatus = (id: number) => {
    console.log('Toggling page status:', id);
  };

  const columns = [
    {
      key: 'titleEn',
      label: 'Page',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            /{row.slugEn}
          </div>
          <div className="text-sm text-gray-600 mt-1" dir="rtl">{row.titleAr}</div>
        </div>
      )
    },
    {
      key: 'published',
      label: 'Status',
      render: (value: boolean, row: any) => (
        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {value ? 'Published' : 'Draft'}
          </span>
          {row.showInMenu && (
            <div className="text-xs text-blue-600">In Menu</div>
          )}
        </div>
      )
    },
    {
      key: 'views',
      label: 'Views',
      render: (value: number) => (
        <span className="text-sm text-gray-900">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      render: (value: string, row: any) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(value)}</div>
          <div className="text-gray-500">by {row.modifiedBy}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="Preview">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePageStatus(row.id)}
            title={row.published ? 'Unpublish' : 'Publish'}
          >
            {row.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Create and manage static pages, legal documents, and other content for your website.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Pages</option>
                <option value="menu">In Menu</option>
                <option value="legal">Legal Pages</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Table
          data={contentPages}
          columns={columns}
        />
      </motion.div>

      {/* Quick Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'About Us Page', description: 'Company information and team details' },
              { name: 'Contact Page', description: 'Contact form and office information' },
              { name: 'FAQ Page', description: 'Frequently asked questions' },
              { name: 'Privacy Policy', description: 'Data protection and privacy terms' },
              { name: 'Terms of Service', description: 'Terms and conditions for users' },
              { name: 'Investment Guide', description: 'Real estate investment information' }
            ].map((template, index) => (
              <motion.div
                key={template.name}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Create New Page</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="English Title"
                    value={newPage.titleEn}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewPage({ 
                        ...newPage, 
                        titleEn: title,
                        slugEn: generateSlug(title)
                      });
                    }}
                    placeholder="e.g., About Us"
                  />
                  
                  <Input
                    label="Arabic Title"
                    value={newPage.titleAr}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewPage({ 
                        ...newPage, 
                        titleAr: title,
                        slugAr: generateSlug(title)
                      });
                    }}
                    placeholder="e.g., من نحن"
                    className="text-right"
                  />
                  
                  <Input
                    label="English Slug"
                    value={newPage.slugEn}
                    onChange={(e) => setNewPage({ ...newPage, slugEn: e.target.value })}
                    placeholder="about-us"
                  />
                  
                  <Input
                    label="Arabic Slug"
                    value={newPage.slugAr}
                    onChange={(e) => setNewPage({ ...newPage, slugAr: e.target.value })}
                    placeholder="من-نحن"
                    className="text-right"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Content</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Content
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newPage.contentEn}
                      onChange={(e) => setNewPage({ ...newPage, contentEn: e.target.value })}
                      placeholder="Enter page content in English..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Content
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      value={newPage.contentAr}
                      onChange={(e) => setNewPage({ ...newPage, contentAr: e.target.value })}
                      placeholder="أدخل محتوى الصفحة باللغة العربية..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">SEO Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="English Meta Description"
                    value={newPage.metaDescriptionEn}
                    onChange={(e) => setNewPage({ ...newPage, metaDescriptionEn: e.target.value })}
                    placeholder="Brief description for search engines"
                  />
                  
                  <Input
                    label="Arabic Meta Description"
                    value={newPage.metaDescriptionAr}
                    onChange={(e) => setNewPage({ ...newPage, metaDescriptionAr: e.target.value })}
                    placeholder="وصف مختصر لمحركات البحث"
                    className="text-right"
                  />
                </div>
              </div>

              {/* Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Page Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={newPage.published}
                      onChange={(e) => setNewPage({ ...newPage, published: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInMenu"
                      checked={newPage.showInMenu}
                      onChange={(e) => setNewPage({ ...newPage, showInMenu: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="showInMenu" className="ml-2 text-sm text-gray-700">
                      Show in navigation menu
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePage}>
                <Save className="h-4 w-4 mr-2" />
                Create Page
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Content;
