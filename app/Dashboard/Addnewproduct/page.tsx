"use client";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import React, { useState } from "react";
import toast from 'react-hot-toast';

export default function AddNewProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    status: "available",
  });

  // Token read karna cookies se
  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  };

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getTokenFromCookies();
    if (!token) {
      toast.error('No token found. Please log in again.', {
        icon: '🔐',
      });
      return;
    }

    const tenant = localStorage.getItem("subdomain");
    if (!tenant) {
      toast.error('No tenant found. Please select a store.', {
        icon: '🏪',
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Adding new product...', {
      icon: '📦',
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/addProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant": tenant,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            status: formData.status,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Product added successfully!', {
          id: loadingToast,
          icon: '✨',
          duration: 5000,
        });
        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          quantity: "",
          status: "available",
        });
      } else {
        toast.error(data.error || 'Failed to create product', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Something went wrong. Please try again.', {
        id: loadingToast,
        icon: '⚠️',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />
      
      <div className="flex">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-4">
            {/* Breadcrumb */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Products</a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Add Product</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                  <p className="text-gray-600 text-sm">Create a new product for your inventory</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl">
              {/* Modern Toast Notifications will appear automatically */}

              {/* Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Product Information Section */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Product Information
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div className="lg:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter product name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          placeholder="e.g., Electronics, Clothing"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none bg-white"
                        >
                          <option value="available">Available</option>
                          <option value="out-of-stock">Out of Stock</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Description
                        </label>
                        <textarea
                          name="description"
                          placeholder="Describe your product..."
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Inventory Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Pricing & Inventory
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Price ($)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 font-medium">$</span>
                          </div>
                          <input
                            type="number"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          placeholder="0"
                          value={formData.quantity}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}