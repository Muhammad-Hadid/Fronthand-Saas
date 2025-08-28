"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { showError, showSuccess } from "@/app/utils/toast";
import React, { useState } from "react";

export default function AddStockIn() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    quantity_purchased: 0,
    unit_cost: 0,
    supplier_name: "",
    invoice_number: "",
    status: "available" as "available" | "unavailable",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Token cookies se nikalna
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

  // Handle form submit (POST request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tenant = getTenantFromClient();
    const token = getTokenFromCookies();

    if (!tenant || !token) {
      showError("Tenant or Token not found ❌");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/stockin/addStockIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant": tenant,
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed with status ${response.status}`);
      }

      showSuccess(data.message || "Stock added successfully ✅");
      setFormData({
        name: "",
        description: "",
        category: "",
        price: 0,
        quantity_purchased: 0,
        unit_cost: 0,
        supplier_name: "",
        invoice_number: "",
        status: "available",
      });
    } catch (e: any) {
      showError(e?.message || "Failed to add stock ❌");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity_purchased" || name === "unit_cost" ? Number(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-4">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6 border-b border-green-200 pb-4">
              <h1 className="text-xl font-bold text-green-800">Add Stock In</h1>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Tenant: {getTenantFromClient() || "Not Set"}
              </span>
            </div>

            {loading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Purchased
                </label>
                <input
                  type="number"
                  name="quantity_purchased"
                  value={formData.quantity_purchased}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter quantity purchased"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost
                </label>
                <input
                  type="number"
                  name="unit_cost"
                  value={formData.unit_cost}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter unit cost"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter invoice number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400"
                disabled={loading}
              >
                {loading ? "Adding Stock..." : "Add Stock"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}