"use client";
import DashboardSidebar from "../../Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  ShoppingCart,
  Boxes,
  Clock
} from "lucide-react";

// Types for our reports data
type ProductAnalytics = {
  id: number;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  profitMargin: number;
  daysInStock: number;
  turnoverRate: number;
};

type CategoryPerformance = {
  category: string;
  totalProducts: number;
  totalValue: number;
  avgPrice: number;
  totalQuantity: number;
};

type RevenueAnalytics = {
  period: string;
  revenue: number;
  profit: number;
  orders: number;
  avgOrderValue: number;
};

type InventoryHealth = {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockedItems: number;
  totalValue: number;
  avgStockDays: number;
};

// Helper function to get tenant
function getTenantFromClient(): string | null {
  if (typeof window === "undefined") return null;
  
  const lsSub = localStorage.getItem("subdomain");
  if (lsSub && lsSub.trim()) return lsSub.trim();
  
  const lsTenant = localStorage.getItem("tenant");
  if (lsTenant && lsTenant.trim()) return lsTenant.trim();
  
  const lsTenantId = localStorage.getItem("tenant_id");
  if (lsTenantId && lsTenantId.trim()) return lsTenantId.trim();
  
  return null;
}

// API functions
async function fetchProducts(tenant: string): Promise<any[]> {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch("http://localhost:4000/product/getAllProducts", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant": tenant,
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchStockHistory(tenant: string): Promise<any> {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch("http://localhost:4000/stockhistory/getAllStockHistory", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant": tenant,
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stock history");
  return res.json();
}

export default function ReportsPage() {
  const [tenant, setTenant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Report data states
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [inventoryHealth, setInventoryHealth] = useState<InventoryHealth | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics[]>([]);

  // Get tenant on mount
  useEffect(() => {
    const t = getTenantFromClient();
    setTenant(t);
  }, []);

  // Function to process and analyze data
  const processReportsData = async () => {
    if (!tenant) return;

    setLoading(true);
    setError(null);

    try {
      const [products, stockData] = await Promise.all([
        fetchProducts(tenant),
        fetchStockHistory(tenant)
      ]);

      const stockHistory = stockData.history || [];

      // Process Product Analytics
      const productAnalytics: ProductAnalytics[] = products.map(product => {
        const productMovements = stockHistory.filter((h: any) => h.product_id === product.id);
        const soldQuantity = productMovements
          .filter((h: any) => h.movement_type === "stock_out")
          .reduce((sum: number, h: any) => sum + h.quantity_changed, 0);
        
        const revenue = soldQuantity * (product.price || 0);
        const profitMargin = product.price ? ((product.price - (product.cost || product.price * 0.6)) / product.price) * 100 : 0;
        
        // Calculate days in stock (simplified)
        const firstMovement = productMovements[0];
        const daysInStock = firstMovement ? 
          Math.floor((Date.now() - new Date(firstMovement.movement_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        const turnoverRate = daysInStock > 0 ? soldQuantity / (daysInStock / 30) : 0;

        return {
          id: product.id,
          name: product.name,
          category: product.category || 'Uncategorized',
          totalSold: soldQuantity,
          revenue,
          profitMargin,
          daysInStock,
          turnoverRate
        };
      });

      // Process Category Performance
      const categoryMap = new Map<string, any>();
      products.forEach(product => {
        const category = product.category || 'Uncategorized';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            totalProducts: 0,
            totalValue: 0,
            totalQuantity: 0,
            totalPrice: 0
          });
        }
        
        const catData = categoryMap.get(category);
        catData.totalProducts += 1;
        catData.totalValue += (product.price || 0) * (product.quantity || 0);
        catData.totalQuantity += product.quantity || 0;
        catData.totalPrice += product.price || 0;
      });

      const categoryPerformance: CategoryPerformance[] = Array.from(categoryMap.values()).map(cat => ({
        category: cat.category,
        totalProducts: cat.totalProducts,
        totalValue: cat.totalValue,
        avgPrice: cat.totalProducts > 0 ? cat.totalPrice / cat.totalProducts : 0,
        totalQuantity: cat.totalQuantity
      }));

      // Process Inventory Health
      const lowStockItems = products.filter(p => p.quantity < 10).length;
      const outOfStockItems = products.filter(p => p.quantity === 0).length;
      const overstockedItems = products.filter(p => p.quantity > 100).length;
      const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);
      
      const inventoryHealth: InventoryHealth = {
        totalProducts: products.length,
        lowStockItems,
        outOfStockItems,
        overstockedItems,
        totalValue,
        avgStockDays: products.length > 0 ? 
          products.reduce((sum, p) => {
            const movements = stockHistory.filter((h: any) => h.product_id === p.id);
            const firstMovement = movements[0];
            const days = firstMovement ? 
              Math.floor((Date.now() - new Date(firstMovement.movement_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
            return sum + days;
          }, 0) / products.length : 0
      };

      // Process Revenue Analytics (simplified monthly data)
      const monthlyData = new Map<string, any>();
      stockHistory.forEach((movement: any) => {
        const date = new Date(movement.movement_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            period: monthKey,
            revenue: 0,
            profit: 0,
            orders: 0,
            totalQuantity: 0
          });
        }
        
        const monthData = monthlyData.get(monthKey);
        if (movement.movement_type === "stock_out") {
          const product = products.find(p => p.id === movement.product_id);
          if (product) {
            const revenue = movement.quantity_changed * (product.price || 0);
            const profit = revenue * 0.3; // Assume 30% profit margin
            monthData.revenue += revenue;
            monthData.profit += profit;
            monthData.orders += 1;
            monthData.totalQuantity += movement.quantity_changed;
          }
        }
      });

      const revenueAnalytics: RevenueAnalytics[] = Array.from(monthlyData.values())
        .map(data => ({
          ...data,
          avgOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
        }))
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-6); // Last 6 months

      // Set all the processed data
      setProductAnalytics(productAnalytics);
      setCategoryPerformance(categoryPerformance);
      setInventoryHealth(inventoryHealth);
      setRevenueAnalytics(revenueAnalytics);
      setLastRefresh(new Date());

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  // Load data when tenant is available
  useEffect(() => {
    if (tenant) {
      processReportsData();
    }
  }, [tenant]);

  const refreshData = () => {
    processReportsData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                {tenant && (
                  <p className="text-sm text-gray-600 mt-1">
                    Store: <span className="font-medium text-blue-600">{tenant}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Last updated: {lastRefresh.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' })} PKT
                </div>
                <button
                  onClick={refreshData}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Inventory Health Overview */}
                {inventoryHealth && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Inventory Health Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Boxes className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-600 font-medium">Total Products</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{inventoryHealth.totalProducts}</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-600 font-medium">Low Stock</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-900 mt-1">{inventoryHealth.lowStockItems}</p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                          <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900 mt-1">{inventoryHealth.outOfStockItems}</p>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                          <span className="text-sm text-orange-600 font-medium">Overstocked</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-900 mt-1">{inventoryHealth.overstockedItems}</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-sm text-green-600 font-medium">Total Value</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900 mt-1">${inventoryHealth.totalValue.toFixed(2)}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="text-sm text-purple-600 font-medium">Avg Days</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{Math.round(inventoryHealth.avgStockDays)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Performance Analysis */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                      Top Product Performance
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnover Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productAnalytics
                          .sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 10)
                          .map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.totalSold}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.revenue.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-medium ${product.profitMargin > 20 ? 'text-green-600' : product.profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {product.profitMargin.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.turnoverRate.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                    Category Performance Analysis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPerformance.map((category) => (
                      <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{category.category}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Products:</span>
                            <span className="font-medium">{category.totalProducts}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Value:</span>
                            <span className="font-medium">${category.totalValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg Price:</span>
                            <span className="font-medium">${category.avgPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Quantity:</span>
                            <span className="font-medium">{category.totalQuantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Trends */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                    Revenue Trends (Last 6 Months)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Month</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Revenue</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Profit</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Orders</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Avg Order Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueAnalytics.map((period) => (
                          <tr key={period.period} className="border-b border-gray-100">
                            <td className="py-3 text-sm text-gray-900">{period.period}</td>
                            <td className="py-3 text-sm font-medium text-green-600">${period.revenue.toFixed(2)}</td>
                            <td className="py-3 text-sm font-medium text-blue-600">${period.profit.toFixed(2)}</td>
                            <td className="py-3 text-sm text-gray-900">{period.orders}</td>
                            <td className="py-3 text-sm text-gray-900">${period.avgOrderValue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
