"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export const OrderSummary = () => {

  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);


  useEffect(() => {

    if ( itemsInCart === 0 && loaded === true )   {
      router.replace('/empty')
    }


  },[ itemsInCart, loaded, router ])



  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="grid grid-cols-2 gap-y-3">
      <span className="text-gray-400">No. Productos</span>
      <span className="text-right text-gray-200">{itemsInCart} unidades</span>

      <span className="text-gray-400">Subtotal</span>
      <span className="text-right text-gray-200">{currencyFormat(subTotal)}</span>

      <div className="col-span-2 h-px bg-zinc-800 my-2" />

      <span className="text-xl font-bold text-gray-100">Total:</span>
      <span className="text-xl text-right font-bold text-pink-500">
        {currencyFormat(total)}
      </span>
    </div>  );
};
