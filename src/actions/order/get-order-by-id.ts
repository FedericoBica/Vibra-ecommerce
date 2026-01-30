"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            color: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: { url: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) return { ok: false, message: `${id} no existe` };

    // LÓGICA DE SEGURIDAD
    // Si la orden tiene un dueño (userId), verificamos sesión
    if (order.userId) {
      if (!session?.user) {
        return { ok: false, message: "Debe estar autenticado para ver esta orden" };
      }
      if (session.user.role === "user" && session.user.id !== order.userId) {
        return { ok: false, message: "Esta orden no pertenece a su usuario" };
      }
    }
    
    // Si la orden es de invitado (userId es null), permitimos verla con el ID
    return {
      ok: true,
      order: order,
    };

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Hable con el administrador",
    };
  }
};