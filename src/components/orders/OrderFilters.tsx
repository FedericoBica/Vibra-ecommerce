// src/components/orders/OrderFilters.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export const OrderFilters = ({ currentStatus }: { currentStatus?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Filtro de Pago */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
        {['all', 'paid', 'not-paid'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter('status', s)}
            className={`px-3 py-1 text-xs rounded-md transition ${
              (currentStatus === s || (!currentStatus && s === 'all'))
                ? 'bg-pink-600 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {s === 'all' ? 'Todos' : s === 'paid' ? 'Pagados' : 'Pendientes'}
          </button>
        ))}
      </div>

      {/* Filtro de Envío (NUEVO!) */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
        {[
          { id: 'all', label: 'Todos los envíos' },
          { id: 'PICKUP', label: 'Locker' },
          { id: 'STANDARD', label: 'Domicilio' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setFilter('delivery', m.id)}
            className={`px-3 py-1 text-xs rounded-md transition ${
              searchParams.get('delivery') === m.id || (!searchParams.get('delivery') && m.id === 'all')
                ? 'bg-zinc-700 text-white font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};