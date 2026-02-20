// src/app/(shop)/checkout/(checkout)/page.tsx

import Link from "next/link";
import { Title } from "@/components";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from './ui/PlaceOrder';
import { getStoreConfig } from "@/actions/config/store-config"; // <--- Importá la acción

export default async function CheckoutPage() {

  // 1. Obtenemos la configuración aquí (Server Side)
  const shippingConfig = await getStoreConfig('shipping');

  return (
    <div className="flex justify-center items-center mb-72 px-4 sm:px-0 mt-10">
      <div className="flex flex-col w-full max-w-[1100px]">
        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Columna Izquierda: Carrito */}
          <div className="flex flex-col">
            <div className="bg-zinc-900/20 p-6 rounded-2xl border border-zinc-800/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-200">Tu selección</span>
                <Link href="/cart" className="text-pink-500 hover:text-pink-400 underline text-sm transition-all">
                  Editar carrito
                </Link>
              </div>

              <ProductsInCart />
            </div>
          </div>

          {/* Columna Derecha: PlaceOrder */}
          <div className="relative">
             {/* 2. Pasamos la configuración al componente de cliente */}
             <PlaceOrder shippingConfig={shippingConfig} />
          </div>
          
        </div>
      </div>
    </div>
  );
}