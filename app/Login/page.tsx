'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  email: string;
  password: string;
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
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Save token in cookies
      Cookies.set('token', data.token, { expires: 1 }); // 1 day

      // Redirect
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
        <div className="hidden md:flex items-center justify-center bg-white p-4 md:p-6">
          <div className="relative w-full h-full">
            <Image
              src="/admin.png"
              alt="Login Illustration"
              fill
              className="object-fill"
              priority
            />
          </div>
        </div>

        {/* Right side form */}
        <div className="p-4 md:p-6 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-indigo-900">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Sign in to continue</span><br />
            Enter your credentials to access your account.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
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
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-900 text-white py-2 rounded text-sm hover:bg-indigo-800"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Register link */}
            <p className="text-xs text-gray-600 text-center mt-2">
              Don’t have an account?{' '}
              <Link href="http://localhost:3000/Register" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
