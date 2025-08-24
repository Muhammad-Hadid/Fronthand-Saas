"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from 'react-hot-toast';

type Product = {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  status: "available" | "unavailable";
};

export default function UpdateProduct() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
    status: "available",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      const tenant = getTenantFromClient();
      const token = getTokenFromCookies();
      const id = params?.id ? parseInt(params.id as string, 10) : null;

      if (!tenant || !token || !id) {
        toast.error('Missing required information', {
          icon: '⚠️'
        });
        return;
      }

      setIsLoading(true);
      const loadingToast = toast.loading('Loading product details...', {
        icon: '🔄'
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getProduct/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-tenant": tenant,
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
        toast.success('Product loaded successfully', {
          id: loadingToast,
          icon: '✨'
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details', {
          id: loadingToast,
          icon: '❌'
        });
        // Redirect back to products list if fetch fails
        setTimeout(() => router.push('/Dashboard/Allproducts'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);
  function getTokenFromCookies(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  }

  // ✅ Tenant (subdomain/localStorage se)
  function getTenantFromClient(): string | null {
    if (typeof window === "undefined") return null;
    const lsSub = localStorage.getItem("subdomain");
    if (lsSub && lsSub.trim()) return lsSub.trim();
    return null;
  }

  // Handle form submit (PUT request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tenant = getTenantFromClient();
    const token = getTokenFromCookies();
    const id = params?.id ? parseInt(params.id as string, 10) : null;

    if (!tenant || !token || !id) {
      toast.error('Missing required information. Please ensure you are logged in.', {
        icon: '⚠️'
      });
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Updating product...', {
      icon: '🔄'
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/updateProduct/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(product),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed with status ${response.status}`);
      }

      toast.success('Product updated successfully!', {
        id: loadingToast,
        icon: '✨',
        duration: 3000,
      });

      // Navigate back to products list after successful update
      setTimeout(() => {
        router.push('/Dashboard/Allproducts');
      }, 1000);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update product', {
        id: loadingToast,
        icon: '❌'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-4">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-800">Update Product</h1>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Tenant: {getTenantFromClient() || "Not Set"}
              </span>
            </div>

            {isLoading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID
                </label>
                <input
                  type="number"
                  value={params?.id || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}