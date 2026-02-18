interface Props {
  price: number;
  oldPrice?: number | null;
  inStock: number;
}

export const DiscountBadge = ({ price, oldPrice, inStock }: Props) => {
  // 1. Si no hay stock
  if (inStock <= 0) {
    return (
      <div className="bg-zinc-950/80 backdrop-blur-md text-zinc-400 text-[9px] font-black px-2 py-1 rounded-lg border border-zinc-800 uppercase tracking-widest shadow-xl">
        Agotado
      </div>
    );
  }

  // 2. Si no hay descuento, no mostramos nada
  if (!oldPrice || oldPrice <= price) return null;

  const percentage = Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <div className="bg-pink-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-pink-500/40 uppercase italic tracking-tighter animate-pulse border border-pink-400/50">
      -{percentage}% OFF
    </div>
  );
};