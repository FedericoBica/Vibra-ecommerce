"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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

      {/* Center Menu - Estilo Minimalista y Elegante */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all text-gray-300 hover:text-pink-500 hover:bg-pink-500/10 font-medium"
          href="/category/vibradores"
        >
          Vibradores
        </Link>
        {/* <Link
          className="m-2 p-2 rounded-md transition-all text-gray-300 hover:text-pink-500 hover:bg-pink-500/10 font-medium"
          href="/category/lubricantes"
        >
          Lubricantes
        </Link> */}
        <Link
          className="m-2 p-2 rounded-md transition-all text-gray-300 hover:text-pink-500 hover:bg-pink-500/10 font-medium"
          href="/category/juegos"
        >
          Juegos
        </Link>
      </div>

      {/* Iconos - Search, Cart, Menu */}
      <div className="flex items-center text-gray-300">
        {/* <Link href="/search" className="mx-2 hover:text-pink-500 transition-colors">
          <IoSearchOutline className="w-6 h-6" />
        </Link> */}

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