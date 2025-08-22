/**
 * Utility functions for API authentication and requests
 */

/**
 * Get authentication token from cookies
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
    
  return token || null;
}

/**
 * Get tenant/subdomain from localStorage
 */
export function getTenant(): string | null {
  if (typeof window === "undefined") return null;

  // 1) Preferred key your app saves: "subdomain"
  const lsSub = localStorage.getItem("subdomain");
  if (lsSub && lsSub.trim()) return lsSub.trim();

  // 2) Fallbacks if you ever saved under a different key
  const lsTenant = localStorage.getItem("tenant");
  if (lsTenant && lsTenant.trim()) return lsTenant.trim();

  const lsTenantId = localStorage.getItem("tenant_id");
  if (lsTenantId && lsTenantId.trim()) return lsTenantId.trim();

  // 3) As a last resort, try to derive from URL (sub.domain.com)
  const host = window.location.hostname; // e.g. mona-kline.martory.com
  const parts = host.split(".");
  if (parts.length > 2) {
    return parts[0]; // "mona-kline"
  }

  return null;
}

/**
 * Create authenticated headers for API requests
 */
export function createAuthHeaders(tenant?: string): HeadersInit {
  const token = getAuthToken();
  const tenantValue = tenant || getTenant();
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (tenantValue) {
    headers['x-tenant'] = tenantValue;
  }

  return headers;
}

/**
 * Make an authenticated API request
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const tenant = getTenant();
  
  const defaultOptions: RequestInit = {
    headers: createAuthHeaders(tenant || undefined),
    credentials: 'include',
    cache: 'no-store',
    ...options,
  };

  // Merge headers if provided in options
  if (options.headers) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      ...options.headers,
    };
  }

  return fetch(url, defaultOptions);
}

/**
 * Fetch user's stores
 */
export async function fetchUserStores(): Promise<any[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    // First, try the dedicated user-stores endpoint
    const response = await fetch("http://localhost:4000/auth/user-stores", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.stores || [];
    }
  } catch (error) {
    // Silently continue to fallback
  }

  // Fallback: Try to get user profile/info which might include stores
  try {
    const profileResponse = await fetch("http://localhost:4000/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      return profileData.stores || profileData.user?.stores || [];
    }
  } catch (error) {
    // Silently continue to fallback
  }

  // Last resort: Use stored user data from login
  try {
    // Check for stores stored separately
    const storedStores = localStorage.getItem("user_stores");
    if (storedStores) {
      const stores = JSON.parse(storedStores);
      if (Array.isArray(stores) && stores.length > 0) {
        return stores;
      }
    }

    // Check user object for stores
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.stores && Array.isArray(userData.stores)) {
        return userData.stores;
      }
    }
  } catch (error) {
    // Silently continue
  }

  // If all else fails, create a minimal store object from current context
  const currentSubdomain = localStorage.getItem("subdomain");
  const currentTenantId = localStorage.getItem("tenant_id");
  
  if (currentSubdomain && currentTenantId) {
    return [{
      id: parseInt(currentTenantId),
      subdomain: currentSubdomain,
      store_name: currentSubdomain,
      city: "",
      status: "active"
    }];
  }

  return [];
}

/**
 * Switch to a different store
 */
export function switchToStore(store: { id: number; subdomain: string }) {
  localStorage.setItem("subdomain", store.subdomain);
  localStorage.setItem("tenant_id", store.id.toString());
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('storeChanged', { 
    detail: { store } 
  }));
}

/**
 * Logout function that calls the API and clears local data
 */
export async function logout(): Promise<boolean> {
  try {
    const token = getAuthToken();
    const tenant = getTenant();
    
    if (token && tenant) {
      // Call logout API
      const response = await fetch(`https://${tenant}.martory.com/api/logout`, {
        method: 'POST',
        headers: createAuthHeaders(tenant),
      });
      
      // Even if API fails, we should still clear local data
      if (!response.ok) {
        console.warn('Logout API failed, but proceeding with local cleanup');
      }
    }
  } catch (error) {
    console.error('Error calling logout API:', error);
    // Continue with cleanup even if API call fails
  }
  
  // Clear all local storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear auth cookie with all possible paths and domains
  const cookieOptions = [
    'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
    'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';',
    'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';'
  ];
  
  cookieOptions.forEach(option => {
    document.cookie = option;
  });
  
  // Force a small delay to ensure cookie clearing takes effect
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return true;
}

/**
 * Super Admin specific logout function
 */
export async function superAdminLogout(): Promise<boolean> {
  try {
    console.log('Calling Super Admin logout API...');
    
    // For httpOnly cookies, we don't need to manually get the token
    // The browser will automatically send it with credentials: 'include'
    const response = await fetch(`http://localhost:4000/superadmin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // CRUCIAL: This sends httpOnly cookies automatically
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Super Admin logout API succeeded:', data.message);
    } else {
      const errorData = await response.json();
      console.warn('Super Admin logout API failed:', errorData.message);
      console.warn('Response status:', response.status);
      // Continue with local cleanup even if API fails
    }
  } catch (error) {
    console.error('Error calling super admin logout API:', error);
    // Continue with cleanup even if API call fails
  }
  
  // Clear all local storage and session storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any remaining client-side accessible cookies (non-httpOnly)
  // Note: The main authentication cookie should be cleared by the backend API
  const cookieOptions = [
    'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
    'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
    'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  ];
  
  cookieOptions.forEach(option => {
    try {
      document.cookie = option;
    } catch (e) {
      console.log('Failed to clear client-side cookie:', option);
    }
  });
  
  console.log('Super Admin logout completed');
  return true;
}
