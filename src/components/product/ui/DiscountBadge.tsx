interface Props {
  price: number;
  oldPrice?: number | null;
  inStock: number;
}

export const DiscountBadge = ({ price, oldPrice, inStock }: Props) => {
  // 1. Prioridad: Si no hay stock, cartel de Agotado
  if (inStock <= 0) {
    return (
      <div className="absolute top-2 left-2 z-20">
        <div className="bg-zinc-800 text-zinc-400 text-[10px] font-black px-2 py-1 rounded-sm border border-zinc-700 uppercase tracking-widest shadow-xl">
          Agotado
        </div>
      </div>
    );
  }

  // 2. Si hay stock, verificamos si corresponde mostrar descuento
  if (!oldPrice || oldPrice <= price) return null;

  const percentage = Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <div className="absolute top-2 left-2 z-20 animate-pulse">
      <div className="bg-pink-600 text-white text-[10px] font-black px-2 py-1 rounded-sm shadow-lg shadow-pink-500/40 uppercase italic tracking-tighter">
        -{percentage}%
      </div>
    </div>
  );
};