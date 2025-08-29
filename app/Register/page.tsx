'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { showError, showSuccess } from '../utils/toast';

type FormData = {
  first_name: string;
  last_name: string;
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
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      showError('You must agree to the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      // Show success message and redirect to login page
      showSuccess('Registration successful! Please log in.');
      router.push('/Login');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unknown error occurred');
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
              alt="Register Illustration"
              fill
              className="object-fill"
              priority
            />
          </div>
        </div>

        {/* Right side form */}
        <div className="p-4 md:p-6 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-indigo-900">Create Account</h2>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Manage your inventory easily</span><br />
            Fill in your details to start using your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="text-xs font-medium text-gray-700">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  autoComplete="given-name"
                  data-temp-mail-org="0"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="text-xs font-medium text-gray-700">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  autoComplete="family-name"
                  data-temp-mail-org="0"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4"
                data-temp-mail-org="0"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to all terms and policies
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-900 text-white py-2 rounded text-sm hover:bg-indigo-800"
            >
              {isLoading ? 'Registering...' : 'Sign up'}
            </button>

            {/* Login */}
            <p className="text-xs text-gray-600 text-center mt-2">
              Already have an account?{' '}
              <Link href="/Login" className="text-indigo-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}