"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchUserStores, switchToStore, getTenant } from '../utils/auth';

type Store = {
  id: number;
  subdomain: string;
  store_name: string;
  city?: string;
  status?: string;
};

interface UseStoreSwitchingReturn {
  currentStore: Store | null;
  stores: Store[];
  isLoading: boolean;
  error: string | null;
  switchStore: (store: Store) => void;
  refreshStores: () => Promise<void>;
  getCurrentTenant: () => string | null;
}

export function useStoreSwitching(): UseStoreSwitchingReturn {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current tenant from localStorage
  const getCurrentTenant = useCallback((): string | null => {
    return getTenant();
  }, []);

  // Get current store info from localStorage
  const getCurrentStoreFromStorage = useCallback(() => {
    const subdomain = localStorage.getItem("subdomain");
    const tenantId = localStorage.getItem("tenant_id");
    
    if (subdomain && tenantId) {
      const current = stores.find(store => 
        store.subdomain === subdomain || store.id.toString() === tenantId
      );
      
      if (current) {
        setCurrentStore(current);
      } else if (subdomain) {
        setCurrentStore({
          id: parseInt(tenantId || "0"),
          subdomain,
          store_name: subdomain,
        });
      }
    }
  }, [stores]);

  // Fetch user's stores
  const refreshStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userStores = await fetchUserStores();
      setStores(userStores);
      
      // If no stores found, log for debugging
      if (userStores.length === 0) {
        console.log("No stores found for user");
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      
      // More user-friendly error message
      const errorMessage = err instanceof Error ? err.message : "Failed to load stores";
      
      // Don't show error if it's just that the endpoint doesn't exist
      if (!errorMessage.includes("Failed to fetch")) {
        setError(errorMessage);
      } else {
        console.log("Store switching disabled: Backend endpoint not available");
        // Set empty stores array so component doesn't show
        setStores([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to a different store
  const switchStore = useCallback((store: Store) => {
    try {
      switchToStore(store);
      setCurrentStore(store);
    } catch (error) {
      console.error("Error switching store:", error);
      setError("Failed to switch store");
    }
  }, []);

  // Load stores on mount
  useEffect(() => {
    refreshStores();
  }, [refreshStores]);

  // Update current store when stores list changes
  useEffect(() => {
    getCurrentStoreFromStorage();
  }, [getCurrentStoreFromStorage]);

  return {
    currentStore,
    stores,
    isLoading,
    error,
    switchStore,
    refreshStores,
    getCurrentTenant,
  };
}
