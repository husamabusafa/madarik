import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Edit, 
  Star,
  Eye,
  Download,
  Grid3X3,
  List,
  FolderOpen,
  Calendar,
  FileImage,
  Play
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import StatCard from '../components/common/StatCard';

const Media: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Mock data
  const mediaItems = [
    {
      id: 1,
      name: 'luxury-villa-01.jpg',
      type: 'PHOTO',
      size: '2.4 MB',
      dimensions: '1920x1080',
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      propertyId: 1,
      propertyTitle: 'Luxury Villa in Jumeirah',
      isPrimary: true,
      sortOrder: 1,
      uploadedAt: '2024-01-20T10:30:00Z',
      uploadedBy: 'John Smith'
    },
    {
      id: 2,
      name: 'villa-exterior.jpg',
      type: 'PHOTO',
      size: '3.1 MB',
      dimensions: '2048x1365',
      url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
      propertyId: 1,
      propertyTitle: 'Luxury Villa in Jumeirah',
      isPrimary: false,
      sortOrder: 2,
      uploadedAt: '2024-01-20T10:32:00Z',
      uploadedBy: 'John Smith'
    },
    {
      id: 3,
      name: 'apartment-tour.mp4',
      type: 'VIDEO',
      size: '45.2 MB',
      dimensions: '1920x1080',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      propertyId: 2,
      propertyTitle: 'Modern Apartment in Marina',
      isPrimary: false,
      sortOrder: 1,
      uploadedAt: '2024-01-19T14:15:00Z',
      uploadedBy: 'Jane Doe'
    },
    {
      id: 4,
      name: 'office-space-interior.jpg',
      type: 'PHOTO',
      size: '1.8 MB',
      dimensions: '1600x1200',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      propertyId: 3,
      propertyTitle: 'Office Space Downtown',
      isPrimary: true,
      sortOrder: 1,
      uploadedAt: '2024-01-18T09:45:00Z',
      uploadedBy: 'John Smith'
    }
  ];

  const stats = [
    { title: 'Total Files', value: '1,247', icon: FileImage, change: { value: 23, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Storage Used', value: '8.9 GB', icon: FolderOpen, change: { value: 5, type: 'increase' as const }, color: 'green' as const },
    { title: 'This Month', value: '156', icon: Calendar, change: { value: 12, type: 'increase' as const }, color: 'purple' as const },
    { title: 'Primary Photos', value: '89', icon: Star, change: { value: 3, type: 'increase' as const }, color: 'orange' as const },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MediaCard = ({ item }: { item: any }) => (
    <motion.div
      className="group relative bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden hover:shadow-md transition-all duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, item.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== item.id));
            }
          }}
          className="h-4 w-4 text-blue-400 bg-slate-900 border-slate-700 rounded focus:ring-blue-500"
        />
      </div>

      {/* Primary badge */}
      {item.isPrimary && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-yellow-500 text-white rounded-full p-1">
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>
      )}

      {/* Media preview */}
      <div className="aspect-w-16 aspect-h-9 bg-slate-800">
        <div className="relative">
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          {item.type === 'VIDEO' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Play className="h-6 w-6 text-white fill-current" />
              </div>
            </div>
          )}
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="bg-slate-900/80 text-slate-100 hover:bg-slate-800">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-slate-900/80 text-slate-100 hover:bg-slate-800">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-slate-900/80 text-slate-100 hover:bg-slate-800">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Media info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {item.type === 'VIDEO' ? (
              <Video className="h-4 w-4 text-purple-400 mr-2" />
            ) : (
              <ImageIcon className="h-4 w-4 text-blue-400 mr-2" />
            )}
            <span className="text-sm font-medium text-slate-100 truncate">{item.name}</span>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-slate-400 space-y-1">
          <div>{item.dimensions} • {item.size}</div>
          <div className="truncate">{item.propertyTitle}</div>
          <div>Uploaded {formatDate(item.uploadedAt)}</div>
        </div>
      </div>
    </motion.div>
  );

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, row.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== row.id));
            }
          }}
          className="h-4 w-4 text-blue-400 border-slate-700 bg-slate-900 rounded focus:ring-blue-500"
        />
      ),
      width: '12'
    },
    {
      key: 'name',
      label: 'File',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={row.url}
              alt={value}
              className="h-12 w-16 object-cover rounded-lg"
            />
            {row.type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-current" />
              </div>
            )}
            {row.isPrimary && (
              <div className="absolute -top-1 -right-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-100">{value}</div>
            <div className="text-sm text-slate-400">{row.dimensions} • {row.size}</div>
          </div>
        </div>
      )
    },
    {
      key: 'propertyTitle',
      label: 'Property',
      render: (value: string) => (
        <div className="text-sm text-slate-100 max-w-xs truncate">{value}</div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <div className="flex items-center">
          {value === 'VIDEO' ? (
            <Video className="h-4 w-4 text-purple-400 mr-1" />
          ) : (
            <ImageIcon className="h-4 w-4 text-blue-400 mr-1" />
          )}
          <span className="text-sm text-slate-400">{value}</span>
        </div>
      )
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded',
      render: (value: string, row: any) => (
        <div className="text-sm">
          <div className="text-slate-100">{formatDate(value)}</div>
          <div className="text-slate-400">by {row.uploadedBy}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit">
            <Edit className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-slate-100">Media Library</h1>
          <p className="mt-2 text-slate-400">
            Manage property photos, videos, and other media assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <Button variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedItems.length})
            </Button>
          )}
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
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

      {/* Filters and View Toggle */}
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
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="photo">Photos</option>
                <option value="video">Videos</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              
              <div className="flex items-center border border-slate-700 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm rounded-l-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm rounded-r-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Media Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Table
            data={mediaItems}
            columns={columns}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Media;
