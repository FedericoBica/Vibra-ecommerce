"use client";

import { useState } from "react";
import { QuantitySelector, ColorSelector } from "@/components"; // Importás ColorSelector
import type { CartProduct, Product, Color, ProductCategory } from "@/interfaces";
import { useCartStore } from '@/store';

declare global {
  interface Window {
    fbq: any;
  }
}

interface Props {
  product: Product;
  category: ProductCategory;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductTocart );

  // 1. Cambiamos 'size' por 'color'
  const [color, setColor] = useState<Color | undefined>(); 
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);

    if (!color) return; // Validamos que haya color seleccionado

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      color: color, // Usamos la variable color
      image: product.images[0]
    }

    addProductToCart(cartProduct);

    // DISPARAMOS EL EVENTO DE META
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'AddToCart', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: 'UYU', 
        content_category: product.category,
      });
    }

    setPosted(false);
    setQuantity(1);
    setColor(undefined); // Reseteamos color
  };

  return (
    <>
      {posted && !color && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar un color*
        </span>
      )}

      <ColorSelector
        selectedColor={color}
        availableColors={product.color} // Asegurate que tu interfaz product tenga colors
        onColorChanged={setColor}
      />

      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};