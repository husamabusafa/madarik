import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Download,
  Filter,
  RefreshCw,
  MapPin,
  Users,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatCard from '../components/common/StatCard';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [viewType, setViewType] = useState('overview');

  const stats = [
    { title: 'Total Views', value: '24.5K', icon: Eye, change: { value: 12.5, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Leads Generated', value: '387', icon: MessageSquare, change: { value: 8.2, type: 'increase' as const }, color: 'green' as const },
    { title: 'Conversion Rate', value: '18.9%', icon: Target, change: { value: 2.4, type: 'increase' as const }, color: 'purple' as const },
    { title: 'Avg. Response Time', value: '2.4h', icon: Clock, change: { value: 15.3, type: 'decrease' as const }, color: 'orange' as const },
  ];

  const topProperties = [
    {
      id: 1,
      title: 'Luxury Villa in Jumeirah',
      views: 1234,
      leads: 45,
      conversionRate: 3.6,
      revenue: 125000,
      trend: 'up'
    },
    {
      id: 2,
      title: 'Modern Apartment in Marina',
      views: 987,
      leads: 32,
      conversionRate: 3.2,
      revenue: 87500,
      trend: 'up'
    },
    {
      id: 3,
      title: 'Office Space Downtown',
      views: 756,
      leads: 28,
      conversionRate: 3.7,
      revenue: 156000,
      trend: 'down'
    },
    {
      id: 4,
      title: 'Family House in Mirdif',
      views: 654,
      leads: 19,
      conversionRate: 2.9,
      revenue: 67800,
      trend: 'up'
    }
  ];

  const locationData = [
    { location: 'Dubai Marina', properties: 45, views: 8234, leads: 156, avgPrice: 1250000 },
    { location: 'Jumeirah', properties: 32, views: 6789, leads: 134, avgPrice: 2150000 },
    { location: 'Downtown Dubai', properties: 28, views: 5678, leads: 98, avgPrice: 1875000 },
    { location: 'Business Bay', properties: 23, views: 4567, leads: 87, avgPrice: 1450000 },
    { location: 'Mirdif', properties: 19, views: 3456, leads: 76, avgPrice: 950000 }
  ];

  // Note: chart data is omitted until chart integration is added

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const ChartPlaceholder = ({ title, height = 'h-64' }: { title: string; height?: string }) => (
    <div className={`${height} bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <p className="text-slate-300 font-medium">{title}</p>
        <p className="text-sm text-slate-500 mt-1">Chart integration pending</p>
      </div>
    </div>
  );

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
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="mt-2 text-slate-400">
            Track performance, analyze trends, and get insights about your real estate platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
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

      {/* View Tabs */}
      <motion.div
        className="flex space-x-1 bg-slate-800/60 p-1 rounded-lg w-fit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { id: 'overview', name: 'Overview' },
          { id: 'properties', name: 'Properties' },
          { id: 'locations', name: 'Locations' },
          { id: 'users', name: 'User Behavior' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewType(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewType === tab.id
                ? 'bg-slate-900 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Views & Leads Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100">Views & Leads Trend</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <ChartPlaceholder title="Monthly Views & Leads Chart" />
          </Card>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100">Conversion Funnel</h3>
            </div>
            <ChartPlaceholder title="Conversion Funnel Visualization" />
          </Card>
        </motion.div>
      </div>

      {/* Top Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Top Performing Properties</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-800">
                  <th className="pb-3 text-sm font-medium text-slate-400">Property</th>
                  <th className="pb-3 text-sm font-medium text-slate-400">Views</th>
                  <th className="pb-3 text-sm font-medium text-slate-400">Leads</th>
                  <th className="pb-3 text-sm font-medium text-slate-400">Conv. Rate</th>
                  <th className="pb-3 text-sm font-medium text-slate-400">Revenue</th>
                  <th className="pb-3 text-sm font-medium text-slate-400">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topProperties.map((property, index) => (
                  <motion.tr
                    key={property.id}
                    className="hover:bg-slate-800/60"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="py-4">
                      <div className="font-medium text-slate-100">{property.title}</div>
                    </td>
                    <td className="py-4 text-slate-300">{property.views.toLocaleString()}</td>
                    <td className="py-4 text-slate-300">{property.leads}</td>
                    <td className="py-4 text-slate-300">{property.conversionRate}%</td>
                    <td className="py-4 text-slate-300">{formatCurrency(property.revenue)}</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        {property.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Location Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Performance by Location</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {locationData.map((location, index) => (
              <motion.div
                key={location.location}
                className="bg-slate-800/60 rounded-lg p-4 border border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-100">{location.location}</h4>
                  <MapPin className="h-4 w-4 text-slate-500" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Properties:</span>
                    <span className="font-medium text-slate-100">{location.properties}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Views:</span>
                    <span className="font-medium text-slate-100">{location.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Leads:</span>
                    <span className="font-medium text-slate-100">{location.leads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Price:</span>
                    <span className="font-medium text-slate-100">{formatCurrency(location.avgPrice)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Real-time Activity */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Live Activity</h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-slate-400">Live</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { action: 'New lead', property: 'Villa in Jumeirah', time: '2 min ago' },
              { action: 'Property viewed', property: 'Apartment in Marina', time: '5 min ago' },
              { action: 'Lead assigned', property: 'Office Downtown', time: '8 min ago' },
              { action: 'New inquiry', property: 'House in Mirdif', time: '12 min ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-slate-100">{activity.action}</div>
                  <div className="text-slate-400">{activity.property}</div>
                </div>
                <div className="text-slate-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-slate-300">Views Today</span>
              </div>
              <span className="font-semibold text-slate-100">1,247</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-slate-300">Leads Today</span>
              </div>
              <span className="font-semibold text-slate-100">23</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-slate-300">Active Users</span>
              </div>
              <span className="font-semibold text-slate-100">89</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-slate-300">Avg Session</span>
              </div>
              <span className="font-semibold text-slate-100">4m 32s</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Score</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">8.9</div>
            <div className="text-slate-400 mb-4">Overall Score</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">SEO</span>
                <span className="font-medium text-slate-100">9.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User Experience</span>
                <span className="font-medium text-slate-100">8.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Performance</span>
                <span className="font-medium text-slate-100">8.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conversion</span>
                <span className="font-medium text-slate-100">9.1</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
