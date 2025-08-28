"use client";
import DashboardSidebar from "../../Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import ProtectedRoute from "@/app/Components/ProtectedRoute";
import { useCurrency } from "@/app/utils/currency";
import { showError } from "@/app/utils/toast";
import { useRouter } from "next/navigation";

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Dashboard Navbar */}
        <DashboardNavbar />

        <div className="flex">
          {/* Dashboard Sidebar */}
          <DashboardSidebar />

          {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
                <p className="text-gray-600">Manage and organize your product inventory</p>
              </div>

              {/* Top right section */}
              <div className="flex items-center gap-4">
                {/* Dynamic tenant display */}
                <div className="flex items-center gap-2 rounded-lg bg-white border border-blue-200 px-4 py-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-blue-800">
                    {tenant || "No Tenant"}
                  </span>
                </div>

                {/* Add Product button */}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/Dashboard/Addnewproduct");
                  }}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                  {products.map((p, index) => (
                    <div
                      key={p.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-5 text-sm items-center hover:bg-blue-50 transition-colors duration-150 ${
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
                        <button className="flex items-center justify-center p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
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

                        {/* Update button */}
                        <button
                          onClick={() => {
                            router.push(`/Dashboard/UpdateStore/${p.id}`);
                          }}
                          className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            router.push(`/Dashboard/DeleteProduct/${p.id}`);
                          }}
                          className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>

                        {/* More options */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer summary */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      Total products: <span className="font-bold text-gray-900">{products.length}</span>
                    </span>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <span className="text-sm text-gray-600">
                      Active: {products.filter(p => p.status === "available").length}
                    </span>
                    <span className="text-sm text-gray-600">
                      Inactive: {products.filter(p => p.status === "unavailable").length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}