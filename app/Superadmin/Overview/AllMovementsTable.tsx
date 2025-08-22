"use client";
import useSWR from 'swr';
import { useState } from 'react';
import SuperadminNavbar from '@/app/Components/SuperadminNavbar';
import SuperadminSidebar from '@/app/Components/SuperadminSidebar';
import { getAllMovements, getStoreMovements, MovementsRes, StoreMovementsRes } from '@/lib/stock';

export default function AllMovementsTable({ storeId, onBack }: { storeId?: number; onBack?: () => void }) {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<MovementsRes | StoreMovementsRes>(
    storeId 
      ? `/stockoverview/getStoreStockMovements/${storeId}?page=${page}`
      : `/stockoverview/getAllStockMovements?page=${page}`,
    () => storeId 
      ? getStoreMovements(storeId, { page })
      : getAllMovements({ page })
  );

  if (error) return <div className="text-red-600">Failed to load movements</div>;
  if (!data) return <div>Loading movements…</div>;

  const isStore = 'store' in data;
  const store = isStore ? (data as StoreMovementsRes).store : undefined;
  const history = data.history;
  const totalPages = data.totalPages;

  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      {store && (
        <div className="mb-2 flex items-center gap-2">
          <button className="text-blue-600 underline" onClick={onBack}>Back</button>
          <span className="font-semibold">{store.store_name} ({store.city})</span>
        </div>
      )}
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Store</th>
            <th className="px-3 py-2 text-left">Product</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {history.map((m, i) => (
            <tr key={i} className="border-b">
              <td className="px-3 py-2">{new Date(m.movement_date).toLocaleString()}</td>
              <td className="px-3 py-2">{m.store?.store_name || '-'}</td>
              <td className="px-3 py-2">{m.product?.name || '-'}</td>
              <td className="px-3 py-2">{m.movement_type}</td>
              <td className="px-3 py-2">{m.quantity_changed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
