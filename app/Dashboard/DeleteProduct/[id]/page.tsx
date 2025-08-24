"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DeleteProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  };

  const getTenantFromClient = () => {
    return localStorage.getItem("subdomain") || '';
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tenant = getTenantFromClient();
      const token = getTokenFromCookies();

      if (!token) {
        setError("Please login first");
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
        setSuccess("Product deleted successfully");
        setTimeout(() => {
          router.push('/Dashboard/Allproducts');
        }, 1000);
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <DashboardNavbar />
        <main className="p-6">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Delete Product</h1>

            <div className="mb-6 text-center">
              <p className="text-lg mb-2">Are you sure you want to delete this product?</p>
              <p className="text-gray-600">Product ID: {params?.id}</p>
            </div>

            {loading && (
              <div className="text-center text-gray-600 mb-4">
                <p>Deleting product...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}