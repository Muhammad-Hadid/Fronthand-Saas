"use client";
import DashboardSidebar from "../../Components/DashboardSidebar";
import DashboardNavbar from "@/app/Components/DashboardNavbar";
import { useEffect, useState } from "react";
import { 
  User, 
  Building, 
  Palette, 
  Save,
  Eye,
  Check,
  AlertCircle
} from "lucide-react";

// Types
type UserData = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
};

type StoreData = {
  id?: number;
  store_name: string;
  address?: string;
  phone?: string;
  city?: string;
  subdomain?: string;
};

type DisplaySettings = {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
};

// Helper function to get tenant
function getTenantFromClient(): string | null {
  if (typeof window === "undefined") return null;
  
  const lsSub = localStorage.getItem("subdomain");
  if (lsSub && lsSub.trim()) return lsSub.trim();
  
  return null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'display'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // User Profile Data
  const [userData, setUserData] = useState<UserData>({
    first_name: '',
    last_name: '',
    email: ''
  });

  // Store Data
  const [storeData, setStoreData] = useState<StoreData>({
    store_name: '',
    address: '',
    phone: ''
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: 'light',
    language: 'English',
    currency: 'USD'
  });

  const [tenant, setTenant] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data on mount
  useEffect(() => {
    const t = getTenantFromClient();
    setTenant(t);
    loadUserData();
    loadStoreData();
    loadDisplaySettings();
    setMounted(true);
  }, []);

  // Apply theme when displaySettings change
  useEffect(() => {
    if (mounted && displaySettings.theme) {
      if (displaySettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [displaySettings.theme, mounted]);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          role: user.role
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadStoreData = () => {
    try {
      // For now, use basic store info from localStorage
      const subdomain = localStorage.getItem("subdomain");
      const tenantId = localStorage.getItem("tenant_id");
      
      setStoreData({
        id: tenantId ? parseInt(tenantId) : undefined,
        store_name: subdomain || 'My Store',
        address: '', // Could be fetched from API
        phone: '',   // Could be fetched from API
        subdomain: subdomain || ''
      });
    } catch (error) {
      console.error("Error loading store data:", error);
    }
  };

  const loadDisplaySettings = () => {
    try {
      const savedSettings = localStorage.getItem("display_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDisplaySettings(settings);
      }
    } catch (error) {
      console.error("Error loading display settings:", error);
    }
  };

  const saveDisplaySettings = () => {
    setLoading(true);
    try {
      localStorage.setItem("display_settings", JSON.stringify(displaySettings));
      
      // Apply theme immediately
      if (displaySettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setMessage({ type: 'success', text: 'Display settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save display settings.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'store', label: 'Store Information', icon: Building },
    { id: 'display', label: 'Display Preferences', icon: Palette }
  ];

  const languages = [
    { code: 'English', name: 'English' },
    { code: 'Spanish', name: 'Español' },
    { code: 'French', name: 'Français' },
    { code: 'German', name: 'Deutsch' },
    { code: 'Urdu', name: 'اردو' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'PKR', name: 'Pakistani Rupee (₨)', symbol: '₨' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                {tenant && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Store: <span className="font-medium text-blue-600 dark:text-blue-400">{tenant}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* User Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Profile</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">View your personal information. Contact admin to make changes.</p>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            value={userData.first_name}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={userData.last_name}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={userData.email}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>

                      {userData.role && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                          <input
                            type="text"
                            value={userData.role}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="w-4 h-4 inline mr-1" />
                          This information is read-only. Contact your administrator to make changes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Store Information Tab */}
                {activeTab === 'store' && (
                  <div className="max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Information</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">View your store details. Contact admin to make changes.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
                        <input
                          type="text"
                          value={storeData.store_name}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Address</label>
                        <textarea
                          value={storeData.address || 'Not specified'}
                          readOnly
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={storeData.phone || 'Not specified'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>

                      {storeData.subdomain && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Subdomain</label>
                          <input
                            type="text"
                            value={storeData.subdomain}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="w-4 h-4 inline mr-1" />
                          Store information is read-only. Contact your administrator to make changes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Preferences Tab */}
                {activeTab === 'display' && (
                  <div className="max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Preferences</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Customize how the dashboard looks and feels.</p>
                    
                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="theme"
                              value="light"
                              checked={displaySettings.theme === 'light'}
                              onChange={(e) => setDisplaySettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
                              className="mr-2 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Light Mode</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="theme"
                              value="dark"
                              checked={displaySettings.theme === 'dark'}
                              onChange={(e) => setDisplaySettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
                              className="mr-2 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                          </label>
                        </div>
                      </div>

                      {/* Language Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                        <select
                          value={displaySettings.language}
                          onChange={(e) => setDisplaySettings(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Currency Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                        <select
                          value={displaySettings.currency}
                          onChange={(e) => setDisplaySettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Save Button */}
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={saveDisplaySettings}
                          disabled={loading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
