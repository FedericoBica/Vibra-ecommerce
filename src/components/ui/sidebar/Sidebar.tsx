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
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          // CAMBIOS AQUÍ: w-full para móvil, max-w para desktop, overflow-y-auto para poder scrollear
          "fixed p-5 right-0 top-0 w-full sm:w-[400px] h-screen bg-zinc-900 text-gray-100 z-20 shadow-2xl transform transition-all duration-300 border-l border-pink-900/20 overflow-y-auto",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        {/* Botón Cerrar - Tamaño ajustado para móvil */}
       <div className="flex justify-end mb-2">
          <button 
            onClick={closeMenu}
            className="p-2 -mr-2 text-pink-500 hover:text-white transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <IoCloseOutline size={45} />
          </button>
        </div>

        {/* Contenedor del contenido para dar espacio abajo */}
        <div className="flex flex-col h-full mt-10 pb-10">
          
          {/* Input de Búsqueda */}
          <div className="relative mt-10 mb-6">
            <IoSearchOutline size={20} className="absolute top-2.5 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-zinc-800 rounded-lg pl-10 py-2 pr-4 text-lg border-b-2 border-zinc-700 text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Menú de Usuario */}
          <div className="space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  href="/profile"
                  onClick={() => closeMenu()}
                  className="flex items-center p-3 hover:bg-pink-600/10 hover:text-pink-500 rounded-xl transition-all group"
                >
                  <IoPersonOutline size={25} className="group-hover:scale-110 transition-transform" />
                  <span className="ml-4 text-lg font-light">Perfil</span>
                </Link>

                <Link
                  href="/orders"
                  onClick={() => closeMenu()}
                  className="flex items-center p-3 hover:bg-pink-600/10 hover:text-pink-500 rounded-xl transition-all group"
                >
                  <IoTicketOutline size={25} className="group-hover:scale-110 transition-transform" />
                  <span className="ml-4 text-lg font-light">Mis Órdenes</span>
                </Link>

                <button
                  className="w-full flex items-center p-3 hover:bg-red-600/10 hover:text-red-500 rounded-xl transition-all group text-left"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <IoLogOutOutline size={25} />
                  <span className="ml-4 text-lg font-light">Salir</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                href="/auth/login"
                className="flex items-center p-3 bg-pink-600/10 text-pink-500 rounded-xl transition-all font-bold group"
                onClick={() => closeMenu()}
              >
                <IoLogInOutline size={25} />
                <span className="ml-4 text-lg">Ingresar</span>
              </Link>
            )}
          </div>

          {/* Menú Admin */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 ml-3 mb-2 block">Administración</span>
              
              <Link
                href="/admin/products"
                onClick={() => closeMenu()}
                className="flex items-center p-3 hover:bg-zinc-800 rounded-xl transition-all"
              >
                <IoShirtOutline size={25} />
                <span className="ml-4 text-lg font-light">Gestionar Productos</span>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => closeMenu()}
                className="flex items-center p-3 hover:bg-zinc-800 rounded-xl transition-all"
              >
                <IoTicketOutline size={25} />
                <span className="ml-4 text-lg font-light">Todas las Órdenes</span>
              </Link>

              <Link
                href="/admin/users"
                onClick={() => closeMenu()}
                className="flex items-center p-3 hover:bg-zinc-800 rounded-xl transition-all"
              >
                <IoPeopleOutline size={25} />
                <span className="ml-4 text-lg font-light">Usuarios</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
