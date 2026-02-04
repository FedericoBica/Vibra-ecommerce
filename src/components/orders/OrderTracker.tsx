"use client";

import { useEffect } from "react";

interface Props {
  total: number;
  orderId: string;
  items: any[];
}

export const OrderTracker = ({ total, orderId, items }: Props) => {
  useEffect(() => {
    if (typeof window.fbq !== "undefined") {
      // Disparamos el evento de compra
      window.fbq("track", "Purchase", {
        value: total,
        currency: "UYU",
        content_ids: items.map((item) => item.product.id),
        content_type: "product",
        order_id: orderId, // Para evitar duplicados en Meta
      });
    }
  }, [total, orderId, items]);

  return null; // No renderiza nada visualmente
};