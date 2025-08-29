"use client";
import DashboardSidebar from "../../Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { showError } from "@/app/utils/toast";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
};

type StockHistoryItem = {
  id: number;
  product_id: number;
  store_id: number;
  movement_type: "stock_in" | "stock_out";
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type: string;
  reference_id: number;
  movement_date: string;
  created_by: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

type StockHistoryResponse = {
  history: StockHistoryItem[];
  total: number;
  currentPage: number;
  totalPages: number;
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

async function fetchStockHistory(tenant: string): Promise<StockHistoryResponse> {
  // Get the auth token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stockhistory/getAllStockHistory`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant": tenant, // <-- important
      ...(token && { "Authorization": `Bearer ${token}` }), // Add auth header if token exists
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as StockHistoryResponse;
  return data;
}

// --- page component ------------------------------------------------------

export default function StockHistory() {
  const router = useRouter();
  const [tenant, setTenant] = useState<string | null>(null);
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // read tenant once on mount
  useEffect(() => {
    const t = getTenantFromClient();
    setTenant(t);
  }, []);

  // fetch when tenant available
  useEffect(() => {
    if (!tenant) {
      setLoading(false);
      // Only show error after a delay to avoid flashing error on initial load
      const timeoutId = setTimeout(() => {
        if (!getTenantFromClient()) {
          showError("Tenant (subdomain) not found in localStorage or URL.");
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }

    setLoading(true);

    fetchStockHistory(tenant)
      .then((data) => setHistory(data.history))
      .catch((e: any) => showError(e?.message || "Failed to load stock history"))
      .finally(() => setLoading(false));
  }, [tenant]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-64 h-full">
              <DashboardSidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 md:ml-0">
          <div className="p-3 md:p-6 pt-16 md:pt-6">
            {/* Header */}
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Stock History</h1>
                <p className="text-sm md:text-base text-gray-600">View the complete history of stock movements</p>
              </div>

              {/* Top right section */}
              <div className="flex items-center gap-4">
                {/* Dynamic tenant display */}
                <div className="flex items-center gap-2 rounded-lg bg-white border border-blue-200 px-3 md:px-4 py-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs md:text-sm font-medium text-blue-800">
                    {tenant || "No Tenant"}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  <p className="text-gray-600 text-lg">Loading stock history...</p>
                </div>
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 8 8 8m8-16l8 8-8 8" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stock history found</h3>
                <p className="text-gray-600">No stock movements recorded for tenant "{tenant}".</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  {/* Table header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="col-span-1">ID</div>
                      <div className="col-span-2">Product</div>
                      <div className="col-span-1">Movement Type</div>
                      <div className="col-span-1">Qty Changed</div>
                      <div className="col-span-1">Prev Qty</div>
                      <div className="col-span-1">New Qty</div>
                      <div className="col-span-1">Ref Type</div>
                      <div className="col-span-1">Ref ID</div>
                      <div className="col-span-2">Movement Date</div>
                      <div className="col-span-1">Notes</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {history.map((item, index) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-12 gap-4 px-6 py-5 text-sm items-center ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* ID */}
                        <div className="col-span-1">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            #{item.id}
                          </span>
                        </div>

                        {/* Product */}
                        <div className="col-span-2">
                          <div className="font-semibold text-gray-900 truncate text-base">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate mt-1">
                            {item.product.category}
                          </div>
                        </div>

                        {/* Movement Type */}
                        <div className="col-span-1">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.movement_type === "stock_in" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.movement_type === "stock_in" ? "In" : "Out"}
                          </span>
                        </div>

                        {/* Quantity Changed */}
                        <div className="col-span-1">
                          <div className="font-medium text-gray-800">{item.quantity_changed}</div>
                        </div>

                        {/* Previous Quantity */}
                        <div className="col-span-1">
                          <div className="font-medium text-gray-800">{item.previous_quantity}</div>
                        </div>

                        {/* New Quantity */}
                        <div className="col-span-1">
                          <div className="font-medium text-gray-800">{item.new_quantity}</div>
                        </div>

                        {/* Reference Type */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-600">{item.reference_type}</span>
                        </div>

                        {/* Reference ID */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-600">#{item.reference_id}</span>
                        </div>

                        {/* Movement Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-600">
                            {new Date(item.movement_date).toLocaleString()}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="col-span-1">
                          <div className="text-sm text-gray-500 truncate">
                            {item.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              #{item.id}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.movement_type === "stock_in" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {item.movement_type === "stock_in" ? "Stock In" : "Stock Out"}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.category}</p>
                        </div>
                      </div>

                      {/* Quantity Information */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Changed</span>
                          <div className="font-bold text-gray-900">{item.quantity_changed}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Previous</span>
                          <div className="font-medium text-gray-700">{item.previous_quantity}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">New</span>
                          <div className="font-medium text-gray-700">{item.new_quantity}</div>
                        </div>
                      </div>

                      {/* Reference Information */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Reference</span>
                          <div className="text-sm text-gray-600">{item.reference_type} #{item.reference_id}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Date</span>
                          <div className="text-sm text-gray-600">
                            {new Date(item.movement_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {item.notes && (
                        <div className="pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Notes</span>
                          <div className="text-sm text-gray-600 mt-1">{item.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 md:px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Total records: <span className="font-bold text-gray-900">{history.length}</span>
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
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