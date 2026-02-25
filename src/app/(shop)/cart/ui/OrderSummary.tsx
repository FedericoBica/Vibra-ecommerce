"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

interface Props {
  threshold: number; // Viene de la DB (admin panel)
}

export const OrderSummary = ({ threshold }: Props) => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  
  // 1. Extraemos todo del store, pasándole el threshold dinámico
  const { itemsInCart, subTotal, amountToFreeShipping, isFreeShipping } = useCartStore((state) =>
    state.getSummaryInformation(threshold)
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if ( itemsInCart === 0 && loaded === true )   {
      router.replace('/empty')
    }
  },[ itemsInCart, loaded, router ])

  if (!loaded) return <p className="animate-pulse text-pink-500">Cargando resumen...</p>;

  return (
    <div className="grid grid-cols-2 gap-y-3">

      <span className="text-gray-400">Subtotal</span>
      <span className="text-right text-gray-200">{currencyFormat(subTotal)}</span>

      <div className="col-span-2 h-px bg-zinc-800 my-2" />

      <span className="text-xl font-bold text-gray-100">Total:</span>
      <span className="text-xl text-right font-bold text-pink-500">
        {currencyFormat(subTotal)}
      </span>

      {/* Usamos amountToFreeShipping que ya calculó el store */}
      <div className="col-span-2 mt-2">
        {isFreeShipping ? (
          /* MENSAJE CUANDO TIENE ENVÍO GRATIS */
          <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg animate-in fade-in zoom-in duration-500">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              ✨ ¡Tu envío es gratuito! ✨
            </span>
          </div>
        ) : (
          /* MENSAJE CUANDO FALTA PARA EL ENVÍO GRATIS */
          <p className="text-[10px] text-zinc-500 text-right bg-pink-600/5 p-2 rounded-lg border border-pink-500/10 animate-in fade-in duration-500">
            Agregá <span className="text-pink-500 font-black">{currencyFormat(amountToFreeShipping)}</span> más para tener <span className="text-emerald-400">ENVÍO GRATIS</span>
          </p>
        )}
      </div>
    </div>
  );
};