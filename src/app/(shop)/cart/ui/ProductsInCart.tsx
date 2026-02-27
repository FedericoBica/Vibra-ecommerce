'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import { ProductImage, QuantitySelector } from '@/components';
import Link from 'next/link';

export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
  const removeProduct = useCartStore(state => state.removeProduct);
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore(state => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="animate-pulse text-pink-500">Cargando productos...</p>;

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.color}`} className="flex mb-6 last:mb-0 pb-5 border-b border-zinc-800/50 last:border-0">

          <ProductImage
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded-xl object-cover bg-zinc-800"
          />

          <div className="flex-1">
            <div className="flex flex-col mb-1">

              {/* Badge Pack */}
              {product.isPack && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] bg-pink-600 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(219,39,119,0.3)]">
                    Pack Ahorro
                  </span>
                </div>
              )}

              {/* Título — pack no linkea, producto sí */}
              {product.isPack ? (
                <p className="text-gray-100 font-bold leading-tight">
                  {product.title}
                </p>
              ) : (
                <Link
                  className="text-gray-100 font-bold hover:text-pink-500 transition-colors leading-tight"
                  href={`/product/${product.slug}`}
                >
                  {`${product.color} - `}{product.title}
                </Link>
              )}

              {/* Nota del pack (ej: Lubricante: Fresa) */}
              {product.isPack && product.note && (
                <p className="text-[10px] text-pink-400 italic mt-1 bg-pink-500/5 py-1 px-2 rounded-lg border border-pink-500/10 w-fit">
                  📝 {product.note}
                </p>
              )}

            </div>

            <p className="text-pink-500 font-black text-lg">${product.price}</p>

            <div className="flex items-center justify-between mt-3">
              <QuantitySelector
                quantity={product.quantity}
                onQuantityChanged={quantity => updateProductQuantity(product, quantity)}
              />
              <button
                onClick={() => removeProduct(product)}
                className="text-zinc-500 hover:text-red-400 text-xs underline transition-colors"
              >
                Remover
              </button>
            </div>
          </div>

        </div>
      ))}
    </>
  );
};