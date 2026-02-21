"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Address } from "@/interfaces";
import { getStoreConfig } from "../config/store-config";

interface ProductToOrder {
  productId: string;
  quantity: number;
  color: string;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
  couponCode?: string,
) => {
  const session = await auth();
  const userId = session?.user.id;

  // 0. Obtener la configuración de envío de la DB en el Servidor
  const shippingConfig = await getStoreConfig('shipping');

  // 1. Obtener la información de los productos en la DB
  const products = await prisma.product.findMany({
    where: { id: { in: productIds.map((p) => p.productId) } },
  });

  // 2. Calcular montos de productos
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal } = productIds.reduce(
    (totals, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`${item.productId} no existe`);
      totals.subTotal += product.price * item.quantity;
      return totals;
    },
    { subTotal: 0 }
  );

  // --- LÓGICA DE CUPÓN ---
  let discountAmount = 0;
  if (couponCode) {
    const dbCoupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase().trim(), isActive: true }
    });
    if (dbCoupon) {
      discountAmount = subTotal * (dbCoupon.discount / 100);
    }
  }

  // --- LÓGICA DE ENVÍO RECALCULADA EN SERVIDOR ---
  const baseShippingCost = shippingConfig.prices[address.deliveryMethod as keyof typeof shippingConfig.prices] || 0 || 0;
  
  const finalShippingCost = subTotal >= shippingConfig.freeShippingThreshold ? 0 : baseShippingCost;

  // TOTAL FINAL SEGURO
  const total = (subTotal - discountAmount) + finalShippingCost;  
  // 3. Lógica de Envío
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        return tx.product.update({
          where: { id: product.id },
          data: { inStock: { decrement: productQuantity } },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      updatedProducts.forEach((p) => {
        if (p.inStock < 0) throw new Error(`${p.title} no tiene stock suficiente`);
      });

      // 2. Crear la orden (Shopify Style: userId puede ser null)
      const order = await tx.order.create({
        data: {
          userId: userId ?? null, // <--- Si no hay sesión, es invitado
          guestEmail: address.email,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: 0,
          discount: discountAmount,
          total: total,
          deliveryMethod: address.deliveryMethod,
          lockerLocation: address.lockerLocation,
          shippingCost: finalShippingCost,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                color: p.color,
                productId: p.productId,
                price: products.find((product) => product.id === p.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección de la orden
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName:    address.firstName,
          lastName:     address.lastName,
          address:      address.address,
          address2:     address.address2 || "",
          postalCode:   address.postalCode || "N/A",
          city:         address.city,
          phone:        address.phone,
          departamento: address.departamento,
          orderId:      order.id,
          dni:          address.dni,
        },
      });

      return {
        order: order,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      message: 'Orden creada correctamente',
    };

  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      message: error?.message || 'No se pudo crear la orden',
    };
  }
};