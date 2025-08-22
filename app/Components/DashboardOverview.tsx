"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { BarChart3, Users, Package, TrendingUp, Activity, Calendar, Eye } from 'lucide-react';

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
  }>;
  recentMovements: StockMovement[];
}

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = "blue" 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  change?: string; 
  color?: string; 
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ movements }: { movements: StockMovement[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
        <Eye className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {movements.slice(0, 5).map((movement) => (
          <div key={movement.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                movement.movement_type === 'in' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {movement.movement_type === 'in' ? '+' : '-'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{movement.product.name}</p>
                <p className="text-xs text-gray-500">{movement.store.store_name} • {movement.store.city}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{movement.quantity_changed}</p>
              <p className="text-xs text-gray-500">
                {new Date(movement.movement_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">Add New Store</p>
          <p className="text-xs text-gray-500">Create store account</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <BarChart3 className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">View Reports</p>
          <p className="text-xs text-gray-500">Analytics & insights</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <Package className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">Stock Overview</p>
          <p className="text-xs text-gray-500">Monitor inventory</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <Activity className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">System Health</p>
          <p className="text-xs text-gray-500">Monitor system</p>
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function DashboardOverview() {
  const { data: stores, error: storesError } = useSWR<Store[]>('/api/getAllStores', apiFetch);
  const { data: stockSummary, error: summaryError } = useSWR<StockSummary>('/stockoverview/getStockOverviewSummary', apiFetch);

  // Calculate stats
  const totalStores = stores?.length || 0;
  const activeStores = stores?.filter(store => store.is_active)?.length || 0;
  const inactiveStores = totalStores - activeStores;

  // Calculate today's stock movements
  const today = new Date().toISOString().split('T')[0];
  const todayMovements = stockSummary?.recentMovements?.filter(movement => 
    movement.movement_date.startsWith(today)
  )?.length || 0;

  // Calculate total stock in/out from summary
  const totalStockIn = stockSummary?.summary?.find(s => s.movement_type === 'in')?.total_quantity || '0';
  const totalStockOut = stockSummary?.summary?.find(s => s.movement_type === 'out')?.total_quantity || '0';

  if (storesError || summaryError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your stores.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Stores"
          value={totalStores}
          icon={Users}
          color="blue"
          change={`${activeStores} active`}
        />
        <StatsCard
          title="Today's Movements"
          value={todayMovements}
          icon={Activity}
          color="green"
          change="Real-time"
        />
        <StatsCard
          title="Stock In (Total)"
          value={totalStockIn}
          icon={Package}
          color="orange"
          change="All time"
        />
        <StatsCard
          title="Stock Out (Total)"
          value={totalStockOut}
          icon={TrendingUp}
          color="purple"
          change="All time"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          {stockSummary?.recentMovements ? (
            <RecentActivity movements={stockSummary.recentMovements} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Store Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalStores}</div>
            <div className="text-sm text-gray-600">Total Stores</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeStores}</div>
            <div className="text-sm text-gray-600">Active Stores</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{inactiveStores}</div>
            <div className="text-sm text-gray-600">Inactive Stores</div>
          </div>
        </div>
      </div>
    </div>
  );
}
