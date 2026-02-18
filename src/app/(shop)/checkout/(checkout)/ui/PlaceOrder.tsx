"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import { CouponInput } from "@/components/coupon/CouponInput";

declare global {
  interface Window {
    fbq: any;
  }
}

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const address = useAddressStore((state) => state.address);

  // Traemos la info del carrito
  const { itemsInCart, subTotal, isFreeShipping } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  
  const cart = useCartStore( state => state.cart );
  const clearCart = useCartStore( state => state.clearCart );

  //DISPARAMOS EL EVENTO CUANDO CARGA EL RESUMEN
  useEffect(() => {
    if (loaded && typeof window.fbq !== 'undefined' && cart.length > 0) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: cart.map(p => p.id),
        content_type: 'product',
        value: subTotal, // Usamos el subtotal (antes de envíos/cupones) o el finalTotal
        currency: 'UYU',
        num_items: itemsInCart
      });
    }
  }, [loaded, cart, itemsInCart, subTotal]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const shippingPrices = {
    EXPRESS: 260,
    STANDARD: 160,
    PICKUP: 60,
  };

  const lockerAddresses: Record<string, string> = {
  "Parking Euskadi": "Coronel Brandzen 2086 (Cordón)",
  "Disa Buceo": "Humberto 1ro. 3862 y Bv. José Batlle y Ordoñez",
  "Red Pagos RedRodó (Pque. Rodó)": "José Enrique Rodó 1801 esq. Gaboto",
  "Parking Catedral (Ciudad Vieja)": "Rincón 517 esq. Ituzaingo",
  "Mercado Williman": "Claudio Williman 626",
  "Ancap Brito del Pino": "Bartolito Mitre 2553 esq. Gral. Brito del Pino",
  "Ancap Servicentro Sayago": "Av. Gral. Eugenio Garzón 1028 esq. Cno. Ariel",
  "Ancap Barra de Carrasco": "Rambla Costanera s/n esq. Gral Lavalleja",
  "Disa Malvín": "Av. Italia 4763 esq. Valencia",
  "Galeria Paso Molino": "Av. Agraciada 4141",
  "Ancap Parque Posadas": "Av. Millán 3771 esq. Av. Joaquín Suarez",
  "Ancap Libertador (Centro)": "Av. Gral. Rondeau 1579",
  "MOM (Buceo)": "Luis Alberto de Herrera 1279 esq. Luis Lamas y Plácido Ellauri",
  "Farmacia Pigalle (Cordon)": "Av. 18 de Julio 2102 esq. Martin C. Martinez",
  "Farmacia Pigalle - 3 (Pocitos)": "Juan Benito Blanco 994 esq. José Martí",
  "UAM (Unidad Agroalimentaria)": "Camino Luis Eduardo Pérez 6651 (Nave Polivalente - Nave C)",
  "Parking Española (Tres Cruces)": "Palmar 2275 esq. Acevedo Díaz",
  "Parking Independencia(Ciudad Vieja)": "Florida 1440 esq. Mercedes",
  "Ancap Punto Clinicas": "Av. Italia 2905 esq. Dr. Jose Brito Foresti",
  "RedPagos - Del Parque (Parque Rodo)": "Bvr Artigas 1149 esq Maldonado",
  "Districad - Oficina Central": "Rafael Hortiguera 3830 esq. Av. Gral. San Martín",
  "Ancap Shangrilá": "Rambla Costanera s/n esq. Ecuador",
  "Ancap El Pinar": "Avda. Giannattasio Km. 28.500 esq. Av. Guillermo Perez Butler",
  "Ancap Las Piedras": "Av. Dr. Enrique Pouey 662 esq. Dr. Francisco Soca",
  "Punta Shopping": "Parada. 7 - Mansa esq. Av. Roosevelt",
};

  const baseShippingCost = shippingPrices[address.deliveryMethod] || 0;  const shippingCost = subTotal >= 2500 ? 0 : baseShippingCost;
  const subTotalWithDiscount = subTotal * (1 - discountPercent / 100);
  const discountAmount = subTotal * (discountPercent / 100);
  const finalTotal = subTotalWithDiscount + shippingCost;

  const onPlaceOrder = async() => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map( product => ({
      productId: product.id,
      quantity: product.quantity,
      color: product.color,
    }))

    // Server Action mejorada para Guest Checkout
    const resp = await placeOrder( productsToOrder, address, appliedCoupon);
    
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

