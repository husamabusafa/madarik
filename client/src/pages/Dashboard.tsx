import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Eye,
  DollarSign,
  Plus,
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for the dashboard
  const stats = [
    { title: 'Total Properties', value: '247', icon: Home, change: { value: 12, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Active Leads', value: '89', icon: MessageSquare, change: { value: 8, type: 'increase' as const }, color: 'green' as const },
    { title: 'Monthly Views', value: '12.4K', icon: Eye, change: { value: 15, type: 'increase' as const }, color: 'purple' as const },
    { title: 'Total Revenue', value: '$1.2M', icon: DollarSign, change: { value: 23, type: 'increase' as const }, color: 'orange' as const },
  ];

  const recentLeads = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', property: 'Luxury Villa in Jumeirah', time: '2 hours ago', status: 'New' },
    { id: 2, name: 'Sarah Al-Mansoori', email: 'sarah@example.com', property: 'Modern Apartment in Marina', time: '4 hours ago', status: 'Contacted' },
    { id: 3, name: 'Mohammed Ali', email: 'mohammed@example.com', property: 'Office Space Downtown', time: '6 hours ago', status: 'Scheduled' },
    { id: 4, name: 'Fatima Khan', email: 'fatima@example.com', property: 'Family House in Mirdif', time: '1 day ago', status: 'New' },
  ];

  const recentProperties = [
    { id: 1, title: 'Luxury Villa in Jumeirah', price: '$2.5M', type: 'Villa', status: 'Published', views: 234 },
    { id: 2, title: 'Modern Apartment in Marina', price: '$850K', type: 'Apartment', status: 'Published', views: 189 },
    { id: 3, title: 'Office Space Downtown', price: '$1.2M', type: 'Commercial', status: 'Draft', views: 67 },
    { id: 4, title: 'Family House in Mirdif', price: '$950K', type: 'House', status: 'Ready to Publish', views: 145 },
  ];

  const leadColumns = [
    { key: 'name', label: 'Contact', render: (value: string, row: any) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.email}</div>
      </div>
    )},
    { key: 'property', label: 'Property', render: (value: string) => (
      <div className="text-sm text-gray-900 max-w-xs truncate">{value}</div>
    )},
    { key: 'status', label: 'Status', render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === 'New' ? 'bg-blue-100 text-blue-700' :
        value === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>
        {value}
      </span>
    )},
    { key: 'time', label: 'Time', align: 'right' as const },
  ];

  const propertyColumns = [
    { key: 'title', label: 'Property', render: (value: string) => (
      <div className="font-medium text-gray-900 max-w-xs truncate">{value}</div>
    )},
    { key: 'price', label: 'Price', render: (value: string) => (
      <div className="font-medium text-gray-900">{value}</div>
    )},
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status', render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === 'Published' ? 'bg-green-100 text-green-700' :
        value === 'Draft' ? 'bg-gray-100 text-gray-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {value}
      </span>
    )},
    { key: 'views', label: 'Views', align: 'right' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your real estate platform today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/properties/new">
              <motion.div
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Add Property</p>
                    <p className="text-xs text-gray-500">Create a new listing</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </motion.div>
            </Link>

            <Link to="/leads">
              <motion.div
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Manage Leads</p>
                    <p className="text-xs text-gray-500">Review inquiries</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </motion.div>
            </Link>

            <Link to="/analytics">
              <motion.div
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">View Analytics</p>
                    <p className="text-xs text-gray-500">Performance insights</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </motion.div>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
              <Link to="/leads">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Table
              data={recentLeads}
              columns={leadColumns}
              className="shadow-none border-0"
            />
          </Card>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
              <Link to="/properties">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Table
              data={recentProperties}
              columns={propertyColumns}
              className="shadow-none border-0"
            />
          </Card>
        </motion.div>
      </div>

      {/* Performance Chart (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">7 days</Button>
              <Button variant="ghost" size="sm">30 days</Button>
              <Button variant="outline" size="sm">90 days</Button>
            </div>
          </div>
          
          {/* Chart placeholder */}
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Performance chart will be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">Integration with analytics service pending</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
