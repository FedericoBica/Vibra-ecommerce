"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);

  // Traemos la info del carrito
  const { itemsInCart, subTotal } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  
  const cart = useCartStore( state => state.cart );
  const clearCart = useCartStore( state => state.clearCart );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const shippingPrices = {
    EXPRESS: 350,
    STANDARD: 220,
    PICKUP: 100,
  };

  const shippingCost = shippingPrices[address.deliveryMethod] || 0;
  const finalTotal = subTotal + shippingCost;

  const onPlaceOrder = async() => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map( product => ({
      productId: product.id,
      quantity: product.quantity,
      color: product.color,
    }))

    // Server Action mejorada para Guest Checkout
    const resp = await placeOrder( productsToOrder, address);
    
    if ( !resp.ok ) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    // Todo salió bien
    clearCart();
    router.replace('/orders/' + resp.order?.id );
  }

if (!loaded) return <p className="animate-pulse text-pink-500">Cargando resumen...</p>;

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 shadow-2xl">
      <h2 className="text-xl mb-4 font-bold text-gray-200 uppercase tracking-widest">Resumen de Compra</h2>
      
      {/* Sección de Entrega - Más sobria */}
      <div className="mb-8 p-5 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
        <div className="flex justify-between items-start mb-2">
           <span className="text-xs font-bold text-pink-500 uppercase tracking-tighter">Destinatario</span>
           <span className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">
             {address.deliveryMethod}
           </span>
        </div>
        
        <p className="text-lg font-semibold text-gray-100">
          {address.firstName} {address.lastName}
        </p>        
        <p className="text-gray-400 text-sm mb-3">{address.email}</p>

        <div className="h-px bg-zinc-700/50 my-3" />

        {/* Lógica de Dirección/Locker - Colores integrados */}
        { address.deliveryMethod === 'PICKUP' ? (
          <div className="text-gray-300">
            <p className="text-xs text-gray-500 uppercase font-bold">Punto de Retiro:</p>
            <p className="text-pink-400 font-medium mt-1">📍 {address.lockerLocation}</p>
          </div>
        ) : (
          <div className="text-gray-300 text-sm leading-relaxed">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dirección de envío:</p>
            <p>{address.address}</p>
            {address.address2 && <p className="text-gray-400 italic">{address.address2}</p>}
            <p>{address.city}, {address.departamento}</p>
          </div>
        )}
        
        <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
           <span className="opacity-50">📞</span> {address.phone}
        </p>
      </div>

      {/* Resumen de Costos */}
      <div className="space-y-3 text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-500">Productos ({itemsInCart})</span>
          <span>{currencyFormat(subTotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Envío</span>
          <span className="text-sm font-medium text-pink-400/80">
            {shippingCost === 0 ? 'Gratis' : `+ ${currencyFormat(shippingCost)}`}
          </span>
        </div>

        <div className="h-px bg-zinc-800 my-4" />

        <div className="flex justify-between items-end">
          <span className="text-lg font-bold text-gray-100">Total</span>
          <div className="text-right">
            <span className="block text-3xl font-black text-pink-500 drop-shadow-[0_0_10px_rgba(219,39,119,0.3)]">
              {currencyFormat(finalTotal)}
            </span>
            <span className="text-[10px] text-gray-500 uppercase">IVA Incluido</span>
          </div>
        </div>      
      </div>

      <div className="mt-8 w-full">
        { errorMessage && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 text-xs p-3 rounded-lg mb-4 animate-shake">
            { errorMessage }
          </div>
        )}

        <button
          onClick={ onPlaceOrder }
          disabled={isPlacingOrder}
          className={clsx(
            "w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all duration-300",
            isPlacingOrder 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-pink-600 text-white hover:bg-pink-500 hover:shadow-[0_0_30px_rgba(219,39,119,0.4)] active:scale-95"
          )}
        >
          { isPlacingOrder ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando
            </span>
          ) : 'Confirmar y Pagar' }
        </button>
        
        <p className="mt-4 text-[10px] text-gray-600 text-center leading-tight">
          Al confirmar, aceptas nuestros <a href="#" className="text-zinc-500 underline hover:text-pink-400">términos de venta</a> y políticas de privacidad.
        </p>
      </div>
    </div>
  );
};