import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLazyQuery, useQuery } from '@apollo/client/react';
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
import { GET_LISTINGS, SEARCH_LISTINGS } from '../lib/graphql/queries';

const Properties: React.FC = () => {
  const { t, isRTL, locale } = useI18n() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'createdAt' | 'price'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // GraphQL: Fetch listings (default)
  const { data, loading, error, refetch } = useQuery<{ listings: any[] }>(GET_LISTINGS);
  // GraphQL: Server-side search
  const [runSearch, { data: searchData, loading: searchLoading, error: searchError }] = useLazyQuery<{ searchListings: any[] }>(SEARCH_LISTINGS, { fetchPolicy: 'network-only' });

  // Debounce searchTerm for server-side search
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    const q = searchTerm.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (q.length >= 2) {
        runSearch({ variables: { query: q } });
      }
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm, runSearch]);

  // Choose data source: use search results when query active, else default listings
  const baseListings = useMemo(() => {
    const q = searchTerm.trim();
    if (q.length >= 2) return searchData?.searchListings ?? [];
    return data?.listings ?? [];
  }, [data, searchData, searchTerm]);

  // Helpers to read localized title and address
  const getLocalizedTrans = (row: any) => {
    const desired = row.translations?.find((tr: any) => tr.locale === locale);
    return desired || row.translations?.[0] || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/15 text-green-300';
      case 'DRAFT': return 'bg-slate-500/15 text-slate-300';
      case 'READY_TO_PUBLISH': return 'bg-amber-500/15 text-amber-300';
      case 'ARCHIVED': return 'bg-red-500/15 text-red-300';
      default: return 'bg-slate-500/15 text-slate-300';
    }
  };

  const formatPrice = (price: string | null | undefined, currency?: string | null) => {
    if (!price) return '-';
    const numeric = Number(price);
    if (Number.isNaN(numeric)) return price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numeric);
  };

  const columns = [
    {
      key: 'title',
      label: t('properties.property'),
      render: (_: string, row: any) => {
        const tr = getLocalizedTrans(row);
        const title = tr?.title || row.addressLine;
        const loc = tr?.displayAddressLine || `${row.addressLine}, ${row.city}`;
        const img = row.primaryPhotoUrl || 'https://via.placeholder.com/320x180?text=Listing';
        return (
        <div className={clsx('flex items-center', isRTL ? 'space-x-reverse space-x-3' : 'space-x-3')}>
          <img
            src={img}
            alt={title}
            className="h-12 w-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-medium text-slate-100">{title}</div>
            <div className="text-sm text-slate-400 flex items-center">
              <MapPin className={clsx('h-3 w-3', isRTL ? 'ml-1' : 'mr-1')} />
              {loc}
            </div>
          </div>
        </div>
        );
      }
    },
    {
      key: 'price',
      label: t('properties.price'),
      render: (_: any, row: any) => (
        <div className="font-medium text-slate-100">
          {formatPrice(row.price, row.currency)}
        </div>
      )
    },
    {
      key: 'propertyType',
      label: t('properties.type'),
      render: (value: string) => (
        <span className="text-sm text-slate-400">{value}</span>
      )
    },
    {
      key: 'specs',
      label: t('properties.details'),
      render: (_: any, row: any) => (
        <div className={clsx('flex items-center text-sm text-slate-400', isRTL ? 'space-x-reverse space-x-4' : 'space-x-4')}>
          {row.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
              {row.bedrooms}
            </div>
          )}
          <div className="flex items-center">
            <Bath className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
            {row.bathrooms ?? 0}
          </div>
          <div className="flex items-center">
            <Square className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
            {row.areaValue ? Number(row.areaValue) : '-'} {row.areaUnit || ''}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('properties.status'),
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (s: string) => s.toUpperCase())}
        </span>
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
          src={property.primaryPhotoUrl || 'https://via.placeholder.com/800x400?text=Listing'}
          alt={getLocalizedTrans(property)?.title || property.addressLine}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
            {property.status.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (s: string) => s.toUpperCase())}
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
        <h3 className="font-semibold text-slate-100 mb-2">{getLocalizedTrans(property)?.title || property.addressLine}</h3>
        <p className="text-sm text-slate-400 mb-3 flex items-center">
          <MapPin className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
          {getLocalizedTrans(property)?.displayAddressLine || `${property.addressLine}, ${property.city}`}
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
              {property.bathrooms ?? 0}
            </div>
            <div className="flex items-center">
              <Square className={clsx('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
              {property.areaValue ? Number(property.areaValue) : '-'} {property.areaUnit || ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-sm text-slate-500">&nbsp;</div>
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
                <option value="PUBLISHED">{t('properties.published')}</option>
                <option value="DRAFT">{t('properties.draft')}</option>
                <option value="READY_TO_PUBLISH">{t('properties.readyToPublish')}</option>
                <option value="ARCHIVED">{t('properties.archived')}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <Filter className={clsx('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                {t('properties.moreFilters')}
              </Button>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-slate-800 bg-slate-900 text-slate-100 rounded-lg text-sm"
                >
                  <option value="createdAt">{t('properties.sortCreated') || 'Sort: Created'}</option>
                  <option value="price">{t('properties.sortPrice') || 'Sort: Price'}</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                  className="px-3 py-2 border border-slate-800 bg-slate-900 text-slate-100 rounded-lg text-sm hover:bg-white/5"
                  title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortDir === 'asc' ? 'Asc' : 'Desc'}
                </button>
              </div>

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
        {(loading || searchLoading) && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {(error || searchError) && (
          <div className="p-6 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
            {(error || searchError)?.message}
          </div>
        )}
        {!loading && !searchLoading && !error && !searchError && (
          <>
            {viewMode === 'table' ? (
              <Table
                data={baseListings
                  .filter((row: any) => {
                    const tr = getLocalizedTrans(row);
                    const title = (tr?.title || row.addressLine || '').toLowerCase();
                    const q = searchTerm.toLowerCase();
                    const statusOk = statusFilter === 'all' || row.status === statusFilter;
                    const match = q.length >= 2 ? true : title.includes(q);
                    return match && statusOk;
                  })
                  .sort((a: any, b: any) => {
                    let av: number = 0;
                    let bv: number = 0;
                    if (sortBy === 'price') {
                      av = Number(a.price) || 0;
                      bv = Number(b.price) || 0;
                    } else {
                      av = new Date(a.createdAt).getTime();
                      bv = new Date(b.createdAt).getTime();
                    }
                    return sortDir === 'asc' ? av - bv : bv - av;
                  })
                }
                columns={columns}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {baseListings
                  .filter((row: any) => {
                    const tr = getLocalizedTrans(row);
                    const title = (tr?.title || row.addressLine || '').toLowerCase();
                    const q = searchTerm.toLowerCase();
                    const statusOk = statusFilter === 'all' || row.status === statusFilter;
                    const match = q.length >= 2 ? true : title.includes(q);
                    return match && statusOk;
                  })
                  .sort((a: any, b: any) => {
                    let av: number = 0;
                    let bv: number = 0;
                    if (sortBy === 'price') {
                      av = Number(a.price) || 0;
                      bv = Number(b.price) || 0;
                    } else {
                      av = new Date(a.createdAt).getTime();
                      bv = new Date(b.createdAt).getTime();
                    }
                    return sortDir === 'asc' ? av - bv : bv - av;
                  })
                  .map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
            {baseListings.length === 0 && (
              <Card className="p-12 mt-6 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">{t('properties.emptyTitle') || 'No properties yet'}</h3>
                <p className="text-slate-400 mb-6">{t('properties.emptyDesc') || 'Get started by creating your first property listing. You can add photos, details, and translations.'}</p>
                <Link to="/properties/new">
                  <Button size="lg">
                    <Plus className={clsx('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                    {t('properties.addFirstProperty') || 'Add your first property'}
                  </Button>
                </Link>
              </Card>
            )}
          </>
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
              <p className="text-2xl font-bold text-slate-100">
                {(() => {
                  const total = baseListings.reduce((sum: number, l: any) => sum + (Number(l.price) || 0), 0);
                  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total);
                })()}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.totalListings') || 'Total Listings'}</p>
              <p className="text-2xl font-bold text-slate-100">{baseListings.length}</p>
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
              <p className="text-2xl font-bold text-slate-100">{new Set(baseListings.map((l: any) => `${l.city}|${l.country}`)).size}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
            <div className={clsx(isRTL ? 'mr-4' : 'ml-4')}>
              <p className="text-sm text-slate-400">{t('properties.published') || 'Published'}</p>
              <p className="text-2xl font-bold text-slate-100">{baseListings.filter((l: any) => l.status === 'PUBLISHED').length}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Properties;
