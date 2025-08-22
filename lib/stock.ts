import { apiFetch } from './api';

export type Store = {
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
};

export type StockHistory = {
  id: number;
  product_id: number;
  store_id: number;
  movement_type: string;
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type: string;
  reference_id: number | null;
  movement_date: string;
  created_by: number;
  notes: string | null;
  product?: { id: number; name: string; category: string };
  store?: { id: number; store_name: string; city: string };
};

export type MovementsRes = {
  history: StockHistory[];
  total: number;
  currentPage: number;
  totalPages: number;
};

export type StoreMovementsRes = MovementsRes & {
  store: { id: number; store_name: string; city: string };
};

export type Summary = {
  movement_type: string;
  reference_type: string;
  total_quantity: string;
  total_movements: string;
};

export type StoreSummary = {
  store_id: number;
  movement_type: string;
  total_quantity: string;
  total_movements: string;
  'store.id'?: number;
  'store.store_name'?: string;
  'store.city'?: string;
};

export type Overview = {
  summary: Summary[];
  storeSummary: StoreSummary[];
  recentMovements: StockHistory[];
};

export function getAllMovements(params?: Record<string, string | number>) {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])) : '';
  return apiFetch<MovementsRes>(`/stockoverview/getAllStockMovements${qs}`);
}

export function getStoreMovements(storeId: number, params?: Record<string, string | number>) {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])) : '';
  return apiFetch<StoreMovementsRes>(`/stockoverview/getStoreStockMovements/${storeId}${qs}`);
}

export function getStockOverviewSummary(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params) : '';
  return apiFetch<Overview>(`/stockoverview/getStockOverviewSummary${qs}`);
}

export function getAllStores() {
  return apiFetch<Store[]>('/api/getAllStores');
}

export function getStoreById(id: number) {
  return apiFetch<Store>(`/api/getStoreById/${id}`);
}

export function createStore(data: Partial<Store>) {
  return apiFetch<{ message: string; store: Store }>('/api/createStore', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStore(id: number, data: Partial<Store>) {
  return apiFetch<{ message: string; store: Store }>(`/api/updateStore/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteStore(id: number) {
  return apiFetch<{ message: string }>(`/api/deleteStore/${id}`, {
    method: 'DELETE',
  });
}


