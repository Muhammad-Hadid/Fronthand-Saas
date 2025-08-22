"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  X,
  Home,
  TrendingUp,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../utils/auth";

interface MenuItem {
  name: string;
  icon: any;
  badge?: number;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; path: string; icon?: any }[];
  shortcut?: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  id?: number;
  role?: string;
}

const DashboardSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Mock notification count
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            event.preventDefault();
            router.push("/Dashboard");
            setActiveItem("Dashboard");
            break;
          case 'i':
            event.preventDefault();
            router.push("/Dashboard/Addnewproduct");
            setActiveItem("Stock In");
            break;
          case 'o':
            event.preventDefault();
            router.push("/Dashboard/ShowStockout");
            setActiveItem("Stock Out");
            break;
          case 'r':
            event.preventDefault();
            router.push("/Dashboard/Reports");
            setActiveItem("Report");
            break;
          case 'k':
            event.preventDefault();
            const searchInput = document.querySelector('input[placeholder="Search navigation..."]') as HTMLInputElement;
            searchInput?.focus();
            break;
        }
      }
      
      // Escape to close dropdown
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSearchQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Update active item based on current path
  useEffect(() => {
    if (pathname === "/Dashboard") {
      setActiveItem("Dashboard");
    } else if (pathname === "/Dashboard/Addnewproduct") {
      setActiveItem("Stock In");
    } else if (pathname === "/Dashboard/ShowStockout") {
      setActiveItem("Stock Out");
    } else if (pathname === "/Dashboard/AllStockHistory") {
      setActiveItem("Stock History");
    } else if (pathname === "/Dashboard/Reports") {
      setActiveItem("Report");
    } else if (pathname === "/Dashboard/Settings") {
      setActiveItem("Settings");
    }
  }, [pathname]);

  const menuItems: MenuItem[] = [
    { 
      name: "Dashboard", 
      icon: LayoutDashboard, 
      shortcut: "⌘D"
    },
    { 
      name: "Products", 
      icon: Package, 
      hasDropdown: true,
      dropdownItems: [
        { name: "All Products", path: "/Dashboard/Allproducts", icon: Package },
        { name: "Add Product", path: "/Dashboard/Addnewproduct", icon: ArrowDownToLine },
      ]
    },
    { 
      name: "Stock In", 
      icon: ArrowDownToLine, 
      shortcut: "⌘I"
    },
    { 
      name: "Stock Out", 
      icon: ArrowUpFromLine, 
      shortcut: "⌘O"
    },
    { 
      name: "Stock History", 
      icon: History
    },
    { 
      name: "Report", 
      icon: FileText, 
      badge: notifications,
      shortcut: "⌘R"
    },
    { 
      name: "Settings", 
      icon: Settings
    },
  ];

  const handleClick = (item: MenuItem) => {
    if (item.hasDropdown) {
      setOpenDropdown(openDropdown === item.name ? null : item.name);
    } else {
      setActiveItem(item.name);
      setOpenDropdown(null);
      
      // Handle navigation based on menu item
      switch (item.name) {
        case "Dashboard":
          router.push("/Dashboard");
          break;
        case "Stock In":
          router.push("/Dashboard/Addnewproduct");
          break;
        case "Stock Out":
          router.push("/Dashboard/ShowStockout");
          break;
        case "Stock History":
          router.push("/Dashboard/AllStockHistory");
          break;
        case "Report":
          router.push("/Dashboard/Reports");
          break;
        case "Settings":
          router.push("/Dashboard/Settings");
          break;
        // Add other cases as needed
      }
    }
  };

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks
    
    setIsLoggingOut(true);
    
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
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shadow-lg`}>
      {/* Logo/Brand Section */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Inventory Pro
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
            />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push("/Dashboard/Addnewproduct")}
              className="p-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowDownToLine size={14} />
              Add Stock
            </button>
            <button
              onClick={() => router.push("/Dashboard/Reports")}
              className="p-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-1"
            >
              <TrendingUp size={14} />
              Reports
            </button>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item: MenuItem) => {
            const Icon = item.icon;
            const isActive: boolean = activeItem === item.name;
            const isDropdownOpen = openDropdown === item.name;

            return (
              <li key={item.name}>
                <div className="relative group">
                  <button
                    onClick={() => handleClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 relative ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    type="button"
                    title={isCollapsed ? item.name : undefined}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full"></div>
                    )}
                    
                    <div className="relative">
                      <Icon
                        size={20}
                        className={`${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} transition-colors`}
                      />
                      {/* Badge for notifications */}
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1">{item.name}</span>
                        
                        <div className="flex items-center gap-2">
                          {/* Keyboard shortcut */}
                          {item.shortcut && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.shortcut}
                            </span>
                          )}
                          
                          {/* Dropdown arrow */}
                          {item.hasDropdown && (
                            <div className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : ''}`}>
                              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && item.badge > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown for Products */}
                {item.hasDropdown && isDropdownOpen && !isCollapsed && (
                  <ul className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {item.dropdownItems?.map((dropdownItem) => {
                      const DropdownIcon = dropdownItem.icon;
                      return (
                        <li key={dropdownItem.name}>
                          <button
                            onClick={() => {
                              setActiveItem(dropdownItem.name);
                              router.push(dropdownItem.path);
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                              activeItem === dropdownItem.name
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            {DropdownIcon && <DropdownIcon size={16} />}
                            <span className="text-sm">{dropdownItem.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Empty state for search */}
        {!isCollapsed && searchQuery && filteredMenuItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No navigation items found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {userData ? 
                      (userData.first_name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase() || 'U') 
                      : 'A'
                    }
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {userData ? 
                    (userData.first_name && userData.last_name ? 
                      `${userData.first_name} ${userData.last_name}` 
                      : userData.first_name || userData.email?.split('@')[0] || 'User'
                    )
                    : 'Admin User'
                  }
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData?.email || 'admin@company.com'}
                </p>
              </div>
            </div>
            
            {/* Quick User Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/Dashboard/Settings")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="User Settings"
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign Out"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed user section */
          <div className="space-y-2">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm mx-auto">
                <span className="text-sm font-semibold text-white">
                  {userData ? 
                    (userData.first_name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase() || 'U') 
                    : 'A'
                  }
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {userData ? 
                  (userData.first_name && userData.last_name ? 
                    `${userData.first_name} ${userData.last_name}` 
                    : userData.first_name || userData.email?.split('@')[0] || 'User'
                  )
                  : 'Admin User'
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;