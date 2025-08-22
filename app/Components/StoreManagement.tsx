"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  MapPin, 
  Mail, 
  Phone, 
  User,
  Building,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

// Types
interface Store {
  id: number;
  store_name: string;
  admin_name: string;
  email: string;
  contact_info: string;
  cnic: string;
  store_address: string;
  city: string;
  subdomain: string;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create/Edit Store Modal
const StoreModal = ({ 
  isOpen, 
  onClose, 
  store, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  store?: Store | null; 
  onSave: () => void; 
}) => {
  const [formData, setFormData] = useState({
    store_name: '',
    admin_name: '',
    email: '',
    contact_info: '',
    cnic: '',
    store_address: '',
    city: '',
    user_id: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({
        store_name: store.store_name,
        admin_name: store.admin_name,
        email: store.email,
        contact_info: store.contact_info,
        cnic: store.cnic,
        store_address: store.store_address,
        city: store.city,
        user_id: store.user_id.toString(),
        is_active: store.is_active
      });
    } else {
      setFormData({
        store_name: '',
        admin_name: '',
        email: '',
        contact_info: '',
        cnic: '',
        store_address: '',
        city: '',
        user_id: '',
        is_active: true
      });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        user_id: parseInt(formData.user_id)
      };

      if (store) {
        await apiFetch(`/api/updateStore/${store.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/api/createStore', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Error saving store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {store ? 'Edit Store' : 'Create New Store'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
              <input
                type="text"
                value={formData.admin_name}
                onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
              <input
                type="text"
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <textarea
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="number"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.is_active.toString()}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (store ? 'Update Store' : 'Create Store')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Store Details Modal
const StoreDetailsModal = ({ 
  isOpen, 
  onClose, 
  store 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  store: Store | null; 
}) => {
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Store Details</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              store.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {store.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Store Name</p>
                  <p className="text-gray-900">{store.store_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin Name</p>
                  <p className="text-gray-900">{store.admin_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{store.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Info</p>
                  <p className="text-gray-900">{store.contact_info || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">City</p>
                  <p className="text-gray-900">{store.city}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">CNIC</p>
                <p className="text-gray-900">{store.cnic || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Subdomain</p>
                <p className="text-gray-900">{store.subdomain || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">User ID</p>
                <p className="text-gray-900">{store.user_id}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Store Address</p>
            <p className="text-gray-900">{store.store_address || 'N/A'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-600">Created At</p>
              <p className="text-gray-900">{new Date(store.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Updated At</p>
              <p className="text-gray-900">{new Date(store.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Store Management Component
export default function StoreManagement() {
  const { data: stores, error, mutate, isLoading } = useSWR<Store[]>('/api/getAllStores', apiFetch);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter stores based on search term and status
  const filteredStores = stores?.filter(store => {
    const matchesSearch = store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && store.is_active) ||
                         (statusFilter === 'inactive' && !store.is_active);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = async (storeId: number) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await apiFetch(`/api/deleteStore/${storeId}`, { method: 'DELETE' });
        mutate();
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Error deleting store. Please try again.');
      }
    }
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (store: Store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading stores. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600 mt-1">Manage all stores in your system</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores, admins, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stores</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stores</p>
              <p className="text-xl font-bold text-gray-900">{stores?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              <p className="text-xl font-bold text-gray-900">{stores?.filter(s => s.is_active).length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Stores</p>
              <p className="text-xl font-bold text-gray-900">{stores?.filter(s => !s.is_active).length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No stores found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{store.store_name}</p>
                        <p className="text-sm text-gray-500">{store.subdomain || 'No subdomain'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{store.admin_name}</p>
                        <p className="text-sm text-gray-500">{store.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{store.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        store.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(store.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(store)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(store)}
                          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                          title="Edit Store"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete Store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <StoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={() => {
          mutate();
          setIsCreateModalOpen(false);
        }}
      />
      
      <StoreModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onSave={() => {
          mutate();
          setIsEditModalOpen(false);
          setSelectedStore(null);
        }}
      />
      
      <StoreDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
      />
    </div>
  );
}
