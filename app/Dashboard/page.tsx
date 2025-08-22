"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import React, { useEffect, useState } from "react";

type Metric = {
  totalProducts: number;
  totalStockIn: number;
  totalStockOut: number;
  lowStockProducts: number;
  totalValue: number;
  categoryDistribution: { [key: string]: number };
  topProducts: Array<{ name: string; quantity: number }>;
};

type StockHistoryItem = {
  id: number;
  product_id: number;
  movement_type: "stock_in" | "stock_out";
  quantity_changed: number;
  movement_date: string;
  notes: string;
  product: {
    name: string;
  };
};

// --- helpers -------------------------------------------------------------

/** Safely read tenant (subdomain) from localStorage or from current host */
function getTenantFromClient(): string | null {
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
}

/** Fetch all products */
async function fetchProducts(tenant: string): Promise<any[]> {
  // Get the auth token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch("http://localhost:4000/product/getAllProducts", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant": tenant,
      ...(token && { "Authorization": `Bearer ${token}` }), // Add auth header if token exists
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

/** Fetch stock history */
async function fetchStockHistory(tenant: string): Promise<{ history: StockHistoryItem[] }> {
  // Get the auth token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch("http://localhost:4000/stockhistory/getAllStockHistory", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant": tenant,
      ...(token && { "Authorization": `Bearer ${token}` }), // Add auth header if token exists
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stock history");
  return res.json();
}

export default function Dashboard() {
  const [tenant, setTenant] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric>({
    totalProducts: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    lowStockProducts: 0,
    totalValue: 0,
    categoryDistribution: {},
    topProducts: [],
  });
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to refresh data
  const refreshData = () => {
    if (tenant) {
      setLoading(true);
      setLastRefresh(new Date());

      Promise.all([fetchProducts(tenant), fetchStockHistory(tenant)])
        .then(([products, stockHistory]) => {
          const totalProducts = products.length;
          const totalStockIn = stockHistory.history
            .filter((item) => item.movement_type === "stock_in")
            .reduce((sum, item) => sum + item.quantity_changed, 0);
          const totalStockOut = stockHistory.history
            .filter((item) => item.movement_type === "stock_out")
            .reduce((sum, item) => sum + item.quantity_changed, 0);
          const lowStockProducts = products.filter((p) => p.quantity < 10).length;

          // Calculate total stock value
          const totalValue = products.reduce((sum, product) =>
            sum + (product.price || 0) * (product.quantity || 0), 0);

          // Debug: Log the calculation details
          console.log('=== REFRESH: TOTAL STOCK VALUE CALCULATION ===');
          console.log('Total products:', products.length);
          console.log('Products with price and quantity:',
            products.filter(p => p.price > 0 && p.quantity > 0).length);

          const valueBreakdown = products
            .filter(p => p.price > 0 && p.quantity > 0)
            .map(p => ({
              name: p.name,
              price: p.price,
              quantity: p.quantity,
              value: p.price * p.quantity
            }))
            .sort((a, b) => b.value - a.value);

          console.log('Top 10 products by value:', valueBreakdown.slice(0, 10));
          console.log('Total calculated value:', totalValue);
          console.log('================================================');

          // Calculate category distribution
          const categoryDistribution = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });

          // Get top products by quantity
          const topProducts = [...products]
            .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
            .slice(0, 5)
            .map(p => ({ name: p.name, quantity: p.quantity || 0 }));

          setMetrics({
            totalProducts,
            totalStockIn,
            totalStockOut,
            lowStockProducts,
            totalValue,
            categoryDistribution,
            topProducts,
          });
          setHistory(stockHistory.history.slice(0, 5)); // Recent 5 for dashboard
        })
        .catch((e: any) => setError(e?.message || "Failed to load dashboard data"))
        .finally(() => setLoading(false));
    }
  };

  // read tenant once on mount
  useEffect(() => {
    const t = getTenantFromClient();
    setTenant(t);
  }, []);

  // fetch data when tenant available
  useEffect(() => {
    refreshData();
  }, [tenant]);

  // Listen for store changes
  useEffect(() => {
    const handleStoreChange = (event: CustomEvent) => {
      const newStore = event.detail.store;
      console.log('Store changed:', newStore);
      
      // Update tenant immediately
      setTenant(newStore.subdomain);
      
      // Reset states
      setError(null);
      setLoading(true);
      
      // Refresh data with new store
      setTimeout(() => {
        refreshData();
      }, 100);
    };

    window.addEventListener('storeChanged', handleStoreChange as EventListener);
    
    return () => {
      window.removeEventListener('storeChanged', handleStoreChange as EventListener);
    };
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!tenant) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tenant]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                {tenant && (
                  <p className="text-sm text-gray-600 mt-1">
                    Managing store: <span className="font-medium text-blue-600">{tenant}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {isClient ? `Last updated: ${lastRefresh.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' })} PKT` : 'Last updated: Loading...'}
                </div>
                <button
                  onClick={refreshData}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  Tenant: {tenant || "No Tenant"}
                </span>
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
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-500">Total Stock Value</h3>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${metrics.totalValue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Based on {metrics.totalProducts} products
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Stock Movement</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-green-600">
                        <span className="text-sm">In: </span>
                        <span className="font-bold">{metrics.totalStockIn}</span>
                      </div>
                      <div className="text-red-600">
                        <span className="text-sm">Out: </span>
                        <span className="font-bold">{metrics.totalStockOut}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Low Stock Alert</h3>
                    <p className="text-2xl font-bold text-red-600">{metrics.lowStockProducts}</p>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                    <div className="space-y-4">
                      {Object.entries(metrics.categoryDistribution).map(([category, count]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{category}</span>
                            <span>{count} items</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(count / metrics.totalProducts) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Stock</h3>
                    <div className="space-y-4">
                      {metrics.topProducts.map((product) => (
                        <div key={product.name}>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{product.name}</span>
                            <span>{product.quantity} units</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(product.quantity / (metrics.topProducts[0]?.quantity || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Stock History */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Stock History</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.movement_type === "stock_in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {item.movement_type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity_changed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.movement_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}