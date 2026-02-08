'use client';

import Link from 'next/link';
import { Product } from '@/interfaces';
import { useState } from 'react';
import { ProductImage } from '@/components/product/product-image/ProductImage';
import { DiscountBadge } from '@/components/product/ui/DiscountBadge';
import clsx from 'clsx'; // Asegúrate de tener instalado clsx

interface Props {
  product: Product;
}

export const ProductGridItem = ( { product }: Props ) => {

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/imgs/placeholder.jpg'];

  const [displayImage, setDisplayImage] = useState(images[0]);
  const isOutOfStock = product.inStock === 0;

  return (
    <div className="rounded-md overflow-hidden fade-in bg-zinc-900/30 border border-zinc-800 hover:border-pink-500/50 transition-all group relative italic flex flex-col h-full">
      
      {/* El Badge ahora maneja internamente si muestra Descuento o Agotado */}
      <DiscountBadge price={product.price} oldPrice={product.oldPrice} inStock={product.inStock} />

      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
          <ProductImage
            src={displayImage}
            alt={product.title}
            className={clsx(
              "absolute inset-0 w-full h-full object-cover rounded-t-md transition-all duration-500",
              {
                "grayscale opacity-60": isOutOfStock, // Efecto apagado si no hay stock
                "group-hover:scale-110": !isOutOfStock // Solo hace zoom si hay stock
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
        <Link 
          className="hover:text-pink-500 text-sm font-black uppercase tracking-tighter transition-colors line-clamp-2 min-h-[40px] text-gray-100" 
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-2 mt-auto">
          <span className={clsx("font-black text-xl", isOutOfStock ? "text-zinc-500" : "text-pink-500")}>
            ${product.price}
          </span>

          {product.oldPrice && product.oldPrice > product.price && !isOutOfStock && (
            <span className="text-xs text-zinc-500 line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};