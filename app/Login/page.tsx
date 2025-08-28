"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { showError } from "@/app/utils/toast";

type FormData = {
  email: string;
  password: string;
};

type Store = {
  id: number;
  subdomain: string;
  store_name: string;
};

type ApiResponse = {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  token: string;
  stores: Store[];
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/Dashboard";
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [showStoreSelect, setShowStoreSelect] = useState(false);

  const handleStoreSelect = (store: Store) => {
    // Save store info in localStorage
    localStorage.setItem("subdomain", store.subdomain);
    localStorage.setItem("tenant_id", store.id.toString());

    // Redirect to original destination or dashboard
    router.push(redirectTo);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Save token in both cookies and localStorage
      Cookies.set("token", data.token, { expires: 1 }); // 1 day
      localStorage.setItem("token", data.token); // For apiFetch function

      // Store user info and stores for potential store switching later
      const userDataWithStores = {
        ...data.user,
        stores: data.stores || []
      };
      localStorage.setItem("user", JSON.stringify(userDataWithStores));
      
      // Also store stores separately for easy access
      if (data.stores && data.stores.length > 0) {
        localStorage.setItem("user_stores", JSON.stringify(data.stores));
      }

      // Handle stores
      if (!data.stores || data.stores.length === 0) {
        // No stores - redirect to store creation
        router.push("/CreateStore");
        return;
      }

      if (data.stores.length === 1) {
        // Auto-select the only store
        handleStoreSelect(data.stores[0]);
      } else {
        // Show store selection modal for multiple stores
        setStores(data.stores);
        setShowStoreSelect(true);
      }
    } catch (err) {
      showError(err, "Login failed. Please check your credentials and try again.");
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
          <div className="relative w-full h-full">
            <Image
              src="/admin.png"
              alt="Login Illustration"
              fill
              className="object-fill"
              priority
            />
          </div>
          <Link 
            href="/Superadmin/Login" 
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
          >
            Login as an admin
          </Link>
        </div>

        {/* Right side form */}
        <div className="p-4 md:p-6 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-indigo-900">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Sign in to continue</span>
            <br />
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-xs font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
                autoComplete="email"
                data-temp-mail-org="0"
                suppressHydrationWarning={true}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-xs font-medium text-gray-700">
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
                  className="mt-1 border border-gray-300 rounded px-3 py-2 pr-10 w-full text-sm"
                  autoComplete="current-password"
                  data-temp-mail-org="0"
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
              className="w-full bg-indigo-900 text-white py-2 rounded text-sm hover:bg-indigo-800"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {/* Register link */}
            <p className="text-xs text-gray-600 text-center mt-2">
              Don't have an account?{" "}
              <Link href="/Register" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Store Selection Modal */}
      {showStoreSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Your Store</h3>
            <div className="space-y-2">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-between group"
                >
                  <span className="text-gray-700 group-hover:text-indigo-600 font-medium">
                    {store.store_name}
                  </span>
                  <span className="text-xs text-gray-500">{store.subdomain}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
    </div>}>
      <LoginContent />
    </Suspense>
  );
}