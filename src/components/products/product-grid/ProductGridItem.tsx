'use client';

import Link from 'next/link';

import { Product } from '@/interfaces';
import { useState } from 'react';
import { ProductImage } from '@/components/product/product-image/ProductImage';

interface Props {
  product: Product;
}


export const ProductGridItem = ( { product }: Props ) => {

// 1. Usamos un fallback: si no hay imágenes, mandamos undefined para que ProductImage ponga el placeholder
// Usamos una imagen por defecto si el array viene vacío
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/imgs/placeholder.jpg'];

  const [displayImage, setDisplayImage] = useState(images[0]);

  return (
    <div className="rounded-md overflow-hidden fade-in bg-zinc-900/30 border border-zinc-800 hover:border-pink-500/50 transition-all group">
      <Link href={`/product/${product.slug}`}>
        <ProductImage
          src={displayImage}
          alt={product.title}
          className="w-full object-cover rounded-t-md transition-transform duration-500 group-hover:scale-105"
          width={500}
          height={500}
          // Hover dinámico: si hay más de una foto, muestra la segunda
          onMouseEnter={() => {
            if (images.length > 1) setDisplayImage(images[1]);
          }}
          onMouseLeave={() => setDisplayImage(images[0])}
        />
      </Link>

      <div className="p-3 flex flex-col">
        <Link
          className="hover:text-pink-500 transition-colors text-gray-200 text-sm sm:text-base font-medium truncate"
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>
        <span className="font-bold text-pink-500 mt-1">
          ${product.price.toLocaleString('es-AR')}
        </span>
      </div>
    </div>
  );
};