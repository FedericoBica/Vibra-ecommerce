// src/app/(shop)/cart/page.tsx
import Link from 'next/link';
import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';
import { CartRecommendations } from './ui/CartRecommendations';
import { getStoreConfig } from '@/actions/config/store-config'; // <--- IMPORTANTE
import { CheckoutButton } from '@/components/cart/CheckoutButton';

export default async function CartPage() { // <--- Agregamos async

  // Leemos la configuración de envío de la base de datos
  const shippingConfig = await getStoreConfig('shipping');

  return (
    <div className="flex justify-center items-center px-4 sm:px-0 mt-1 mb-10"> {/* Bajamos el mb-72 a mb-20 */}
      <div className="flex flex-col w-full max-w-[1000px]">
        <Title title='Carrito de Compras' />

        {/* Cambiamos a flex-col en móvil y grid en desktop */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-10">
          
          {/* COLUMNA DERECHA (RESUMEN) - AHORA PRIMERO EN MÓVIL */}
          <div className="md:col-span-5 order-1 md:order-2">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-fit shadow-2xl relative overflow-hidden sticky top-5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-600/5 blur-3xl pointer-events-none" />
              <h2 className="text-2xl font-bold text-gray-100 border-b border-zinc-800 pb-4 uppercase tracking-wider">
                Resumen
              </h2>

              <div className="text-gray-300 mt-2">
                <OrderSummary threshold={shippingConfig.freeShippingThreshold} />
              </div>

              <div className="mt-6 mb-2 w-full">
                <CheckoutButton />
                  
                
                <p className="text-center text-[10px] uppercase tracking-tighter text-gray-500 mt-4">
                  Envio calculado en el siguiente paso
                </p>
              </div>
            </div>
          </div>

          {/* COLUMNA IZQUIERDA (PRODUCTOS) - SEGUNDO EN MÓVIL */}
          <div className="md:col-span-7 order-2 md:order-1 flex flex-col mt-2">
            <span className="text-xl font-bold text-gray-200">Tu selección</span>
            <Link href="/" className="text-pink-500 hover:text-pink-400 underline mb-8 text-sm transition-all">
              ¿Quieres agregar algo más? Continúa comprando
            </Link>
            <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-2 sm:p-4">
              <ProductsInCart />
            </div>
          </div>

          {/* RECOMENDACIONES - SIEMPRE AL FINAL */}
          <div className="col-span-1 md:col-span-12 order-3">
            <CartRecommendations />
          </div>
          
        </div>
      </div>
    </div>
  );
}