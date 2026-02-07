'use client';

import Link from 'next/link';
import { Product } from '@/interfaces';
import { useState } from 'react';
import { ProductImage } from '@/components/product/product-image/ProductImage';
import { DiscountBadge } from '@/components/product/ui/DiscountBadge';

interface Props {
  product: Product;
}

export const ProductGridItem = ( { product }: Props ) => {

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/imgs/placeholder.jpg'];

  const [displayImage, setDisplayImage] = useState(images[0]);

  return (
    <div className="rounded-md overflow-hidden fade-in bg-zinc-900/30 border border-zinc-800 hover:border-pink-500/50 transition-all group relative italic">
      
      {/* 1. El Badge ya aparece arriba a la izquierda por su componente interno */}
      <DiscountBadge price={product.price} oldPrice={product.oldPrice}/>

      <Link href={`/product/${product.slug}`}>
<div className="relative aspect-square w-full overflow-hidden bg-zinc-800">
          <ProductImage
            src={displayImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-md transition-transform duration-500 group-hover:scale-110"
            width={500}
            height={500}
            onMouseEnter={() => {
              if (images.length > 1) setDisplayImage(images[1]);
            }}
            onMouseLeave={() => setDisplayImage(images[0])}
          />
        </div>      </Link>

      {/* Info del Producto */}
      <div className="p-4 flex flex-col gap-1">
        <Link 
          className="hover:text-pink-500 text-sm font-black uppercase tracking-tighter transition-colors line-clamp-2 min-h-[40px] text-gray-100" 
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          {/* 2. PRECIO ACTUAL: Ahora en Rosa Vibrante y más pesado (font-black) */}
          <span className="font-black text-xl text-pink-500">
            ${product.price}
          </span>

          {/* Precio Viejo (Tachado) */}
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-zinc-500 line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};