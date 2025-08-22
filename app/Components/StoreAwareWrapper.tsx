"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StoreAwareWrapperProps {
  children: React.ReactNode;
  onStoreChange?: (newTenant: string) => void;
}

export default function StoreAwareWrapper({ children, onStoreChange }: StoreAwareWrapperProps) {
  const router = useRouter();
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);

  useEffect(() => {
    // Get initial tenant
    const getTenant = () => {
      if (typeof window === "undefined") return null;
      
      const lsSub = localStorage.getItem("subdomain");
      if (lsSub && lsSub.trim()) return lsSub.trim();
      
      const lsTenant = localStorage.getItem("tenant");
      if (lsTenant && lsTenant.trim()) return lsTenant.trim();
      
      const lsTenantId = localStorage.getItem("tenant_id");
      if (lsTenantId && lsTenantId.trim()) return lsTenantId.trim();
      
      return null;
    };

    setCurrentTenant(getTenant());
  }, []);

  useEffect(() => {
    const handleStoreChange = (event: CustomEvent) => {
      const newStore = event.detail.store;
      const newTenant = newStore.subdomain;
      
      setCurrentTenant(newTenant);
      
      if (onStoreChange) {
        onStoreChange(newTenant);
      } else {
        // Default behavior: refresh the page
        router.refresh();
      }
    };

    window.addEventListener('storeChanged', handleStoreChange as EventListener);
    
    return () => {
      window.removeEventListener('storeChanged', handleStoreChange as EventListener);
    };
  }, [router, onStoreChange]);

  return <>{children}</>;
}
