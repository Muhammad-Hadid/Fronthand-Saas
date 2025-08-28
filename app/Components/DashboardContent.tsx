"use client";

import { useState, useEffect } from 'react';
import { Card, Metric, Text, Flex, ProgressBar } from "@tremor/react";
import { showError } from '../utils/toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  status: string;
}

interface StockHistory {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  reason?: string;
}

interface StockData {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
}

interface ChartData {
  labels: string[];
  data: number[];
}

export default function DashboardContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [stockData, setStockData] = useState<StockData>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockValue: 0
  });
  const [stockMovementData, setStockMovementData] = useState<ChartData>({ labels: [], data: [] });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get tenant (subdomain) from localStorage
        const getTenant = (): string | null => {
          if (typeof window === "undefined") return null;
          
          // 1) Preferred key your app saves: "subdomain"
          const lsSub = localStorage.getItem("subdomain");
          if (lsSub && lsSub.trim()) return lsSub.trim();

          // 2) Fallbacks if you ever saved under a different key
          const lsTenant = localStorage.getItem("tenant");
          if (lsTenant && lsTenant.trim()) return lsTenant.trim();

          const lsTenantId = localStorage.getItem("tenant_id");
          if (lsTenantId && lsTenantId.trim()) return lsTenantId.trim();

          return null;
        };

        const tenant = getTenant();
        if (!tenant) {
          throw new Error('Tenant not found in localStorage');
        }
        
        // Get the auth token from cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const headers = {
          'Accept': 'application/json',
          'x-tenant': tenant, // Add tenant header
          ...(token && { 'Authorization': `Bearer ${token}` }),
        };
        
        // Fetch all products
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getAllProducts`, {
          headers,
          credentials: 'include',
        });
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productsData: Product[] = await productsResponse.json();
        setProducts(productsData);

        // Fetch stock history
        const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stockhistory/getAllStockHistory`, {
          headers,
          credentials: 'include',
        });
        
        if (!historyResponse.ok) {
          throw new Error('Failed to fetch stock history');
        }
        
        const historyData: StockHistory[] = await historyResponse.json();
        setStockHistory(historyData);

        // Calculate dashboard metrics
        const stockMetrics = {
          totalProducts: productsData.length,
          lowStockProducts: productsData.filter((p: Product) => p.quantity <= 10).length,
          outOfStockProducts: productsData.filter((p: Product) => p.quantity === 0).length,
          totalStockValue: productsData.reduce((acc: number, p: Product) => acc + (p.price * p.quantity), 0)
        };
        setStockData(stockMetrics);

        // Calculate stock movement trends (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const movementData = last7Days.map(date => {
          const dayMovements = historyData.filter((h: StockHistory) => h.date.startsWith(date));
          const netMovement = dayMovements.reduce((net: number, movement: StockHistory) => 
            net + (movement.type === 'IN' ? movement.quantity : -movement.quantity), 0);
          return netMovement;
        });

        setStockMovementData({
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
          data: movementData
        });

      } catch (err) {
        showError('Failed to load dashboard data');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Get the most recent stock movements
  const recentStockMovements = stockHistory
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8 bg-gray-50 flex-1 overflow-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <Text className="text-gray-600 font-medium">Total Products</Text>
          <Metric>{stockData.totalProducts}</Metric>
          <div className="mt-4">
            <ProgressBar value={100} color="blue" className="mt-2" />
            <Text className="text-sm text-gray-600 mt-2">Total Inventory Items</Text>
          </div>
        </Card>

        {/* Low Stock Products Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Warning</span>
          </div>
          <Text className="text-gray-600 font-medium">Low Stock Products</Text>
          <Metric>{stockData.lowStockProducts}</Metric>
          <div className="mt-4">
            <ProgressBar 
              value={(stockData.lowStockProducts / stockData.totalProducts) * 100} 
              color="yellow" 
              className="mt-2" 
            />
            <Text className="text-sm text-gray-600 mt-2">Need Attention</Text>
          </div>
        </Card>

        {/* Out of Stock Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4m8-8v16" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">Critical</span>
          </div>
          <Text className="text-gray-600 font-medium">Out of Stock</Text>
          <Metric>{stockData.outOfStockProducts}</Metric>
          <div className="mt-4">
            <ProgressBar 
              value={(stockData.outOfStockProducts / stockData.totalProducts) * 100} 
              color="red" 
              className="mt-2" 
            />
            <Text className="text-sm text-gray-600 mt-2">Critical Level</Text>
          </div>
        </Card>

        {/* Total Stock Value Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Value</span>
          </div>
          <Text className="text-gray-600 font-medium">Total Stock Value</Text>
          <Metric>${stockData.totalStockValue.toLocaleString()}</Metric>
          <div className="mt-4">
            <ProgressBar value={100} color="green" className="mt-2" />
            <Text className="text-sm text-gray-600 mt-2">Current Inventory Value</Text>
          </div>
        </Card>
      </div>

      {/* Recent Stock Movements */}
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text className="text-xl font-semibold text-gray-800">Recent Stock Movements</Text>
            <Text className="text-sm text-gray-500 mt-1">Latest stock in/out transactions</Text>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.href = '/Dashboard/Addnewproduct'} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Product ID</th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentStockMovements.map((movement: StockHistory, index: number) => (
                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {new Date(movement.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-blue-600">
                    {movement.productId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      movement.type === 'IN' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {movement.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-right font-medium">
                    {movement.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {movement.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6 border-t pt-4">
          <Text className="text-sm text-gray-600">Showing {recentStockMovements.length} recent movements</Text>
        </div>
      </Card>
    </main>
  );
}
