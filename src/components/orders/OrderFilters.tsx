"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const OrderFilters = ({ currentStatus }: { currentStatus?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1"); // Reiniciamos a la página 1 al filtrar
    router.push(`?${params.toString()}`);
  };

  const buttons = [
    { id: "all", label: "Todos" },
    { id: "paid", label: "Pagadas" },
    { id: "not-paid", label: "No Pagadas" },
  ];

  return (
    <div className="flex gap-2 mb-6 p-1 bg-zinc-900 w-fit rounded-xl border border-zinc-800">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => onStatusChange(btn.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentStatus === btn.id || (!currentStatus && btn.id === "all")
              ? "bg-pink-600 text-white shadow-lg shadow-pink-900/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};