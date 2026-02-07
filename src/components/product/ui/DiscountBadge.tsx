interface Props {
  price: number;
  oldPrice?: number | null;
}

export const DiscountBadge = ({ price, oldPrice }: Props) => {
  // Si no hay precio anterior, o el precio actual es mayor/igual (no hay oferta), no mostramos nada
  if (!oldPrice || oldPrice <= price) return null;

  // Calculamos el porcentaje: ((Original - Oferta) / Original) * 100
  const percentage = Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-pink-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-pink-500/50 uppercase tracking-widest border border-pink-400/30">
        {percentage}% OFF
      </div>
    </div>
  );
};