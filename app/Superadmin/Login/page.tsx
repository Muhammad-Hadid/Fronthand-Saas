"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { API_BASE } from "@/lib/api";
import { showError, showSuccess } from "../../utils/toast";

type FormData = {
  email: string;
  password: string;
};

type ApiResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
  token: string;
};

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showError("Please enter a valid email address");
      return false;
    }
    if (!formData.password || formData.password.trim().length < 6) {
      showError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/superadmin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token in cookies with secure options
      Cookies.set("token", data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      
      // Also save token in localStorage for apiFetch function
      localStorage.setItem("token", data.token);

      // Show success message and redirect
      showSuccess("Login successful! Redirecting...");
      router.push("/Superadmin/Overview");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      >
        {/* Left side image */}
        <div className="hidden md:flex flex-col items-center justify-center bg-white p-4 md:p-6">
          <div className="relative w-full h-[400px]">
            <Image
              src="/admin.png"
              alt="Super Admin Login Illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          <Link 
            href="/Login" 
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
          >
            Login as a user
          </Link>
        </div>

        {/* Right side form */}
        <div className="p-4 md:p-6 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-indigo-900">
            Super Admin Login
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Sign in to continue</span>
            <br />
            Enter your credentials to access super admin panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoComplete="email"
                suppressHydrationWarning={true}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 rounded px-3 py-2 pr-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-900 text-white py-2 rounded text-sm hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Sign in to super admin panel"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {/* Register link */}

          </form>
        </div>
      </motion.div>
    </div>
  );
}