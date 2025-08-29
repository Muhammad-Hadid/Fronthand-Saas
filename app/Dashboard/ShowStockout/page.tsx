"use client";
import DashboardSidebar from "../../Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { useCurrency } from "@/app/utils/currency";
import { showError } from "@/app/utils/toast";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import React, { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  quantity: number;
  store_id: number;
  status: "available" | "unavailable";
  createdAt: string;
  updatedAt: string;
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

async function fetchProducts(tenant: string): Promise<Product[]> {
  // Get the auth token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getAllProducts`, {
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

  const data = (await res.json()) as Product[];
  return data;
}

// --- page component ------------------------------------------------------

export default function ProductsPage() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [tenant, setTenant] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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

    fetchProducts(tenant)
      .then((data) => setProducts(data))
      .catch((e: any) => showError(e?.message || "Failed to load products"))
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
                <p className="text-sm md:text-base text-gray-600">Manage and organize your product inventory</p>
              </div>

              {/* Top right section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {/* Dynamic tenant display */}
                <div className="flex items-center gap-2 rounded-lg bg-white border border-blue-200 px-3 md:px-4 py-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs md:text-sm font-medium text-blue-800">
                    {tenant || "No Tenant"}
                  </span>
                </div>

                {/* Add Product button */}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/Dashboard/Addnewproduct");
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  <p className="text-gray-600 text-lg">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 8 8 8m8-16l8 8-8 8" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">No products found for tenant "{tenant}". Start by adding your first product.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  {/* Table header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="col-span-1">ID</div>
                      <div className="col-span-4">Product Details</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Quantity</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {products.map((p, index) => (
                      <div
                        key={p.id}
                        className={`grid grid-cols-12 gap-4 px-6 py-5 text-sm items-center hover:bg-yellow-50 transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* ID */}
                        <div className="col-span-1">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            #{p.id}
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="col-span-4 flex items-center">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate text-base">
                              {p.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate mt-1">
                              {p.description}
                            </div>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {p.category}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="col-span-1">
                          <div className="font-bold text-gray-900 text-base">{formatPrice(parseFloat(p.price))}</div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.quantity > 10 ? 'bg-green-400' : p.quantity > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                            <span className="font-medium text-gray-800">{p.quantity}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <div className="flex items-center justify-center">
                            <div
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                                p.status === "available"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`inline-block h-3 w-3 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
                                  p.status === "available" ? "translate-x-5" : "translate-x-1"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="text-center mt-1">
                            <span
                              className={`text-xs font-medium ${
                                p.status === "available"
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {p.status === "available" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center gap-2">
                          {/* View button */}
                          <button className="flex items-center justify-center p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {/* Stock Out button */}
                          <button
                            onClick={() => {
                              sessionStorage.setItem("selectedProductId", p.id.toString());
                              router.push("/Dashboard/AddStockOut");
                            }}
                            className="rounded-md bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-200 transition-colors"
                          >
                            Stock Out
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {products.map((p, index) => (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              #{p.id}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {p.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{p.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                          <div className="font-bold text-gray-900 text-base">{formatPrice(parseFloat(p.price))}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Quantity</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.quantity > 10 ? 'bg-green-400' : p.quantity > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                            <span className="font-medium text-gray-800">{p.quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div
                            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300 ${
                              p.status === "available" ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`inline-block h-2.5 w-2.5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
                                p.status === "available" ? "translate-x-3.5" : "translate-x-0.5"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              p.status === "available" ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {p.status === "available" ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* View button */}
                          <button className="flex items-center justify-center p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Stock Out button */}
                          <button
                            onClick={() => {
                              sessionStorage.setItem("selectedProductId", p.id.toString());
                              router.push("/Dashboard/AddStockOut");
                            }}
                            className="rounded-md bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-200 transition-colors"
                          >
                            Stock Out
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 md:px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Total products: <span className="font-bold text-gray-900">{products.length}</span>
                    </span>
                    <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs md:text-sm text-gray-600">
                        Active: {products.filter(p => p.status === "available").length}
                      </span>
                      <span className="text-xs md:text-sm text-gray-600">
                        Inactive: {products.filter(p => p.status === "unavailable").length}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
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