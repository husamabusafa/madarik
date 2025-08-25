import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Star,
  Eye,
  UserCheck,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';

const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Mock data
  const leads = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+971 50 123 4567',
      property: {
        id: 1,
        title: 'Luxury Villa in Jumeirah',
        price: '$2.5M',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100'
      },
      message: 'I am very interested in this property. Could we schedule a viewing this weekend?',
      status: 'New',
      priority: 'High',
      source: 'Website',
      assignedTo: null,
      createdAt: '2024-01-23T10:30:00Z',
      lastContact: null,
      ipAddress: '192.168.1.1'
    },
    {
      id: 2,
      name: 'Sarah Al-Mansoori',
      email: 'sarah.almansoori@example.com',
      phone: '+971 55 987 6543',
      property: {
        id: 2,
        title: 'Modern Apartment in Marina',
        price: '$850K',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100'
      },
      message: 'Looking for a 2-bedroom apartment. Is this property still available?',
      status: 'Contacted',
      priority: 'Medium',
      source: 'Facebook',
      assignedTo: 'John Smith',
      createdAt: '2024-01-22T14:15:00Z',
      lastContact: '2024-01-22T16:30:00Z',
      ipAddress: '192.168.1.2'
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      email: 'mohammed.ali@example.com',
      phone: '+971 52 456 7890',
      property: {
        id: 3,
        title: 'Office Space Downtown',
        price: '$1.2M',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100'
      },
      message: 'Interested in commercial properties for investment. Please provide more details.',
      status: 'Scheduled',
      priority: 'High',
      source: 'Google Ads',
      assignedTo: 'Jane Doe',
      createdAt: '2024-01-21T09:45:00Z',
      lastContact: '2024-01-21T11:00:00Z',
      ipAddress: '192.168.1.3'
    },
    {
      id: 4,
      name: 'Fatima Khan',
      email: 'fatima.khan@example.com',
      phone: '+971 56 789 0123',
      property: {
        id: 4,
        title: 'Family House in Mirdif',
        price: '$950K',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100'
      },
      message: 'Looking for a family home with good schools nearby. Can you help?',
      status: 'Qualified',
      priority: 'Medium',
      source: 'Referral',
      assignedTo: 'John Smith',
      createdAt: '2024-01-20T16:20:00Z',
      lastContact: '2024-01-21T10:30:00Z',
      ipAddress: '192.168.1.4'
    },
    {
      id: 5,
      name: 'Omar Abdullah',
      email: 'omar.abdullah@example.com',
      phone: '+971 50 345 6789',
      property: {
        id: 1,
        title: 'Luxury Villa in Jumeirah',
        price: '$2.5M',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100'
      },
      message: 'Very interested in luxury properties. What financing options are available?',
      status: 'Closed Won',
      priority: 'High',
      source: 'Website',
      assignedTo: 'Jane Doe',
      createdAt: '2024-01-19T11:15:00Z',
      lastContact: '2024-01-22T14:45:00Z',
      ipAddress: '192.168.1.5'
    }
  ];

  const stats = [
    { title: 'Total Leads', value: '247', icon: MessageSquare, change: { value: 12, type: 'increase' as const }, color: 'blue' as const },
    { title: 'New Leads', value: '23', icon: Star, change: { value: 8, type: 'increase' as const }, color: 'green' as const },
    { title: 'Conversion Rate', value: '18.5%', icon: CheckCircle, change: { value: 2.3, type: 'increase' as const }, color: 'purple' as const },
    { title: 'Response Time', value: '2.4h', icon: Clock, change: { value: 15, type: 'decrease' as const }, color: 'orange' as const },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/15 text-blue-300';
      case 'Contacted': return 'bg-amber-500/15 text-amber-300';
      case 'Scheduled': return 'bg-purple-500/15 text-purple-300';
      case 'Qualified': return 'bg-indigo-500/15 text-indigo-300';
      case 'Closed Won': return 'bg-green-500/15 text-green-300';
      case 'Closed Lost': return 'bg-red-500/15 text-red-300';
      default: return 'bg-slate-500/15 text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-300 bg-red-500/15';
      case 'Medium': return 'text-amber-300 bg-amber-500/15';
      case 'Low': return 'text-green-300 bg-green-500/15';
      default: return 'text-slate-300 bg-slate-500/15';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Contact',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="h-5 w-5 text-slate-300" />
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-100">{value}</div>
            <div className="text-sm text-slate-400 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {row.email}
            </div>
            {row.phone && (
              <div className="text-sm text-slate-400 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {row.phone}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'property',
      label: 'Property',
      render: (value: any) => (
        <div className="flex items-center space-x-3">
          <img
            src={value.image}
            alt={value.title}
            className="h-10 w-10 object-cover rounded-lg"
          />
          <div>
            <div className="font-medium text-slate-100 max-w-xs truncate">{value.title}</div>
            <div className="text-sm text-slate-400">{value.price}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, row: any) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {value}
          </span>
          <div className={`inline-flex px-1.5 py-0.5 text-xs rounded ${getPriorityColor(row.priority)}`}>
            {row.priority} Priority
          </div>
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value: string | null) => (
        <div className="text-sm">
          {value ? (
            <div className="flex items-center text-slate-100">
              <UserCheck className="h-4 w-4 mr-1 text-green-400" />
              {value}
            </div>
          ) : (
            <span className="text-slate-500">Unassigned</span>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string, row: any) => (
        <div className="text-sm">
          <div className="text-slate-100">{formatDate(value)}</div>
          <div className="text-slate-400 text-xs">
            {row.lastContact ? `Last: ${formatDate(row.lastContact)}` : 'No contact yet'}
          </div>
        </div>
      )
    },
    {
      key: 'source',
      label: 'Source',
      render: (value: string) => (
        <span className="text-sm text-slate-400">{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Contact">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="More Actions">
            <MoreVertical className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-slate-100">Leads</h1>
          <p className="mt-2 text-slate-400">
            Manage and track your property inquiries and potential customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Bulk Contact
          </Button>
        </div>
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search leads by name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="qualified">Qualified</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
              
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                <option value="john-smith">John Smith</option>
                <option value="jane-doe">Jane Doe</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Table
          data={leads}
          columns={columns}
          onRowClick={(lead) => {
            console.log('Clicked lead:', lead);
            // Handle lead detail view
          }}
        />
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">This Week</p>
              <p className="text-2xl font-bold text-slate-100">18 new leads</p>
              <p className="text-sm text-green-400 mt-1">↗ 23% from last week</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Response Rate</p>
              <p className="text-2xl font-bold text-slate-100">85%</p>
              <p className="text-sm text-green-400 mt-1">↗ 5% improvement</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg Deal Size</p>
              <p className="text-2xl font-bold text-slate-100">$1.2M</p>
              <p className="text-sm text-purple-400 mt-1">→ Stable trend</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leads;
