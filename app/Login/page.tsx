"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/Dashboard";
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Save token in cookies
      Cookies.set("token", data.token, { expires: 1 }); // 1 day

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
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 bg-red-50 border-l-4 border-red-500 p-2 rounded"
              >
                <p className="text-xs text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

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
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
                autoComplete="current-password"
                data-temp-mail-org="0"
              />
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
              <Link href="http://localhost:3000/Register" className="text-indigo-600 hover:underline">
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