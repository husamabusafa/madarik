import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
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
import { useI18n } from '../contexts/I18nContext';
import { clsx } from 'clsx';

const Properties: React.FC = () => {
  const { t, isRTL } = useI18n();
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
      case 'Published': return 'bg-green-500/15 text-green-300';
      case 'Draft': return 'bg-slate-500/15 text-slate-300';
      case 'Ready to Publish': return 'bg-amber-500/15 text-amber-300';
      case 'Archived': return 'bg-red-500/15 text-red-300';
      default: return 'bg-slate-500/15 text-slate-300';
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
      label: t('properties.property'),
              render: (value: string, row: any) => (
        <div className={clsx('flex items-center', isRTL ? 'space-x-reverse space-x-3' : 'space-x-3')}>
          <img
            src={row.image}
            alt={value}
            className="h-12 w-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-medium text-slate-100">{value}</div>
            <div className="text-sm text-slate-400 flex items-center">
              <MapPin className={clsx('h-3 w-3', isRTL ? 'ml-1' : 'mr-1')} />
              {row.location}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: t('properties.price'),
      render: (value: number, row: any) => (
        <div className="font-medium text-slate-100">
          {formatPrice(value, row.currency)}
        </div>
      )
    },
    {
      key: 'type',
      label: t('properties.type'),
      render: (value: string) => (
        <span className="text-sm text-slate-400">{value}</span>
      )
    },
    {
      key: 'bedrooms',
      label: t('properties.details'),
      render: (bedrooms: number, row: any) => (
        <div className={clsx('flex items-center text-sm text-slate-400', isRTL ? 'space-x-reverse space-x-4' : 'space-x-4')}>
          {bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
              {bedrooms}
            </div>
          )}
          <div className="flex items-center">
            <Bath className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
            {row.bathrooms}
          </div>
          <div className="flex items-center">
            <Square className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
            {row.area} {row.areaUnit}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('properties.status'),
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'views',
      label: t('properties.performance'),
              render: (views: number, row: any) => (
        <div className="text-sm">
          <div className="text-slate-100">{views} {t('properties.views')}</div>
          <div className="text-slate-400">{row.leads} {t('properties.leads')}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: t('properties.actions'),
              render: () => (
        <div className={clsx('flex items-center', isRTL ? 'space-x-reverse space-x-2' : 'space-x-2')}>
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
      className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200"
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
          <div className="bg-slate-900/80 border border-slate-700 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-semibold text-slate-100">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-100 mb-2">{property.title}</h3>
        <p className="text-sm text-slate-400 mb-3 flex items-center">
          <MapPin className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
          <div className={clsx('flex items-center', isRTL ? 'space-x-reverse space-x-3' : 'space-x-3')}>
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
                {property.bedrooms}
              </div>
            )}
            <div className="flex items-center">
              <Bath className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
              {property.bathrooms}
            </div>
            <div className="flex items-center">
              <Square className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
              {property.area} {property.areaUnit}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-sm text-slate-400">
            {property.views} {t('properties.views')} • {property.leads} {t('properties.leads')}
          </div>
          <div className={clsx('flex items-center', isRTL ? 'space-x-reverse space-x-1' : 'space-x-1')}>
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
          <h1 className="text-3xl font-bold text-slate-100">{t('properties.title')}</h1>
          <p className="mt-2 text-slate-400">
            {t('properties.subtitle')}
          </p>
        </div>
        <Link to="/properties/new">
          <Button size="lg">
            <Plus className={clsx('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
            {t('properties.addProperty')}
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
                <Search className={clsx('absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400', isRTL ? 'right-3' : 'left-3')} />
                <Input
                  placeholder={t('properties.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('properties.allStatus')}</option>
                <option value="published">{t('properties.published')}</option>
                <option value="draft">{t('properties.draft')}</option>
                <option value="ready">{t('properties.readyToPublish')}</option>
                <option value="archived">{t('properties.archived')}</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className={clsx('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                {t('properties.moreFilters')}
              </Button>
              
              <div className="flex items-center border border-slate-800 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={clsx(
                    'px-3 py-2 text-sm transition-colors',
                    isRTL ? 'rounded-r-lg' : 'rounded-l-lg',
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-white/5'
                  )}
                >
                  {t('properties.table')}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'px-3 py-2 text-sm transition-colors',
                    isRTL ? 'rounded-l-lg' : 'rounded-r-lg',
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-white/5'
                  )}
                >
                  {t('properties.grid')}
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
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.totalValue')}</p>
              <p className="text-2xl font-bold text-slate-100">$5.5M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.totalViews')}</p>
              <p className="text-2xl font-bold text-slate-100">635</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.locations')}</p>
              <p className="text-2xl font-bold text-slate-100">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.thisMonth')}</p>
              <p className="text-2xl font-bold text-slate-100">8</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Properties;
