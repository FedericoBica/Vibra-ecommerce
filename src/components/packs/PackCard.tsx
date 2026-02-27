import Link from 'next/link';
import clsx from 'clsx';
import { ProductImage } from '../product/product-image/ProductImage';

interface Product {
  id: string;
  title: string;
  ProductImage: { url: string }[];
  price: number;
}

interface Pack {
  id: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  slug: string;
  products: { product: Product }[];
}

interface Props {
  pack: Pack;
  variant?: 'card' | 'compact' | 'inline';
}

export const PackCard = ({ pack, variant = 'card' }: Props) => {
  const saving = pack.comparePrice ? pack.comparePrice - pack.price : 0;
  const pct    = pack.comparePrice ? Math.round(saving / pack.comparePrice * 100) : 0;

  if (variant === 'compact') {
    // Para el widget en página de producto
    return (
      <Link
        href={`/packs/${pack.slug}`}
        className="flex items-center gap-4 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/30 rounded-2xl p-4 transition-all group"
      >
        {/* Fotos apiladas */}
        <div className="flex -space-x-3 flex-none">
          {pack.products.slice(0, 3).map(({ product }, i) => (
            <ProductImage
              src={product.ProductImage[0]?.url ?? ''}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">{pack.title}</p>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{pack.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-pink-400 font-black text-sm">${pack.price.toLocaleString('es-UY')}</span>
            {pack.comparePrice && (
              <span className="text-zinc-600 text-xs line-through">${pack.comparePrice.toLocaleString('es-UY')}</span>
            )}
            {pct > 0 && (
              <span className="text-[9px] bg-pink-600/20 text-pink-400 border border-pink-500/25 px-1.5 py-0.5 rounded-full font-black">
                -{pct}% OFF
              </span>
            )}
          </div>
        </div>

        <span className="text-zinc-600 group-hover:text-pink-400 transition-colors text-lg flex-none">→</span>
      </Link>
    );
  }

  if (variant === 'inline') {
    // Para la sugerencia en el carrito — más minimalista
    return (
      <Link
        href={`/packs/${pack.slug}`}
        className="flex items-center gap-3 bg-pink-950/20 hover:bg-pink-950/30 border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-3 transition-all group"
      >
        <span className="text-xl flex-none">🎁</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate">{pack.title}</p>
          <p className="text-[10px] text-pink-400 font-bold">${pack.price.toLocaleString('es-UY')} · ahorrás ${saving.toLocaleString('es-UY')}</p>
        </div>
        <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider flex-none group-hover:translate-x-0.5 transition-transform">
          Ver →
        </span>
      </Link>
    );
  }

  // variant === 'card' — para la grilla de la home
  return (
    <Link
      href={`/packs/${pack.slug}`}
      className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/30 rounded-3xl overflow-hidden transition-all duration-300"
    >
      {/* Badge de descuento */}
      {pct > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
          -{pct}% OFF
        </div>
      )}

      {/* Fotos de los productos */}
      <div className="relative h-44 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-3 p-6">
          {pack.products.slice(0, 3).map(({ product }, i) => (
            <div
              key={product.id}
              className="relative"
              style={{
                transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? '-8px' : '0'})`,
                zIndex: i === 1 ? 10 : 5,
              }}
            >
              <ProductImage
                src={product.ProductImage[0]?.url ?? ''}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-black text-white text-base leading-tight">{pack.title}</h3>
        <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{pack.description}</p>

        {/* Lista de productos incluidos */}
        <div className="mt-3 space-y-0.5">
          {pack.products.map(({ product }) => (
            <p key={product.id} className="text-[10px] text-zinc-600 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-pink-600 flex-none" />
              {product.title}
            </p>
          ))}
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-2xl font-black text-white">${pack.price.toLocaleString('es-UY')}</span>
          {pack.comparePrice && (
            <span className="text-sm text-zinc-600 line-through">${pack.comparePrice.toLocaleString('es-UY')}</span>
          )}
        </div>
        {saving > 0 && (
          <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
            Ahorrás ${saving.toLocaleString('es-UY')} comprando el pack
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <div className="w-full bg-pink-600/10 group-hover:bg-pink-600 border border-pink-500/30 group-hover:border-transparent text-pink-400 group-hover:text-white text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl text-center transition-all duration-300">
          Ver pack completo →
        </div>
      </div>
    </Link>
  );
};