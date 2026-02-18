'use client';

import Link from 'next/link';
import { Product } from '@/interfaces';
import { useState, useMemo } from 'react';
import { ProductImage } from '@/components/product/product-image/ProductImage';
import { DiscountBadge } from '@/components/product/ui/DiscountBadge';
import clsx from 'clsx';
import { IoStar } from 'react-icons/io5';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/imgs/placeholder.jpg'];

  const [displayImage, setDisplayImage] = useState(images[0]);
  const isOutOfStock = product.inStock === 0;

  // Lógica de estrellas "Fake" pero individual para cada producto
  const { rating, reviewsCount } = useMemo(() => {
    // Generamos una semilla basada en el ID del producto
    const seed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fakeRating = (4 + (seed % 10) / 10).toFixed(1);
    const fakeReviews = 10 + (seed % 40); // Entre 10 y 50 reseñas
    return { rating: parseFloat(fakeRating), reviewsCount: fakeReviews };
  }, [product.id]);

  return (
    <div className="rounded-xl overflow-hidden fade-in bg-zinc-900/30 border border-zinc-800 hover:border-pink-500/50 transition-all group relative flex flex-col h-full">
      
      {/* 1. BADGE IZQUIERDA: Best Seller (Si aplica) */}
      {product.isBestSeller && !isOutOfStock && (
        <span className="absolute top-3 left-3 z-20 bg-pink-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-pink-900/20">
          Best Seller
        </span>
      )}

      {/* 2. BADGE DERECHA: Descuento o Agotado (Usando tu DiscountBadge) */}
      <div className="absolute top-3 right-3 z-20">
        <DiscountBadge price={product.price} oldPrice={product.oldPrice} inStock={product.inStock} />
      </div>

      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
          <ProductImage
            src={displayImage}
            alt={product.title}
            className={clsx(
              "absolute inset-0 w-full h-full object-cover rounded-t-xl transition-all duration-700",
              {
                "grayscale opacity-60": isOutOfStock,
                "group-hover:scale-110": !isOutOfStock
              }
            )}
            width={500}
            height={500}
            onMouseEnter={() => {
              if (images.length > 1 && !isOutOfStock) setDisplayImage(images[1]);
            }}
            onMouseLeave={() => setDisplayImage(images[0])}
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-1 flex-grow">
        {/* TÍTULO */}
        <Link 
          className="hover:text-pink-500 text-sm font-bold uppercase tracking-tight transition-colors line-clamp-2 min-h-[40px] text-gray-100 italic" 
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>

        {/* RATING DINÁMICO */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <IoStar 
                key={i} 
                size={11} 
                className={i < Math.floor(rating) ? "text-yellow-400" : "text-zinc-700"} 
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
            ({reviewsCount} reseñas)
          </span>
        </div>

        {/* PRECIOS */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className={clsx("font-black text-xl", isOutOfStock ? "text-zinc-500" : "text-white")}>
            ${product.price.toLocaleString('es-UY')}
          </span>

          {product.oldPrice && product.oldPrice > product.price && !isOutOfStock && (
            <span className="text-xs text-zinc-500 line-through decoration-pink-500/30">
              ${product.oldPrice.toLocaleString('es-UY')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};