'use client';

import { useState } from 'react';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';
import type { Color, PackOption } from '@/interfaces';

interface Product {
  id:     string;
  title:  string;
  price:  number;
  slug:   string;
  ProductImage: { url: string }[]; 
}

interface Pack {
  id:       string;
  title:    string;
  price:    number;
  options:  any;
  products: { product: Product }[];
}

export const AddPackToCart = ({ pack }: { pack: Pack }) => {
  const addItem = useCartStore(s => s.addProductTocart);
  const router  = useRouter();

  const options = (pack.options as PackOption[]) ?? [];

  // Estado de las selecciones del cliente
  const [selections, setSelections] = useState<Record<number, string>>(
    // Inicializar con la primera opción de cada dropdown
    Object.fromEntries(options.map((opt, i) => [i, opt.choices[0]]))
  );

  const allSelected = options.every((_, i) => selections[i]);

  const handleChange = (optIdx: number, value: string) =>
    setSelections(prev => ({ ...prev, [optIdx]: value }));

  const handleAddAll = () => {
    if (!allSelected) return;

    // Armar la nota con las selecciones
    const note = options.length > 0
      ? options.map((opt, i) => `${opt.label}: ${selections[i]}`).join(' · ')
      : undefined;

    const pricePerProduct = pack.price / pack.products.length;

    addItem({
      id:        pack.id,                              // id del pack
      slug:      `pack-${pack.id}`,                   // slug único para el carrito
      title:     pack.title,                           // nombre del pack
      price:     pack.price,                           // precio completo del pack
      quantity:  1,
      image:     pack.products[0]?.product.ProductImage[0]?.url ?? '',  // imagen del primer producto
      color:     'Rosa' as Color,
      category:  'pack',
      note,
      isPack:    true,
      packTitle: pack.title,
    });


    router.push('/cart');
  };

  return (
    <div className="space-y-5">

      {/* Dropdowns de opciones */}
      {options.length > 0 && (
        <div className="space-y-4">
          {options.map((opt, optIdx) => (
            <div key={optIdx}>
              <label className="text-xs font-black text-white uppercase tracking-widest mb-2 block">
                {opt.label}
                <span className="text-pink-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {opt.choices.map(choice => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleChange(optIdx, choice)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                      selections[optIdx] === choice
                        ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-900/30'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Resumen de lo que eligió */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Tu selección</p>
            <p className="text-sm text-white font-bold">
              {options.map((opt, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-zinc-600 mx-2">·</span>}
                  <span className="text-zinc-400">{opt.label}:</span>{' '}
                  <span className="text-pink-400">{selections[i] ?? '—'}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <button
        onClick={handleAddAll}
        disabled={!allSelected}
        className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-4 px-8 rounded-2xl uppercase tracking-[0.15em] text-sm transition-all active:scale-[0.98] shadow-lg shadow-pink-900/30 disabled:shadow-none"
      >
        {allSelected ? 'Agregar pack al carrito →' : 'Elegí tus opciones para continuar'}
      </button>
    </div>
  );
};