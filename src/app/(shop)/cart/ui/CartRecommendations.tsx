"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { ProductGridItem } from "@/components";
import { getProductsForRecommendations } from "@/actions/product/get-recommendations";

export const CartRecommendations = () => {
  const cart = useCartStore((state) => state.cart);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      // Si no hay nada en el carrito, no mostramos recomendaciones (opcional)
      if (cart.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const excludedIds = cart.map((p) => p.id);
      
      // 1. Mapeo con tus categorías reales: juguetes, lubricantes, juegos
      const hasJuguete = cart.some(p => p.category?.toLowerCase().includes('juguetes'));
      const hasLubricante = cart.some(p => p.category?.toLowerCase().includes('lubricantes'));
      const hasJuego = cart.some(p => p.category?.toLowerCase().includes('juegos'));

      // 2. Lógica de Cross-selling (Venta cruzada)
      let targetCategories: string[] = [];
      
      if (hasJuguete) targetCategories.push('lubricantes', 'juegos');
      if (hasLubricante) targetCategories.push('juguetes', 'juegos');
      if (hasJuego) targetCategories.push('juguetes', 'lubricantes');
      
      // Si tiene de todo o no detecta categoría, mandamos el mix completo
      if (targetCategories.length === 0) {
        targetCategories = ['juguetes', 'lubricantes', 'juegos'];
      }

      // 3. Llamar al Action
      const products = await getProductsForRecommendations(excludedIds, targetCategories);
      setRecommended(products);
      setLoading(false);
    };

    fetchRecs();
  }, [cart]);

  if (loading) return (
    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-64 animate-pulse bg-zinc-900/50 rounded-2xl" />
      ))}
    </div>
  );

  if (recommended.length === 0) return null;

  return (
    <div className="mt-20 pb-20 border-t border-zinc-800/50 pt-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-pink-500 rounded-full" />
        <h2 className="text-xl font-black uppercase tracking-widest text-white italic">
          Completa la <span className="text-pink-500">experiencia</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommended.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};