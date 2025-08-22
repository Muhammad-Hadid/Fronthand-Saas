import useSWR from 'swr';
import { apiFetch } from '@/lib/api';

// Types
export interface Store {
  id: number;
  store_name: string;
  admin_name: string;
  email: string;
  contact_info: string;
  cnic: string;
  store_address: string;
  city: string;
  subdomain: string;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: number;
  store_id: number;
  product_id: number;
  movement_type: 'in' | 'out';
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  movement_date: string;
  reference_type: string;
  reference_id: number;
  store: {
    id: number;
    store_name: string;
    city: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
}

export interface StockSummary {
  summary: Array<{
    movement_type: string;
    reference_type: string;
    total_quantity: string;
    total_movements: string;
  }>;
  storeSummary: Array<{
    store_id: number;
    movement_type: string;
    total_quantity: string;
    total_movements: string;
    store?: {
      id: number;
      store_name: string;
      city: string;
    };
  }>;
  recentMovements: StockMovement[];
}

export interface StockMovementsResponse {
  history: StockMovement[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// Custom Hooks
export const useStores = () => {
  const { data, error, mutate, isLoading } = useSWR<Store[]>('/api/getAllStores', apiFetch);
  
  return {
    stores: data,
    isLoading,
    error,
    mutate,
    // Computed values
    totalStores: data?.length || 0,
    activeStores: data?.filter(store => store.is_active).length || 0,
    inactiveStores: data?.filter(store => !store.is_active).length || 0,
  };
};

export const useStockSummary = (params?: { start_date?: string; end_date?: string }) => {
  const queryString = params ? `?${new URLSearchParams(params)}` : '';
  const { data, error, mutate, isLoading } = useSWR<StockSummary>(
    `/stockoverview/getStockOverviewSummary${queryString}`,
    apiFetch
  );
  
  return {
    summary: data,
    isLoading,
    error,
    mutate,
    // Computed values
    totalStockIn: data?.summary?.find(s => s.movement_type === 'in')?.total_quantity || '0',
    totalStockOut: data?.summary?.find(s => s.movement_type === 'out')?.total_quantity || '0',
    totalMovements: data?.summary?.reduce((acc, s) => acc + Number(s.total_movements), 0) || 0,
    recentMovements: data?.recentMovements || [],
  };
};

export const useStockMovements = (params: {
  page?: number;
  limit?: number;
  store_id?: string;
  movement_type?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );
  
  const { data, error, mutate, isLoading } = useSWR<StockMovementsResponse>(
    `/stockoverview/getAllStockMovements?${queryString}`,
    apiFetch
  );
  
  return {
    movements: data,
    isLoading,
    error,
    mutate,
  };
};

export const useStoreMovements = (storeId: number, params?: {
  page?: number;
  limit?: number;
  movement_type?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const queryString = params ? `?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  )}` : '';
  
  const { data, error, mutate, isLoading } = useSWR<StockMovementsResponse>(
    `/stockoverview/getStoreStockMovements/${storeId}${queryString}`,
    apiFetch
  );
  
  return {
    movements: data,
    isLoading,
    error,
    mutate,
  };
};

// API Functions
export const storeAPI = {
  create: async (storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt' | 'subdomain'>) => {
    return apiFetch('/api/createStore', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  },
  
  update: async (id: number, storeData: Partial<Omit<Store, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return apiFetch(`/api/updateStore/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  },
  
  delete: async (id: number) => {
    return apiFetch(`/api/deleteStore/${id}`, {
      method: 'DELETE',
    });
  },
  
  getById: async (id: number): Promise<Store> => {
    return apiFetch(`/api/getStoreById/${id}`);
  },
};

// Utility functions
export const calculateGrowthRate = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const getDateRange = (days: number): { start_date: string; end_date: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start_date: start.toISOString().split('T')[0],
    end_date: end.toISOString().split('T')[0],
  };
};
