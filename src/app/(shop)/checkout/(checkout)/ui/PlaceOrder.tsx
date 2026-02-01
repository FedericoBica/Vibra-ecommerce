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

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 p-7 shadow-2xl">
      <h2 className="text-2xl mb-2 font-bold text-gray-100">Detalles de Entrega</h2>
      
      {/* Caja de dirección */}
      <div className="mb-10 p-4 bg-zinc-800/50 rounded-lg border border-pink-900/20">
        <p className="text-xl font-semibold text-pink-500">
          {address.firstName} {address.lastName}
        </p>        
        <p className="text-gray-400 italic mb-2">
          {address.email}
        </p>

        {/* Lógica para mostrar Locker o Dirección */}
        { address.deliveryMethod === 'PICKUP' ? (
          <div className="mt-2 text-blue-700">
            <p className="font-bold">Retiro en Punto Pick-up:</p>
            <p className="bg-blue-100 p-2 rounded inline-block mt-1">
              📍 {address.lockerLocation}
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="font-bold">Dirección de envío:</p>
            <p>{address.address}</p>
            <p>{address.address2}</p>
            <p>{address.city}, {address.departamento}</p>
          </div>
        )}
        
        <p className="mt-2 text-sm text-gray-500">📞 {address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-zinc-800 mb-10" />

      <h2 className="text-2xl mb-4 font-bold">Resumen de orden</h2>

      <div className="grid grid-cols-2 gap-y-2">
        <span>Artículos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 unidad" : `${itemsInCart} unidades`}
        </span>

        <span className="font-medium">Subtotal productos</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span className="text-gray-600">
          Envío ({address.deliveryMethod === 'PICKUP' ? 'Locker' : address.deliveryMethod})
        </span>
        <span className="text-right text-gray-600">{currencyFormat(shippingCost)}</span>

        <div className="col-span-2 mt-4 h-px bg-gray-200" />

        <span className="mt-4 text-2xl font-bold text-gray-100">Total:</span>
        <span className="mt-4 text-2xl text-right font-bold text-pink-500">
          {currencyFormat(finalTotal)}
        </span>      
      </div>
      <div className="mt-8 mb-2 w-full">
        <p className="mb-5 text-gray-500">
          <span className="text-xs">
           Al hacer clic en &quot;Colocar orden&quot;, confirmas que los datos de entrega son correctos y aceptas nuestros{" "}
            <a href="#" className="underline">términos de servicio</a>.
          </span>
        </p>

        { errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
            { errorMessage }
          </div>
        )}

        <button
          onClick={ onPlaceOrder }
          disabled={isPlacingOrder}
          className={
            clsx(
              "btn-neon w-full flex justify-center py-3 rounded-lg transition-all mt-5",
              {
                'btn-primary': !isPlacingOrder,
                'btn-disabled opacity-50': isPlacingOrder
              }
            )
          }
        >
          { isPlacingOrder ? 'Procesando...' : 'Colocar orden' }
        </button>
      </div>
    </div>
  );
};