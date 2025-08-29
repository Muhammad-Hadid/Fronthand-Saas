"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { showError, showSuccess } from "@/app/utils/toast";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function DeleteProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  };

  const getTenantFromClient = () => {
    return localStorage.getItem("subdomain") || '';
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const tenant = getTenantFromClient();
      const token = getTokenFromCookies();

      if (!token) {
        showError("Please login first");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/deleteProduct/${params?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        }
      );

      const data = await response.json();

      if (response.ok) {
        showSuccess("Product deleted successfully");
        setTimeout(() => {
          router.push('/Dashboard/Allproducts');
        }, 1000);
      } else {
        showError(data.message || "Failed to delete product");
      }
    } catch (e: any) {
      showError(e?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static fixed top-0 left-0 z-40 h-screen
          transition-transform duration-300 ease-in-out
        `}>
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 sm:p-6 pt-20 lg:pt-6">
            <div className="max-w-2xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-md">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-red-600">Delete Product</h1>

            <div className="mb-6 text-center">
              <p className="text-base sm:text-lg mb-2">Are you sure you want to delete this product?</p>
              <p className="text-gray-600 text-sm sm:text-base">Product ID: {params?.id}</p>
            </div>

            {loading && (
              <div className="text-center text-gray-600 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                  <p className="text-sm sm:text-base">Deleting product...</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}