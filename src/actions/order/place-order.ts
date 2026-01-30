"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Address } from "@/interfaces";

interface ProductToOrder {
  productId: string;
  quantity: number;
  color: string;
}

// Precios de envío (puedes ajustarlos aquí)
const shippingPrices = {
  EXPRESS: 350,
  STANDARD: 220,
  PICKUP: 100,
};

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id; // Puede ser undefined si es invitado

  // 1. Obtener la información de los productos en la DB
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds.map((p) => p.productId) },
    },
  });

  // 2. Calcular montos de productos
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

const { subTotal } = productIds.reduce(
  (totals, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`${item.productId} no existe`);

    const itemSubtotal = product.price * item.quantity;
    totals.subTotal += itemSubtotal;

    return totals;
  },
  { subTotal: 0 } // Quitamos tax de aquí
);

  const tax = 0; // Impuestos eliminados
  const shippingCost = shippingPrices[address.deliveryMethod] || 0;
  const total = subTotal + shippingCost; // Total es solo productos + envío
  
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
          total: total,
          deliveryMethod: address.deliveryMethod,
          lockerLocation: address.lockerLocation,
          shippingCost: shippingCost,

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
          postalCode:   address.postalCode,
          city:         address.city,
          phone:        address.phone,
          departamento: address.departamento,
          orderId:      order.id,
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