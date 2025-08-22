"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = Cookies.get('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // For now, just check if token exists (client-side only)
        // In production, you would verify with backend
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      // Redirect to login with the current path as redirect parameter
      if (pathname.startsWith('/Superadmin')) {
        router.push(`/Superadmin/Login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        router.push(`/Login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
