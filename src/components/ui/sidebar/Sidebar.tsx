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
            "fixed p-5 right-0 top-0 w-[500px] h-screen bg-zinc-900 text-gray-100 z-20 shadow-2xl transform transition-all duration-300 border-l border-pink-900/20",
            { "translate-x-full": !isSideMenuOpen }
          )}
        >
          <IoCloseOutline
            size={50}
            className="absolute top-5 right-5 cursor-pointer text-pink-500 hover:text-pink-400"
            onClick={() => closeMenu()}
          />

          {/* Input de Búsqueda */}
          <div className="relative mt-14">
            <IoSearchOutline size={20} className="absolute top-2 left-2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-zinc-800 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-zinc-700 text-white focus:outline-none focus:border-pink-500 transition-all"
            />
          </div>

        {/* Menú */}

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl font-light">Perfil</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            onClick={() => logout()}
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-zinc-800 my-10" />

            <Link
              href="/admin/products"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-pink-600/10 hover:text-pink-500 rounded transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
