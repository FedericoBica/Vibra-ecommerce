// src/app/(shop)/cart/page.tsx
import Link from 'next/link';
import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';
import { CartRecommendations } from './ui/CartRecommendations';
import { getStoreConfig } from '@/actions/config/store-config'; // <--- IMPORTANTE

export default async function CartPage() { // <--- Agregamos async

  // Leemos la configuración de envío de la base de datos
  const shippingConfig = await getStoreConfig('shipping');

  return (
    <div className="flex justify-center items-center mb-72 px-4 sm:px-0 mt-10">
      <div className="flex flex-col w-full max-w-[1000px]">
        <Title title='Carrito de Compras' />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl font-bold text-gray-200">Tu selección</span>
            <Link href="/" className="text-pink-500 hover:text-pink-400 underline mb-8 text-sm transition-all">
              ¿Quieres agregar algo más? Continúa comprando
            </Link>
            <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-2 sm:p-4">
              <ProductsInCart />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-fit shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-600/5 blur-3xl pointer-events-none" />
            <h2 className="text-2xl mb-6 font-bold text-gray-100 border-b border-zinc-800 pb-4 uppercase tracking-wider">
              Resumen
            </h2>

            <div className="text-gray-300">
              {/* LE PASAMOS EL UMBRAL DE ENVÍO GRATIS AQUÍ */}
              <OrderSummary threshold={shippingConfig.freeShippingThreshold} />
            </div>

            <div className="mt-8 mb-2 w-full">
              <Link 
                className="btn-neon w-full flex justify-center py-4 rounded-xl font-bold uppercase tracking-widest transition-all text-white mt-4 bg-pink-600 border border-pink-400 shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:bg-pink-500 hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] hover:scale-[1.02] active:scale-95 ring-2 ring-pink-500/20"
                href="/checkout/address"
              >
                Siguiente
              </Link>
              <p className="text-center text-[10px] uppercase tracking-tighter text-gray-500 mt-4">
                Envío gratis superando los ${shippingConfig.freeShippingThreshold}
              </p>
            </div>
          </div>
          <CartRecommendations />
        </div>
      </div>
    </div>
  );
}