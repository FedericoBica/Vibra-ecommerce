import Link from 'next/link';



import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';




export default function CartPage() {


  // redirect('/empty');



return (
    <div className="flex justify-center items-center mb-72 px-4 sm:px-0 mt-10">
      <div className="flex flex-col w-full max-w-[1000px]">
        
        <Title title='Carrito de Compras' />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Columna Izquierda: Items */}
          <div className="flex flex-col mt-5">
            <span className="text-xl font-bold text-gray-200">Tu selección</span>
            <Link href="/" className="text-pink-500 hover:text-pink-400 underline mb-8 text-sm transition-all">
              ¿Quieres agregar algo más? Continúa comprando
            </Link>
         
            {/* Lista de productos en el carrito */}
            <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-2 sm:p-4">
              <ProductsInCart />
            </div>
          </div>

          {/* Columna Derecha: Resumen de orden */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-fit shadow-2xl relative overflow-hidden">
            {/* Adorno visual sutil */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-600/5 blur-3xl pointer-events-none" />

            <h2 className="text-2xl mb-6 font-bold text-gray-100 border-b border-zinc-800 pb-4 uppercase tracking-wider">
              Resumen
            </h2>

            {/* Aquí el texto ahora sí se verá porque el fondo es zinc-900 */}
            <div className="text-gray-300">
              <OrderSummary />
            </div>

            <div className="mt-8 mb-2 w-full">
              <Link 
                className="btn-neon w-full flex justify-center py-4 rounded-xl font-bold uppercase tracking-widest transition-all"
                href="/checkout/address"
              >
                Ir al Checkout
              </Link>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Envío calculado en el siguiente paso
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}