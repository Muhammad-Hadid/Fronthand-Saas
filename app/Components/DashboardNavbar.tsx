"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, LogOut, ExternalLink, Copy, Check, Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { generateSubdomainUrl, generateHostsFileInstructions, HostsInstructions } from '../utils/subdomainUtils';
import { logout } from '../utils/auth';
import StoreSwitcher from './StoreSwitcher';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

type UserData = {
  first_name: string;
  last_name: string;
  email: string;
  id?: number;
  role?: string;
};

const DashboardNavbar: React.FC = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [hostsInstructions, setHostsInstructions] = useState<HostsInstructions | null>(null);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.url-modal-container') && !target.closest('.url-button')) {
        setShowUrlModal(false);
        setShowInstructions(false);
      }
      if (!target.closest('.dropdown-container') && !target.closest('.dropdown-button')) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate dynamic URL based on subdomain
  useEffect(() => {
    const subdomain = localStorage.getItem("subdomain");
    if (subdomain) {
      const url = generateSubdomainUrl(subdomain);
      const instructions = generateHostsFileInstructions(subdomain);
      setDynamicUrl(url);
      setHostsInstructions(instructions);
    } else {
      setDynamicUrl('http://localhost:3001');
      setHostsInstructions(null);
    }
  }, [showUrlModal]); // Update when modal is toggled

  // Get user data from localStorage
  useEffect(() => {
    const getUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    getUserData();
  }, []);

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dynamicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Open URL in new tab
  const openDynamicUrl = () => {
    window.open(dynamicUrl, '_blank');
  };

  // Search products
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Get tenant (subdomain) from localStorage
      const getTenant = (): string | null => {
        if (typeof window === "undefined") return null;
        
        // 1) Preferred key your app saves: "subdomain"
        const lsSub = localStorage.getItem("subdomain");
        if (lsSub && lsSub.trim()) return lsSub.trim();

        // 2) Fallbacks if you ever saved under a different key
        const lsTenant = localStorage.getItem("tenant");
        if (lsTenant && lsTenant.trim()) return lsTenant.trim();

        const lsTenantId = localStorage.getItem("tenant_id");
        if (lsTenantId && lsTenantId.trim()) return lsTenantId.trim();

        return null;
      };

      const tenant = getTenant();
      if (!tenant) {
        console.error("Tenant not found");
        return;
      }

      // Get the auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch("http://localhost:4000/product/getAllProducts", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-tenant": tenant,
          ...(token && { "Authorization": `Bearer ${token}` }), // Add auth header if token exists
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const products: Product[] = await response.json();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.category?.toLowerCase() || "").includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks
    
    setIsLoggingOut(true);
    setShowDropdown(false); // Close dropdown immediately
    
    try {
      await logout();
      
      // Use window.location instead of router.push to ensure a fresh page load
      // This prevents middleware from using cached auth state
      window.location.href = "/Login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login with full page reload
      window.location.href = "/Login";
    }
    // No need for finally block since we're redirecting
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex items-center w-1/3" ref={searchRef}>
        <div className="relative w-full">
          <Search 
            size={18} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isSearching ? 'text-blue-500 animate-spin' : 'text-gray-400'}`} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search products by name or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Search Results Dropdown */}
          {showSearchResults && (searchResults.length > 0 || searchQuery) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              {searchResults.length === 0 && searchQuery ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No products found
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      router.push(`/Dashboard/Allproducts?productId=${product.id}`);
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                        {product.category && (
                          <p className="text-xs text-gray-500">{product.category}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        <p className="text-xs text-gray-500">Stock: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Store Switcher */}
        <StoreSwitcher onStoreSwitch={(store) => {
          // Force refresh data when store is switched
          setSearchQuery("");
          setSearchResults([]);
          setShowSearchResults(false);
          
          // Update the dynamic URL for new store
          const url = generateSubdomainUrl(store.subdomain);
          const instructions = generateHostsFileInstructions(store.subdomain);
          setDynamicUrl(url);
          setHostsInstructions(instructions);
        }} />

        {/* Dynamic URL Button */}
        {dynamicUrl && (
          <div className="relative">
            <button
              onClick={() => setShowUrlModal(!showUrlModal)}
              className="url-button flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              title="Your Dynamic URL"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">My URL</span>
            </button>

            {/* URL Modal/Dropdown */}
            {showUrlModal && (
              <div className="url-modal-container absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Your Dynamic URL</h3>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Setup Instructions"
                  >
                    <Info size={16} />
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Access your dashboard at:</p>
                  <p className="font-mono text-sm text-blue-600 break-all font-semibold">{dynamicUrl}</p>
                  {hostsInstructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Subdomain: <span className="font-semibold">{hostsInstructions.subdomain}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                  <button
                    onClick={openDynamicUrl}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex-1"
                  >
                    <ExternalLink size={16} />
                    <span>Open</span>
                  </button>
                </div>

                {showInstructions && hostsInstructions && (
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Setup Instructions:</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Windows:</p>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">{hostsInstructions.instructions.windows}</pre>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Mac/Linux:</p>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">{hostsInstructions.instructions.mac}</pre>
                      </div>
                    </div>
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ After adding to hosts file, restart your browser and visit the URL above.
                    </p>
                  </div>
                )}

                {!showInstructions && (
                  <p className="text-xs text-gray-500">
                    💡 Click the info icon for setup instructions.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add New Store Button */}
        <button
          onClick={() => router.push('/CreateStore')}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          title="Create New Store"
        >
          <Plus size={16} className="flex-shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">Add Store</span>
          <span className="sm:hidden">Store</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <div 
            className="dropdown-button flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
              {userData ? 
                (userData.first_name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase() || 'U') 
                : 'A'
              }
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {userData ? 
                  (userData.first_name || userData.email?.split('@')[0] || 'User')
                  : 'Admin'
                }
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="dropdown-container absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {userData && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userData.first_name && userData.last_name ? 
                      `${userData.first_name} ${userData.last_name}` 
                      : userData.first_name || 'User'
                    }
                  </p>
                  <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;