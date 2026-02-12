"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation'; // <--- Importamos el router
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);
  
  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length === 0) return;
    
    router.push(`/search?q=${searchTerm.trim()}`);
    setSearchTerm(''); // Limpia el input después de buscar
  };

  return (
    <nav className="flex px-5 justify-between items-center w-full sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-pink-900/30 py-3">
      
      {/* Logo */}
      <div>
        <Link href="/" className="group">
          <span className={`${titleFont.className} antialiased font-bold text-2xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all`}>
            Vibra
          </span>
          <span className={`${titleFont.className} antialiased font-bold text-2xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all`}> 
             Lover
          </span>
        </Link>
      </div>

      {/* Center Menu - Espacio para el buscador */}
      <div className="hidden md:block flex-1 max-w-sm mx-10">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-zinc-900/50 border border-pink-900/20 rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-pink-500/50 focus:bg-zinc-800 transition-all"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
        </form>
      </div> 

      
      {/* Iconos - Cart, Menu */}
      <div className="flex items-center text-gray-300">
        
        {/* Lupa para móviles (solo icono que redirige o podrías hacer que despliegue el input) */}
        <button 
          onClick={() => document.getElementById('mobile-search')?.focus()}
          className="md:hidden mx-2 hover:text-pink-500 transition-colors"
        >
          <IoSearchOutline className="w-6 h-6" />
        </button>

      <Link 
        className="m-2 p-2 rounded-md transition-all hover:bg-zinc-800 text-pink-500 font-bold" 
        href="/blog"
      >
        Blog
      </Link>


        <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : "/cart"} className="mx-2 hover:text-pink-500 transition-colors">
          <div className="relative">
            { (loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute text-[10px] px-1.5 py-0.5 rounded-full font-black -top-2 -right-2 bg-pink-600 text-white shadow-[0_0_10px_#db2777]">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-6 h-6" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="ml-3 px-4 py-1.5 rounded-full bg-pink-600/10 border border-pink-500/50 text-pink-500 hover:bg-pink-600 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};