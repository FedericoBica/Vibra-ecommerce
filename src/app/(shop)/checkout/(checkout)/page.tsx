import Link from "next/link";

import { Title } from "@/components";
import Image from "next/image";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from './ui/PlaceOrder';

export default function CheckoutPage() {
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

              {/* Items */}
              <ProductsInCart />
            </div>
          </div>

          {/* Columna Derecha: PlaceOrder */}
          <div className="relative">
             <PlaceOrder />
          </div>
          
        </div>
      </div>
    </div>
  );
}