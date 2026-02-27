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
  IoBookOutline,
  IoDocumentTextOutline,
  IoPaperPlaneOutline,
  IoSettingsOutline,
  IoGiftOutline,
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
        <div onClick={closeMenu} className="fixed top-0 left-0 w-screen h-screen z-[60] bg-black/40 backdrop-blur-[2px] transition-all" />
      )}

      {/* Sidemenu Slim */}
      <nav className={clsx(
          "fixed p-6 right-0 top-0 w-[75%] sm:w-[320px] h-screen bg-zinc-900/95 text-gray-100 z-[70] shadow-2xl transform transition-all duration-300 border-l border-white/5 overflow-y-auto",
          { "translate-x-full": !isSideMenuOpen }
        )}>
        
        {/* BUSCADOR Y CIERRE */}
        <div className="flex items-center gap-2 mt-8 mb-12">
          <div className="relative flex-1">
            <IoSearchOutline size={16} className="absolute top-2.5 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-zinc-800/50 rounded-lg pl-9 py-2 text-sm border border-zinc-700 text-white focus:outline-none focus:border-pink-500/50 transition-all"
            />
          </div>
          <button onClick={closeMenu} className="text-gray-400 hover:text-pink-500 p-1"><IoCloseOutline size={32} /></button>
        </div>

        {/* LISTA ÚNICA DE LINKS */}
        <div className="flex flex-col items-end space-y-6">
          
          {/* 1. LINKS DE USUARIO */}
          {!isAuthenticated ? (
            <Link href="/auth/login" onClick={closeMenu} className="flex items-center group">
              <span className="mr-4 text-xl font-light group-hover:text-pink-500 transition-all">Ingresar</span>
              <IoLogInOutline size={24} className="text-gray-500 group-hover:text-pink-500" />
            </Link>
          ) : (
            <>
              <Link href="/profile" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-xl font-light group-hover:text-pink-500 transition-all">Perfil</span>
                <IoPersonOutline size={24} className="text-gray-500 group-hover:text-pink-500" />
              </Link>
              <Link href="/orders" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-xl font-light group-hover:text-pink-500 transition-all">Mis Órdenes</span>
                <IoTicketOutline size={24} className="text-gray-500 group-hover:text-pink-500" />
              </Link>
            </>
          )}

          {/* 2. LINKS DE CONTENIDO (Ahora integrados a la lista) */}
          <Link href="/blog" onClick={closeMenu} className="flex items-center group">
            <span className="mr-4 text-xl font-light group-hover:text-pink-500 transition-all">Nuestro Blog</span>
            <IoBookOutline size={24} className="text-gray-500 group-hover:text-pink-500" />
          </Link>

          <Link href="/envios" onClick={closeMenu} className="flex items-center group">
            <span className="mr-4 text-xl font-light group-hover:text-pink-500 transition-all">Info Envíos</span>
            <IoPaperPlaneOutline size={24} className="text-gray-500 group-hover:text-pink-500" />
          </Link>

          {/* 3. CERRAR SESIÓN */}
          {isAuthenticated && (
            <button onClick={() => { logout(); closeMenu(); }} className="flex items-center group pt-4">
              <span className="mr-4 text-xl font-light text-gray-500 group-hover:text-red-400 transition-all">Salir</span>
              <IoLogOutOutline size={24} className="text-gray-600 group-hover:text-red-400" />
            </button>
          )}

          {/* 4. SECCIÓN ADMIN */}
          {isAdmin && (
            <div className="w-full flex flex-col items-end mt-10 pt-10 border-t border-zinc-800 space-y-5">
              <span className="text-[10px] uppercase tracking-[0.4em] text-pink-600 font-bold mb-2">Administración</span>
              
              <Link href="/admin/products" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Productos</span>
                <IoShirtOutline size={20} className="text-zinc-600 group-hover:text-pink-500" />
              </Link>
              <Link href="/admin/packs" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Packs</span>
                <IoGiftOutline size={20} className="text-zinc-600 group-hover:text-pink-500" />
              </Link>
              <Link href="/admin/orders" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Órdenes</span>
                <IoTicketOutline size={20} className="text-zinc-600 group-hover:text-pink-500" />
              </Link>
              <Link href="/admin/posts" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Blog</span>
                <IoDocumentTextOutline size={20} className="text-zinc-600 group-hover:text-pink-500" />
              </Link>
              <Link href="/admin/settings" onClick={closeMenu} className="flex items-center group">
                 <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Configuración</span>
                <IoSettingsOutline size={20} className="text-zinc-600 group-hover:text-pink-500"/>
              </Link>
              <Link href="/admin/users" onClick={closeMenu} className="flex items-center group">
                <span className="mr-4 text-sm font-light text-gray-400 group-hover:text-white transition-all">Usuarios</span>
                <IoPeopleOutline size={20} className="text-zinc-600 group-hover:text-pink-500" />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};