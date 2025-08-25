import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  Eye,
  EyeOff,
  Tag,
  Home,
  Car,
  Waves,
  Shield,
  Wifi
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
// Table not used on this page
import StatCard from '../components/common/StatCard';

const Amenities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  // editingId state removed until edit flow is implemented
  const [newAmenity, setNewAmenity] = useState({
    key: '',
    labelEn: '',
    labelAr: '',
    category: 'general',
    active: true
  });

  // Mock data - organized by categories
  const amenityCategories = [
    {
      id: 'building',
      name: 'Building Features',
      icon: Home,
      amenities: [
        { id: 1, key: 'elevator', labelEn: 'Elevator', labelAr: 'مصعد', active: true, usageCount: 45 },
        { id: 2, key: 'balcony', labelEn: 'Balcony', labelAr: 'شرفة', active: true, usageCount: 78 },
        { id: 3, key: 'terrace', labelEn: 'Terrace', labelAr: 'تراس', active: true, usageCount: 23 },
        { id: 4, key: 'maid_room', labelEn: 'Maid Room', labelAr: 'غرفة خادمة', active: false, usageCount: 12 }
      ]
    },
    {
      id: 'parking',
      name: 'Parking & Transportation',
      icon: Car,
      amenities: [
        { id: 5, key: 'covered_parking', labelEn: 'Covered Parking', labelAr: 'موقف مغطى', active: true, usageCount: 89 },
        { id: 6, key: 'garage', labelEn: 'Garage', labelAr: 'كراج', active: true, usageCount: 34 },
        { id: 7, key: 'valet_parking', labelEn: 'Valet Parking', labelAr: 'خدمة ركن السيارات', active: true, usageCount: 15 }
      ]
    },
    {
      id: 'recreation',
      name: 'Recreation & Leisure',
      icon: Waves,
      amenities: [
        { id: 8, key: 'swimming_pool', labelEn: 'Swimming Pool', labelAr: 'مسبح', active: true, usageCount: 67 },
        { id: 9, key: 'gym', labelEn: 'Gym', labelAr: 'صالة رياضية', active: true, usageCount: 56 },
        { id: 10, key: 'sauna', labelEn: 'Sauna', labelAr: 'ساونا', active: false, usageCount: 8 },
        { id: 11, key: 'jacuzzi', labelEn: 'Jacuzzi', labelAr: 'جاكوزي', active: true, usageCount: 29 }
      ]
    },
    {
      id: 'security',
      name: 'Security & Safety',
      icon: Shield,
      amenities: [
        { id: 12, key: 'security_24h', labelEn: '24/7 Security', labelAr: 'أمن 24 ساعة', active: true, usageCount: 92 },
        { id: 13, key: 'cctv', labelEn: 'CCTV', labelAr: 'كاميرات مراقبة', active: true, usageCount: 78 },
        { id: 14, key: 'intercom', labelEn: 'Intercom', labelAr: 'انتركوم', active: true, usageCount: 45 }
      ]
    },
    {
      id: 'utilities',
      name: 'Utilities & Services',
      icon: Wifi,
      amenities: [
        { id: 15, key: 'wifi', labelEn: 'WiFi', labelAr: 'واي فاي', active: true, usageCount: 134 },
        { id: 16, key: 'central_ac', labelEn: 'Central A/C', labelAr: 'تكييف مركزي', active: true, usageCount: 89 },
        { id: 17, key: 'concierge', labelEn: 'Concierge', labelAr: 'خدمة الاستقبال', active: true, usageCount: 23 }
      ]
    }
  ];

  const stats = [
    { title: 'Total Amenities', value: '87', icon: Tag, change: { value: 5, type: 'increase' as const }, color: 'blue' as const },
    { title: 'Active', value: '72', icon: Eye, change: { value: 3, type: 'increase' as const }, color: 'green' as const },
    { title: 'Categories', value: '5', icon: Home, change: { value: 0, type: 'increase' as const }, color: 'purple' as const },
    { title: 'Most Used', value: 'WiFi', icon: Wifi, change: { value: 0, type: 'increase' as const }, color: 'orange' as const },
  ];

  const handleSaveAmenity = () => {
    // Implementation for saving amenity
    console.log('Saving amenity:', newAmenity);
    setShowAddModal(false);
    setNewAmenity({ key: '', labelEn: '', labelAr: '', category: 'general', active: true });
  };

  const toggleAmenityStatus = (id: number) => {
    console.log('Toggling amenity status:', id);
    // Implementation for toggling amenity status
  };

  const AmenityCard = ({ category }: { category: any }) => {
    const IconComponent = category.icon;
    
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/15 rounded-lg mr-3">
              <IconComponent className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">{category.name}</h3>
          </div>
          <span className="text-sm text-slate-400">{category.amenities.length} items</span>
        </div>

        <div className="space-y-3">
          {category.amenities.map((amenity: any) => (
            <motion.div
              key={amenity.id}
              className="flex items-center justify-between p-3 border border-slate-800 rounded-lg hover:bg-slate-800/60 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-3">
                <div className="cursor-move">
                  <GripVertical className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-100">{amenity.labelEn}</span>
                    <span className="text-sm text-slate-400">({amenity.labelAr})</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Used in {amenity.usageCount} properties
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAmenityStatus(amenity.id)}
                  className={`p-1 rounded transition-colors ${
                    amenity.active 
                      ? 'text-green-400 hover:bg-green-500/15' 
                      : 'text-slate-500 hover:bg-slate-700/40'
                  }`}
                  title={amenity.active ? 'Active' : 'Inactive'}
                >
                  {amenity.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  title="Edit (coming soon)"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/15"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  };

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
          <h1 className="text-3xl font-bold text-slate-100">Amenities</h1>
          <p className="mt-2 text-slate-400">
            Manage property amenities and features that can be assigned to listings.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Amenity
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

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
      </motion.div>

      {/* Amenity Categories */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {amenityCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AmenityCard category={category} />
          </motion.div>
        ))}
      </motion.div>

      {/* Add Amenity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-100">Add New Amenity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Key (unique identifier)"
                value={newAmenity.key}
                onChange={(e) => setNewAmenity({ ...newAmenity, key: e.target.value })}
                placeholder="e.g., swimming_pool"
              />
              
              <Input
                label="English Label"
                value={newAmenity.labelEn}
                onChange={(e) => setNewAmenity({ ...newAmenity, labelEn: e.target.value })}
                placeholder="e.g., Swimming Pool"
              />
              
              <Input
                label="Arabic Label"
                value={newAmenity.labelAr}
                onChange={(e) => setNewAmenity({ ...newAmenity, labelAr: e.target.value })}
                placeholder="e.g., مسبح"
                className="text-right"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={newAmenity.category}
                  onChange={(e) => setNewAmenity({ ...newAmenity, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="building">Building Features</option>
                  <option value="parking">Parking & Transportation</option>
                  <option value="recreation">Recreation & Leisure</option>
                  <option value="security">Security & Safety</option>
                  <option value="utilities">Utilities & Services</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={newAmenity.active}
                  onChange={(e) => setNewAmenity({ ...newAmenity, active: e.target.checked })}
                  className="h-4 w-4 text-blue-400 border-slate-700 bg-slate-900 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 text-sm text-slate-300">
                  Active (visible to users)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAmenity}>
                <Save className="h-4 w-4 mr-2" />
                Save Amenity
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Amenities;
