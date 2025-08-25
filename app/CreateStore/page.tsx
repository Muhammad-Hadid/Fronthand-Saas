"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/Components/ProtectedRoute";

export default function CreateStore() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    store_name: "",
    admin_name: "",
    email: "",
    contact_info: "",
    cnic: "",
    store_address: "",
    city: "",
    is_active: true,
    subdomain: ""
  });

  interface FormErrors {
    store_name?: string;
    admin_name?: string;
    email?: string;
    contact_info?: string;
    cnic?: string;
    store_address?: string;
    city?: string;
    general?: string;
    [key: string]: string | undefined;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Enhanced slugify function with validation
  const slugify = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
      .replace(/\s+/g, "-") // Replace multiple spaces with single hyphen
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .substring(0, 63); // Limit to 63 characters for subdomain standards
  };

  // Validation rules
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "store_name":
        if (!value.trim()) return "Store name is required";
        if (value.trim().length < 2) return "Store name must be at least 2 characters";
        if (value.trim().length > 100) return "Store name must be less than 100 characters";
        return "";
      
      case "admin_name":
        if (!value.trim()) return "Admin name is required";
        if (value.trim().length < 2) return "Admin name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Admin name should only contain letters and spaces";
        return "";
      
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address";
        return "";
      
      case "contact_info":
        if (!value.trim()) return "Contact number is required";
        const phoneRegex = /^(\+92|0)?[0-9]{10,11}$/;
        const cleanPhone = value.replace(/[\s-]/g, "");
        if (!phoneRegex.test(cleanPhone)) return "Please enter a valid Pakistani phone number";
        return "";
      
      case "cnic":
        if (!value.trim()) return "CNIC is required";
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        if (!cnicRegex.test(value.trim())) return "CNIC format should be 12345-6789012-3";
        return "";
      
      case "store_address":
        if (!value.trim()) return "Store address is required";
        if (value.trim().length < 10) return "Please enter a complete address (minimum 10 characters)";
        return "";
      
      case "city":
        if (!value.trim()) return "City is required";
        if (value.trim().length < 2) return "Please enter a valid city name";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "City name should only contain letters and spaces";
        return "";
      
      default:
        return "";
    }
  };

  // Format CNIC input automatically
  const formatCNIC = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  // Format phone number
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("92")) return `+${numbers}`;
    if (numbers.startsWith("0")) return numbers;
    return value;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;
    let processedValue: string | boolean = type === "checkbox" ? checked : value;

    // Apply formatting for specific fields
    if (name === "cnic" && type !== "checkbox") {
      processedValue = formatCNIC(value);
    }
    if (name === "contact_info" && type !== "checkbox") {
      processedValue = formatPhone(value);
    }

    let newFormData = {
      ...formData,
      [name]: processedValue
    };

    // If store_name changes, update subdomain
    if (name === "store_name") {
      const slug = slugify(processedValue as string);
      newFormData.subdomain = slug ? `${slug}.martory.com` : "";
    }

    setFormData(newFormData);

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      "store_name", "admin_name", "email", "contact_info", 
      "cnic", "store_address", "city"
    ] as const;

    requiredFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, String(value));
      
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Additional subdomain validation
    if (!formData.subdomain || formData.subdomain === ".martory.com") {
      newErrors['store_name'] = "Store name must be valid to generate subdomain";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        store_name: formData.store_name.trim(),
        admin_name: formData.admin_name.trim(),
        email: formData.email.trim().toLowerCase(),
        city: formData.city.trim(),
        store_address: formData.store_address.trim(),
        contact_info: formData.contact_info.trim(),
        cnic: formData.cnic.trim()
      };

      // Get token from localStorage (consistent with apiFetch)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/createStore`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(submissionData)
      });

      const data = await res.json();
      
      if (res.ok) {
        // Save store ID as tenant_id and subdomain to localStorage
        if (data.store && data.store.id) {
          localStorage.setItem('tenant_id', data.store.id.toString());
          localStorage.setItem('subdomain', data.store.subdomain);
        }
        
        setSuccessMessage("Store created successfully! Redirecting to stores list...");
        // Clear form on success
        setFormData({
          store_name: "",
          admin_name: "",
          email: "",
          contact_info: "",
          cnic: "",
          store_address: "",
          city: "",
          is_active: true,
          subdomain: ""
        });
        
        // Redirect to dashboard after store creation
        setTimeout(() => {
          router.push("/Dashboard");
        }, 2000);
      } else {
        // Handle specific API errors
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        } else if (data.message && data.message.includes('duplicate')) {
          setErrors({ general: "A store with this name or email already exists" });
        } else {
          setErrors({ general: data.error || data.message || "Failed to create store" });
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
      setErrors({ 
        general: "Network error. Please check your internet connection and try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get field error
  const getFieldError = (fieldName: string) => errors[fieldName];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Store</h1>
          <p className="text-gray-600">
            Fill in the details below to register a new store in your inventory system
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-green-600 mr-2">✅</div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 mr-2">❌</div>
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 space-y-6"
        >
          {/* Store Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Store Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="store_name"
                  placeholder="Enter store name"
                  value={formData.store_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("store_name")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("store_name") && (
                  <p className="text-sm text-red-600">{getFieldError("store_name")}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Store Subdomain
                </label>
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  readOnly
                  placeholder="Auto-generated from store name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">
                  Subdomain is automatically generated from store name
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("city")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("city") && (
                  <p className="text-sm text-red-600">{getFieldError("city")}</p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Store Address *
              </label>
              <textarea
                name="store_address"
                placeholder="Enter complete store address"
                value={formData.store_address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none ${
                  getFieldError("store_address")
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              {getFieldError("store_address") && (
                <p className="text-sm text-red-600">{getFieldError("store_address")}</p>
              )}
            </div>
          </div>

          {/* Admin Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Administrator Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="admin_name"
                  placeholder="Enter admin full name"
                  value={formData.admin_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("admin_name")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("admin_name") && (
                  <p className="text-sm text-red-600">{getFieldError("admin_name")}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("email")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("email") && (
                  <p className="text-sm text-red-600">{getFieldError("email")}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contact_info"
                  placeholder="+92 300 1234567 or 03001234567"
                  value={formData.contact_info}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("contact_info")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("contact_info") && (
                  <p className="text-sm text-red-600">{getFieldError("contact_info")}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CNIC Number *
                </label>
                <input
                  type="text"
                  name="cnic"
                  placeholder="12345-6789012-3"
                  value={formData.cnic}
                  onChange={handleChange}
                  maxLength={15}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    getFieldError("cnic")
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {getFieldError("cnic") && (
                  <p className="text-sm text-red-600">{getFieldError("cnic")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Store Status */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Store Status
            </h2>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Set store as active
              </label>
              <span className="text-xs text-gray-500">
                (Active stores can process transactions)
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Store...
                </div>
              ) : (
                "Create Store"
              )}
            </button>
          </div>
        </form>
      </div>
      </div>
    </ProtectedRoute>
  );
}