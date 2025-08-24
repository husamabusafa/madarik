import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { Link } from 'react-router-dom';

const Properties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Mock data
  const properties = [
    {
      id: 1,
      title: 'Luxury Villa in Jumeirah',
      titleAr: 'فيلا فاخرة في جميرا',
      price: 2500000,
      currency: 'USD',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 6,
      area: 450,
      areaUnit: 'SQM',
      status: 'Published',
      location: 'Jumeirah, Dubai',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      views: 234,
      leads: 12,
      createdAt: '2024-01-15',
      lastEdited: '2024-01-20'
    },
    {
      id: 2,
      title: 'Modern Apartment in Marina',
      titleAr: 'شقة حديثة في مارينا',
      price: 850000,
      currency: 'USD',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      areaUnit: 'SQM',
      status: 'Published',
      location: 'Dubai Marina, Dubai',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      views: 189,
      leads: 8,
      createdAt: '2024-01-10',
      lastEdited: '2024-01-18'
    },
    {
      id: 3,
      title: 'Office Space Downtown',
      titleAr: 'مساحة مكتبية وسط المدينة',
      price: 1200000,
      currency: 'USD',
      type: 'Commercial',
      bedrooms: 0,
      bathrooms: 2,
      area: 200,
      areaUnit: 'SQM',
      status: 'Draft',
      location: 'Downtown Dubai, Dubai',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      views: 67,
      leads: 3,
      createdAt: '2024-01-12',
      lastEdited: '2024-01-22'
    },
    {
      id: 4,
      title: 'Family House in Mirdif',
      titleAr: 'بيت عائلي في مردف',
      price: 950000,
      currency: 'USD',
      type: 'House',
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      areaUnit: 'SQM',
      status: 'Ready to Publish',
      location: 'Mirdif, Dubai',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      views: 145,
      leads: 6,
      createdAt: '2024-01-08',
      lastEdited: '2024-01-19'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Ready to Publish': return 'bg-yellow-100 text-yellow-700';
      case 'Archived': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const columns = [
    {
      key: 'title',
      label: 'Property',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.image}
            alt={value}
            className="h-12 w-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {row.location}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number, row: any) => (
        <div className="font-medium text-gray-900">
          {formatPrice(value, row.currency)}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'bedrooms',
      label: 'Details',
      render: (bedrooms: number, row: any) => (
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {bedrooms}
            </div>
          )}
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {row.bathrooms}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {row.area} {row.areaUnit}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'views',
      label: 'Performance',
      render: (views: number, row: any) => (
        <div className="text-sm">
          <div className="text-gray-900">{views} views</div>
          <div className="text-gray-500">{row.leads} leads</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const PropertyCard = ({ property }: { property: any }) => (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-3">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
            )}
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.area} {property.areaUnit}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {property.views} views • {property.leads} leads
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
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
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="mt-2 text-gray-600">
            Manage your real estate listings and track their performance.
          </p>
        </div>
        <Link to="/properties/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="ready">Ready to Publish</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm rounded-l-lg transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm rounded-r-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {viewMode === 'table' ? (
          <Table
            data={properties}
            columns={columns}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">$5.5M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">635</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Locations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Properties;