{/* Lógica de Dirección/Locker */}
{ address.deliveryMethod === 'PICKUP' ? (
  <div className="text-gray-300">
    <div className="flex items-center gap-2 mb-1">
      <p className="text-xs text-gray-500 uppercase font-bold">Punto de Retiro:</p>
      <span className="text-[8px] sm:text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
        Listo en 24-48hs
      </span>
    </div>
    
    <p className="text-pink-400 font-bold text-lg leading-tight">
      📍 {address.lockerLocation}
    </p>
    {/* DIRECCIÓN FÍSICA EN LETRA CHICA */}
      {address.lockerLocation && lockerAddresses[address.lockerLocation] && (
      <p className="text-[11px] sm text-gray-400 italic font-medium ml-6 mt-0.5">
        {lockerAddresses[address.lockerLocation]}
      </p>
    )}

    {/* Bloque de Información Adicional del Punto */}
    <div className="mt-3 grid grid-cols-1 gap-2 bg-black/20 p-3 rounded-lg border border-zinc-700/30">
      <div className="flex items-start gap-2">
        <span className="text-pink-500 text-sm">🕒</span>
        <p className="text-[11px] text-gray-400 leading-snug">
          Recibirás un <strong className="text-gray-200">un email</strong> con el código QR de retiro en cuanto el paquete llegue al locker.
        </p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-pink-500 text-sm">🔑</span>
        <p className="text-[11px] text-gray-400 leading-snug">
          Tendrás <strong className="text-gray-200">4 dias</strong> para retirar tu pedido una vez depositado.
        </p>
      </div>
    </div>
    </div>
    ) : (
      <div className="text-gray-300 text-sm leading-relaxed">
        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dirección de envío:</p>
        <p className="text-gray-100">{address.address}</p>
        {address.address2 && <p className="text-gray-400 italic">{address.address2}</p>}
        <p>{address.city}, {address.departamento}</p>
      </div>
    )}        
        <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
           <span className="opacity-50">📞</span> {address.phone}
        </p>
      </div>

      <CouponInput onApply={(discount, code) => {
        setDiscountPercent(discount);
        setAppliedCoupon(code);
      }} />

      <div className="space-y-3 text-gray-300">

        {/* MOSTRAR DESCUENTO SI EXISTE */}
        {discountPercent > 0 && (
          <div className="flex justify-between text-emerald-400 text-sm font-bold italic">
            <span>Descuento ({appliedCoupon})</span>
            <span>-{currencyFormat(discountAmount)}</span>
          </div>
          )}

      {/* Resumen de Costos */}
        <div className="flex justify-between">
          <span className="text-gray-500">Productos ({itemsInCart})</span>
          <span>{currencyFormat(subTotal)}</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 text-sm">Envío ({address.deliveryMethod})</span>
          <div className="text-right">
            <span className={clsx(
              "text-sm font-black italic tracking-tight",
              isFreeShipping ? "text-emerald-400 animate-pulse" : "text-gray-200"
            )}>
              {isFreeShipping ? '¡ENVÍO GRATIS!' : `+ ${currencyFormat(shippingCost)}`}
            </span>
          </div>
        </div>

        {/* Aviso si le falta poco */}
        {!isFreeShipping && subTotal > 0 && (
          <p className="text-[10px] text-zinc-500 italic text-right bg-zinc-800/20 py-1 px-2 rounded">
            Agregá <span className="text-pink-500 font-bold">{currencyFormat(2500 - subTotal)}</span> más para envío gratis
          </p>
        )}
        <div className="h-px bg-zinc-800 my-4" />

        <div className="flex justify-between items-end">
          <span className="text-lg font-bold text-gray-100">Total</span>
          <div className="text-right">
            <span className={clsx(
              "block text-3xl font-black text-pink-500 transition-all duration-500",
              discountPercent > 0 ? "scale-110 text-emerald-400" : "" // Se agranda y cambia a verde un momento
            )}>
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