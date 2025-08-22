"use client";
import { useState, useEffect } from 'react';

interface StockStatus {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  zeroStockProducts: number;
  mostStockProducts: number;
}

interface PurchaseInvoice {
  date: string;
  referenceNo: string;
  vendorName: string;
  orderSubtotal: number;
  otherCharges: number;
  orderTotal: number;
}

interface DashboardData {
  stockStatus: StockStatus;
  recentPurchases: PurchaseInvoice[];
  monthlySales: {
    labels: string[];
    data: number[];
  };
  weeklyRevenue: {
    labels: string[];
    data: number[];
  };
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const stockStatusRes = await fetch('http://localhost:4000/api/stock/status');
      const salesDataRes = await fetch('http://localhost:4000/api/sales/monthly');
      const revenueDataRes = await fetch('http://localhost:4000/api/revenue/weekly');
      const purchasesRes = await fetch('http://localhost:4000/api/purchases/recent');

      const [stockStatus, salesData, revenueData, purchases] = await Promise.all([
        stockStatusRes.json(),
        salesDataRes.json(),
        revenueDataRes.json(),
        purchasesRes.json()
      ]);

      setDashboardData({
        stockStatus,
        recentPurchases: purchases,
        monthlySales: {
          labels: salesData.labels,
          data: salesData.data
        },
        weeklyRevenue: {
          labels: revenueData.labels,
          data: revenueData.data
        }
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Fetch new data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
}
