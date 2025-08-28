"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { superAdminLogout } from "../utils/auth";
import Cookies from "js-cookie";

export default function SuperadminNavbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug function to test the logout API directly (can be called from browser console)
  if (typeof window !== 'undefined') {
    (window as any).testSuperAdminLogout = async () => {
      console.log('Testing Super Admin logout API...');
      console.log('Current cookies before logout:', document.cookie);
      
      try {
        // Don't try to read httpOnly token, just rely on credentials: 'include'
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/superadmin/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // This will send httpOnly cookies automatically
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
        }
        
        setTimeout(() => {
          console.log('Cookies after logout:', document.cookie);
        }, 100);
        
      } catch (error) {
        console.error('Test failed:', error);
      }
    };
  }

  const handleLogout = async () => {
    try {
      console.log('=== Super Admin Logout Process Started ===');
      console.log('Current cookies before logout:', document.cookie);
      
      // Call the logout function which will hit your backend API
      await superAdminLogout();
      
      console.log('Logout API call completed');
      
      // Wait a bit for the cookie to be cleared by the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Current cookies after logout:', document.cookie);
      console.log('Redirecting to login page...');
      
      // Redirect to Super Admin login page
      window.location.href = "/Superadmin/Login";
      
    } catch (error) {
      console.error("Super Admin logout error:", error);
      
      // Emergency fallback - clear what we can locally
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error("Emergency cleanup failed:", e);
      }
      
      // Always redirect to login page regardless of errors
      window.location.href = "/Superadmin/Login";
    }
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">Super Admin Portal</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Super Admin</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Super Admin</p>
                <p className="text-xs text-gray-500">admin@system.com</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


