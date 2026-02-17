"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoCartOutline, IoCloseOutline } from "react-icons/io5"; // Agregamos IoCloseOutline
import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);
  
  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false); // <--- Nuevo estado
  const router = useRouter();

  useEffect(() => { setLoaded(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length === 0) return;
    router.push(`/search?q=${searchTerm.trim()}`);
    setSearchTerm('');
    setIsSearchOpen(false); // Cerramos el buscador tras buscar
  };

  return (
    <nav className="flex px-5 justify-between items-center w-full sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-pink-900/30 py-3">
      
      {/* 1. Logo (Se oculta en móvil si el buscador está abierto para ganar espacio) */}
      <div className={isSearchOpen ? 'hidden md:block' : 'block'}>
        <Link href="/" className="group">
          <span className={`${titleFont.className} antialiased font-bold text-2xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent`}>
            Vibra Lover
          </span>
        </Link>
      </div>

      {/* 2. Buscador Central (Desktop) y Expandible (Mobile) */}
      <div className={`
        ${isSearchOpen ? 'flex' : 'hidden md:block'} 
        flex-1 max-w-sm mx-4 transition-all duration-300
      `}>
        <form onSubmit={handleSearch} className="relative w-full group">
          <input
            type="text"
            autoFocus={isSearchOpen} // Auto-focus al abrir en móvil
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-zinc-900/50 border border-pink-900/20 rounded-full py-1.5 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-pink-500/50 focus:bg-zinc-800 transition-all"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          
          {/* Botón para cerrar buscador en móvil */}
          {isSearchOpen && (
            <button 
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <IoCloseOutline size={20} />
            </button>
          )}
        </form>
      </div> 

      {/* 3. Iconos Derecha */}
      <div className="flex items-center text-gray-300">
        
        {/* Lupa para móviles (Togle buscador) */}
        {!isSearchOpen && (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden mx-2 hover:text-pink-500 transition-colors"
          >
            <IoSearchOutline className="w-6 h-6" />
          </button>
        )}

        <Link 
          href="/blog" 
          className="hidden md:block mx-4 text-sm font-bold uppercase tracking-widest text-pink-500 hover:text-pink-400 transition-colors"
        >
          Blog
        </Link>

        {/* Carrito e Icono Menú (Se ocultan en móvil si el buscador está abierto para dejar espacio al input) */}
        <div className={`flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
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
            className="ml-3 px-4 py-1.5 rounded-full bg-pink-600/10 border border-pink-500/50 text-pink-500 hover:bg-pink-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            Menú
          </button>
        </div>
      </div>
    </nav>
  );
};