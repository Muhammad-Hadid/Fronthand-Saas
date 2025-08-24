"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  Download,
  RotateCcw,
  Building,
  Package,
  Activity
} from 'lucide-react';

// Types
interface Store {
  id: number;
  store_name: string;
  city: string;
  is_active: boolean;
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
  recentMovements: Array<{
    id: number;
    movement_type: string;
    quantity_changed: number;
    movement_date: string;
    store: {
      store_name: string;
      city: string;
    };
    product: {
      name: string;
      category: string;
    };
  }>;
}

// Chart Colors
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Chart Components
const StockTrendChart = ({ data }: { data: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Stock Movement Trends</h3>
      <BarChart3 className="w-5 h-5 text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="stock_in" 
          stroke="#10B981" 
          strokeWidth={2}
          name="Stock In"
        />
        <Line 
          type="monotone" 
          dataKey="stock_out" 
          stroke="#EF4444" 
          strokeWidth={2}
          name="Stock Out"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const StorePerformanceChart = ({ data }: { data: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Store Performance</h3>
      <BarChart3 className="w-5 h-5 text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="store_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_in" fill="#10B981" name="Stock In" />
        <Bar dataKey="total_out" fill="#EF4444" name="Stock Out" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const MovementTypePieChart = ({ data }: { data: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Movement Types Distribution</h3>
      <PieChartIcon className="w-5 h-5 text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const TopProductsChart = ({ data }: { data: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Top Products by Movement</h3>
      <Package className="w-5 h-5 text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="movements" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = "blue" 
}: {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trend ? trendColors[trend] : 'text-gray-600'}`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
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

// Main Analytics Dashboard Component
export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedStore, setSelectedStore] = useState('');

  // API calls
  const { data: stores } = useSWR<Store[]>('/api/getAllStores', apiFetch);
  const { data: stockSummary } = useSWR<StockSummary>('/stockoverview/getStockOverviewSummary', apiFetch);

  // Process data for charts
  const processChartData = () => {
    if (!stockSummary) return { trendData: [], storeData: [], pieData: [], topProducts: [] };

    // Process store performance data
    const storeMap = new Map();
    stockSummary.storeSummary.forEach(item => {
      const storeName = item.store?.store_name || `Store ${item.store_id}`;
      if (!storeMap.has(storeName)) {
        storeMap.set(storeName, { store_name: storeName, total_in: 0, total_out: 0 });
      }
      const store = storeMap.get(storeName);
      if (item.movement_type === 'in') {
        store.total_in += parseInt(item.total_quantity);
      } else {
        store.total_out += parseInt(item.total_quantity);
      }
    });

    const storeData = Array.from(storeMap.values());

    // Process movement type distribution
    const pieData = stockSummary.summary.map(item => ({
      name: item.movement_type === 'in' ? 'Stock In' : 'Stock Out',
      value: parseInt(item.total_quantity)
    }));

    // Generate mock trend data (replace with real data processing)
    const trendData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stock_in: Math.floor(Math.random() * 100) + 50,
        stock_out: Math.floor(Math.random() * 80) + 30
      };
    });

    // Process top products (mock data - replace with real product data)
    const productMap = new Map();
    stockSummary.recentMovements.slice(0, 10).forEach(movement => {
      const productName = movement.product.name;
      if (!productMap.has(productName)) {
        productMap.set(productName, { name: productName, movements: 0 });
      }
      productMap.get(productName).movements += 1;
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.movements - a.movements)
      .slice(0, 5);

    return { trendData, storeData, pieData, topProducts };
  };

  const chartData = processChartData();

  // Calculate key metrics
  const totalStores = stores?.length || 0;
  const activeStores = stores?.filter(s => s.is_active).length || 0;
  const totalStockIn = stockSummary?.summary?.find(s => s.movement_type === 'in')?.total_quantity || '0';
  const totalStockOut = stockSummary?.summary?.find(s => s.movement_type === 'out')?.total_quantity || '0';
  const totalMovements = stockSummary?.summary?.reduce((acc, s) => acc + parseInt(s.total_movements), 0) || 0;

  // Calculate growth rates (mock calculations)
  const stockInGrowth = "+12.5%";
  const stockOutGrowth = "+8.3%";
  const movementGrowth = "+15.2%";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your inventory operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RotateCcw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Stores"
          value={totalStores}
          change={`${activeStores} active`}
          trend="neutral"
          icon={Building}
          color="blue"
        />
        <MetricCard
          title="Total Stock In"
          value={totalStockIn}
          change={stockInGrowth}
          trend="up"
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Total Stock Out"
          value={totalStockOut}
          change={stockOutGrowth}
          trend="up"
          icon={TrendingDown}
          color="red"
        />
        <MetricCard
          title="Total Movements"
          value={totalMovements}
          change={movementGrowth}
          trend="up"
          icon={Activity}
          color="orange"
        />
        <MetricCard
          title="Avg Daily Movement"
          value={Math.round(totalMovements / 30)}
          change="Real-time"
          trend="neutral"
          icon={BarChart3}
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockTrendChart data={chartData.trendData} />
        <MovementTypePieChart data={chartData.pieData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorePerformanceChart data={chartData.storeData} />
        <TopProductsChart data={chartData.topProducts} />
      </div>

      {/* Store Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Store Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Movement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.storeData.map((store, index) => {
                const netMovement = store.total_in - store.total_out;
                const performance = store.total_in + store.total_out;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{store.store_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {stores?.find(s => s.store_name === store.store_name)?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">+{store.total_in}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">-{store.total_out}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netMovement >= 0 ? '+' : ''}{netMovement}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((performance / Math.max(...chartData.storeData.map(s => s.total_in + s.total_out))) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{performance}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stockSummary?.recentMovements?.length || 0}</div>
            <div className="text-sm text-gray-600">Recent Movements</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stockSummary?.recentMovements?.filter(m => m.movement_type === 'in').length || 0}
            </div>
            <div className="text-sm text-gray-600">Recent Stock In</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stockSummary?.recentMovements?.filter(m => m.movement_type === 'out').length || 0}
            </div>
            <div className="text-sm text-gray-600">Recent Stock Out</div>
          </div>
        </div>
      </div>
    </div>
  );
}
