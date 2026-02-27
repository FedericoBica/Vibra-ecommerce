'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import { getPacksForCart } from '@/actions/packs/pack-actions';
import { PackCard } from './PackCard';

export const CartPacksSuggestion = () => {
  const cart = useCartStore(s => s.cart);
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    if (cart.length === 0) { setPacks([]); return; }

    const productIds = cart.map(item => item.id);
    getPacksForCart(productIds).then(setPacks);
  }, [cart]);

  if (packs.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎁</span>
        <p className="text-xs font-black text-pink-400 uppercase tracking-widest">
          Packs con tus productos
        </p>
      </div>
      <div className="space-y-2">
        {packs.map(pack => (
          <PackCard key={pack.id} pack={pack} variant="inline" />
        ))}
      </div>
    </div>
  );
};