"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, Check, RefreshCw } from "lucide-react";
import { useStoreSwitching } from "../hooks/useStoreSwitching";

type Store = {
  id: number;
  subdomain: string;
  store_name: string;
  city?: string;
  status?: string;
};

interface StoreSwitcherProps {
  onStoreSwitch?: (store: Store) => void;
}

export default function StoreSwitcher({ onStoreSwitch }: StoreSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const { 
    currentStore, 
    stores, 
    isLoading, 
    error, 
    switchStore, 
    refreshStores 
  } = useStoreSwitching();

  const handleStoreSwitch = async (store: Store) => {
    try {
      setIsSwitching(true);
      
      // Use the hook's switchStore function
      switchStore(store);
      
      // Close dropdown
      setIsOpen(false);

      // Call callback if provided
      if (onStoreSwitch) {
        onStoreSwitch(store);
      }

      // Force reload the dashboard to reflect new store data
      setTimeout(() => {
        router.refresh();
        router.push("/Dashboard");
      }, 100);
      
    } catch (error) {
      console.error("Error switching store:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  // Don't render if only one store, no stores, or error loading stores
  if (stores.length <= 1 && !error) {
    return null;
  }

  // If there's an error and no stores, don't render
  if (error && stores.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Store Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || isSwitching}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Building2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
          {currentStore?.store_name || "Select Store"}
        </span>
        {isLoading || isSwitching ? (
          <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
            >
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Switch Store</h3>
                <p className="text-xs text-gray-500 mt-1">Select a store to manage</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <div className="py-2">
                {stores.map((store) => {
                  const isCurrentStore = currentStore?.id === store.id;
                  
                  return (
                    <button
                      key={store.id}
                      onClick={() => handleStoreSwitch(store)}
                      disabled={isLoading || isSwitching || isCurrentStore}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group ${
                        isCurrentStore ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isCurrentStore ? "text-blue-700" : "text-gray-900"
                        }`}>
                          {store.store_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs truncate ${
                            isCurrentStore ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {store.subdomain}
                          </span>
                          {store.city && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className={`text-xs ${
                                isCurrentStore ? "text-blue-600" : "text-gray-500"
                              }`}>
                                {store.city}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isCurrentStore && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={refreshStores}
                  disabled={isLoading || isSwitching}
                  className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh stores
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
