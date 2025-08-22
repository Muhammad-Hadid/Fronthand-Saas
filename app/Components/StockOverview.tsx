"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Activity, 
  Calendar,
  Filter,
  Search,
  Download,
  RotateCcw,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Types
interface StockMovement {
  id: number;
  store_id: number;
  product_id: number;
  movement_type: 'in' | 'out';
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  movement_date: string;
  reference_type: string;
  reference_id: number;
  store: {
    id: number;
    store_name: string;
    city: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
}

interface StockSummary {
  summary: Array<{
    movement_type: string;
    reference_type: string;
    total_quantity: string;
    total_movements: string;
  }>;
  storeSummary: Array<{
    store_id: number;
    movement_type: string;
    total_quantity: string;
    total_movements: string;
    store?: {
      id: number;
      store_name: string;
      city: string;
    };
  }>;
  recentMovements: StockMovement[];
}

interface StockMovementsResponse {
  history: StockMovement[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = "blue",
  trend
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  change?: string; 
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trend ? trendColors[trend] : 'text-gray-600'}`}>
              {trend === 'up' && <ArrowUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Date Range Picker Component
const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 text-sm">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">From:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-gray-600">To:</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

// Stock Movements Table Component
const StockMovementsTable = ({ 
  movements, 
  loading,
  pagination,
  onPageChange
}: {
  movements: StockMovement[];
  loading: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(movement.movement_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(movement.movement_date).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{movement.store.store_name}</div>
                  <div className="text-xs text-gray-500">{movement.store.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{movement.product.name}</div>
                  <div className="text-xs text-gray-500">{movement.product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    movement.movement_type === 'in' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {movement.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    movement.movement_type === 'in' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity_changed}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.previous_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.new_quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total movements)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Stock Overview Component
export default function StockOverview() {
  // State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [movementType, setMovementType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize dates
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Build query parameters
  const getQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: 20
    };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (selectedStore) params.store_id = selectedStore;
    if (movementType) params.movement_type = movementType;
    return params;
  };

  // API calls
  const { data: summary } = useSWR<StockSummary>('/stockoverview/getStockOverviewSummary', apiFetch);
  const { data: movements, isLoading: movementsLoading } = useSWR<StockMovementsResponse>(
    ['/stockoverview/getAllStockMovements', getQueryParams()],
    ([url, params]) => {
      const queryParams = new URLSearchParams();
      Object.entries(params as Record<string, string | number>).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      return apiFetch(`${url}?${queryParams}`);
    }
  );
  const { data: stores } = useSWR<any[]>('/api/getAllStores', apiFetch);

  // Calculate stats
  const totalStockIn = summary?.summary?.find(s => s.movement_type === 'in')?.total_quantity || '0';
  const totalStockOut = summary?.summary?.find(s => s.movement_type === 'out')?.total_quantity || '0';
  const totalMovements = summary?.summary?.reduce((acc, s) => acc + Number(s.total_movements), 0) || 0;

  // Get today's movements count
  const today = new Date().toISOString().split('T')[0];
  const todayMovements = summary?.recentMovements?.filter(m => 
    m.movement_date.startsWith(today)
  )?.length || 0;

  const handleExport = () => {
    // Implementation for exporting data
    alert('Export functionality would be implemented here');
  };

  const resetFilters = () => {
    setSelectedStore('');
    setMovementType('');
    setCurrentPage(1);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Overview</h1>
          <p className="text-gray-600 mt-1">Monitor all stock movements across your stores</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Stock In"
          value={totalStockIn}
          icon={TrendingUp}
          color="green"
          change="All time"
          trend="up"
        />
        <StatsCard
          title="Total Stock Out"
          value={totalStockOut}
          icon={TrendingDown}
          color="red"
          change="All time"
          trend="down"
        />
        <StatsCard
          title="Total Movements"
          value={totalMovements}
          icon={Activity}
          color="blue"
          change="All time"
          trend="neutral"
        />
        <StatsCard
          title="Today's Movements"
          value={todayMovements}
          icon={Package}
          color="orange"
          change="Real-time"
          trend="neutral"
        />
      </div>

      {/* Store Summary Cards */}
      {summary?.storeSummary && summary.storeSummary.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.storeSummary.slice(0, 6).map((store, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{store.store?.store_name || `Store ${store.store_id}`}</h4>
                  <Building className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600 mb-2">{store.store?.city}</div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    store.movement_type === 'in' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{store.total_quantity}</div>
                    <div className="text-xs text-gray-500">{store.total_movements} movements</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Stores</option>
              {stores?.map(store => (
                <option key={store.id} value={store.id}>{store.store_name}</option>
              ))}
            </select>
            
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Movements Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Movements</h2>
        <StockMovementsTable
          movements={movements?.history || []}
          loading={movementsLoading}
          pagination={movements ? {
            currentPage: movements.currentPage,
            totalPages: movements.totalPages,
            total: movements.total
          } : undefined}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Recent Activity Timeline */}
      {summary?.recentMovements && summary.recentMovements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {summary.recentMovements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
                <div className={`p-2 rounded-full ${
                  movement.movement_type === 'in' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {movement.movement_type === 'in' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {movement.product.name} - {movement.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {movement.store.store_name} • {movement.quantity_changed} units • {new Date(movement.movement_date).toLocaleString()}
                  </p>
                </div>
                <div className={`text-sm font-medium ${
                  movement.movement_type === 'in' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity_changed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
