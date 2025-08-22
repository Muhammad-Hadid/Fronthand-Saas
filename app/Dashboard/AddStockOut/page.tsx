"use client";
import DashboardSidebar from "@/app/Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from 'jspdf';

export default function AddStockOut() {
  const [formData, setFormData] = useState({
    product_id: 0,
    quantity_sold: 0,
    unit_price: 0,
    customer_name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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

  // Set product_id from state on component mount
  useEffect(() => {
    const storedProductId = sessionStorage.getItem("selectedProductId");
    if (storedProductId) {
      setFormData((prev) => ({
        ...prev,
        product_id: parseInt(storedProductId, 10),
      }));
    } else {
      router.push("/Dashboard/ProductsPage"); // Redirect if no product_id is set
    }
  }, [router]);

  // Handle form submit (POST request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tenant = getTenantFromClient();
    const token = getTokenFromCookies();

    if (!tenant || !token) {
      setError("Tenant or Token not found ❌");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`http://localhost:4000/stockout/addStockOut`, {
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

      setSuccess(data.message || "Stock out created successfully ✅");
      
      // Generate PDF automatically after successful submission
      generatePDF();

      // Clear form data
      setFormData((prev) => ({
        ...prev,
        quantity_sold: 0,
        unit_price: 0,
        customer_name: "",
      }));
    } catch (e: any) {
      setError(e?.message || "Failed to create stock out ❌");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity_sold" || name === "unit_price" ? Number(value) : value,
    }));
  };

  const handleReset = () => {
    // Keep the product_id from session storage
    const storedProductId = sessionStorage.getItem("selectedProductId");
    
    setFormData({
      product_id: storedProductId ? parseInt(storedProductId, 10) : 0,
      quantity_sold: 0,
      unit_price: 0,
      customer_name: "",
    });
    
    // Clear messages
    setError(null);
    setSuccess(null);
    
    // Show feedback
    const timeout = setTimeout(() => {
      setSuccess("Form has been reset ✅");
      setTimeout(() => setSuccess(null), 2000);
    }, 100);
    
    return () => clearTimeout(timeout);
  };

  const handleAddMore = () => {
    router.push("/Dashboard/ShowStockout");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const totalPrice = formData.quantity_sold * formData.unit_price;
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(51, 51, 51);
    doc.text("Stock Out Receipt", 105, 20, { align: "center" });
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Date and Time
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Date: ${currentDate}`, 20, 35);
    doc.text(`Time: ${currentTime}`, 20, 42);
    
    // Customer Details Section
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("Customer Information", 20, 55);
    
    doc.setFontSize(11);
    doc.setTextColor(68, 68, 68);
    doc.text(`Name: ${formData.customer_name}`, 30, 65);
    
    // Product Details Section
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("Product Details", 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(68, 68, 68);
    doc.text(`Product ID: ${formData.product_id}`, 30, 95);
    doc.text(`Quantity: ${formData.quantity_sold} units`, 30, 103);
    doc.text(`Unit Price: $${formData.unit_price.toFixed(2)}`, 30, 111);
    
    // Add horizontal line before total
    doc.setLineWidth(0.3);
    doc.line(20, 120, 190, 120);
    
    // Total Section
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("Total Amount:", 20, 130);
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text(`$${totalPrice.toFixed(2)}`, 80, 130);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 105, 150, { align: "center" });
    
    // Save with formatted name including timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    doc.save(`stockout-receipt-${timestamp}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-4">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6 border-b border-yellow-200 pb-4">
              <h1 className="text-xl font-bold text-yellow-800">Add Stock Out</h1>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Tenant: {getTenantFromClient() || "Not Set"}
              </span>
            </div>

            {loading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-600" />
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID
                </label>
                <input
                  type="number"
                  name="product_id"
                  value={formData.product_id}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Sold
                </label>
                <input
                  type="number"
                  name="quantity_sold"
                  value={formData.quantity_sold}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter quantity sold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price
                </label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter unit price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="flex flex-col space-y-3">
                {/* Main Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 disabled:bg-yellow-400"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Stock Out"}
                  </button>
                </div>

                {/* Additional Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddMore}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add More Products
                  </button>
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Generate Receipt
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}