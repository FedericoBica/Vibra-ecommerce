"use client"; // Convertí el botón en un componente de cliente si no lo es

import { useCartStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CheckoutButton = () => {
  const [loaded, setLoaded] = useState(false);
  const itemsInCart = useCartStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Link 
      className="btn-neon w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest transition-all text-white mt-4 bg-pink-600 border border-pink-400 shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:bg-pink-500 hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] hover:scale-[1.02] active:scale-95 ring-2 ring-pink-500/20"
      href="/checkout/address"
    >
      <span>Siguiente</span>
      
      {loaded && itemsInCart > 0 && (
        <span className="text-[12px] lowercase font-medium text-pink-100 opacity-90 tracking-normal">
          ({itemsInCart} {itemsInCart === 1 ? 'item' : 'items'})
        </span>
      )}
    </Link>
  );
};