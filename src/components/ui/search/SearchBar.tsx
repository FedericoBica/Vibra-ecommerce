// components/ui/search/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length === 0) return;

    router.push(`/search?q=${searchTerm.trim()}`);
  };

  return (
    <form onSubmit={onSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar productos..."
        className="w-full bg-zinc-800/50 text-white pl-10 pr-4 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-pink-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IoSearchOutline 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" 
        size={20} 
      />
    </form>
  );
};