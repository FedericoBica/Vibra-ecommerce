"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

import { useUIStore } from "@/store";
import { logout } from "@/actions";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="z-[999] relative">
      {/* Overlay */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed top-0 left-0 w-screen h-screen z-[60] bg-black/40 backdrop-blur-[2px] transition-all"
        />
      )}

      {/* Sidemenu Slim */}
      <nav
        className={clsx(
          "fixed p-4 right-0 top-0 w-[75%] sm:w-[320px] h-screen bg-zinc-900/95 text-gray-100 z-[70] shadow-2xl transform transition-all duration-300 border-l border-white/5 overflow-y-auto",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        
        {/* LÍNEA SUPERIOR: Buscador + Cerrar */}
        <div className="flex items-center gap-2 mt-8 mb-10">
          <div className="relative flex-1">
            <IoSearchOutline size={16} className="absolute top-2.5 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-zinc-800/50 rounded-lg pl-9 py-2 text-sm border border-zinc-700 text-white focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-gray-600"
            />
          </div>
          
          <button 
            onClick={closeMenu}
            className="text-gray-400 hover:text-pink-500 transition-colors p-1"
          >
            <IoCloseOutline size={32} />
          </button>
        </div>

        {/* CONTENEDOR DE LINKS - Alineados a la derecha y más angostos */}
        <div className="flex flex-col items-end space-y-1">
          
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center justify-end w-2/3 p-2 hover:text-pink-500 transition-all group"
              >
                <span className="mr-3 text-sm font-light">Perfil</span>
                <IoPersonOutline size={20} className="text-gray-500 group-hover:text-pink-500" />
              </Link>

              <Link
                href="/orders"
                onClick={closeMenu}
                className="flex items-center justify-end w-2/3 p-2 hover:text-pink-500 transition-all group"
              >
                <span className="mr-3 text-sm font-light">Órdenes</span>
                <IoTicketOutline size={20} className="text-gray-500 group-hover:text-pink-500" />
              </Link>

              <button
                onClick={() => { logout(); closeMenu(); }}
                className="flex items-center justify-end w-2/3 p-2 hover:text-red-400 transition-all group"
              >
                <span className="mr-3 text-sm font-light">Salir</span>
                <IoLogOutOutline size={20} className="text-gray-500 group-hover:text-red-400" />
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="flex items-center justify-end w-2/3 p-2 text-pink-500 hover:brightness-125 transition-all font-medium mt-4 border-r-2 border-pink-500/30 pr-2"
            >
              <span className="mr-3 text-sm italic">Ingresar</span>
              <IoLogInOutline size={22} />
            </Link>
          )}

          {/* Sección Admin Slim */}
          {isAdmin && (
            <div className="w-full flex flex-col items-end mt-8 pt-6 border-t border-zinc-800/50 space-y-1">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-2 pr-2">Admin</span>
              
              <Link href="/admin/products" onClick={closeMenu} className="flex items-center justify-end w-2/3 p-2 hover:text-white transition-all">
                <span className="mr-3 text-[13px] font-light text-gray-400">Productos</span>
                <IoShirtOutline size={18} />
              </Link>

              <Link href="/admin/orders" onClick={closeMenu} className="flex items-center justify-end w-2/3 p-2 hover:text-white transition-all">
                <span className="mr-3 text-[13px] font-light text-gray-400">Órdenes</span>
                <IoTicketOutline size={18} />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};