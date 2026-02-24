// src/actions/order/get-paginated-orders.ts

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  status?: string;   // 'paid', 'not-paid'
  delivery?: string; // 'PICKUP', 'STANDARD', 'EXPRESS'
  delivered?: string; // 'yes', 'no'
  search?: string;    // Email o nombre
}

export const getPaginatedOrders = async ({
  page = 1,
  take = 10,
  status,
  delivery,
  delivered,
  search
}: PaginationOptions) => {

  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'Debe de estar autenticado' };
  }

  // 1. Construir el filtro dinámico (Multi-filtro)
  const filterArgs: any = {};

  // Filtro de Pago
  if (status === 'paid') filterArgs.isPaid = true;
  if (status === 'not-paid') filterArgs.isPaid = false;

  // Filtro de Método de Envío (Punto A)
  if (delivery && delivery !== 'all') {
    filterArgs.deliveryMethod = delivery;
  }

  // Filtro de Estado de Entrega (Punto C)
  if (delivered === 'yes') filterArgs.isDelivered = true;
  if (delivered === 'no') filterArgs.isDelivered = false;

  // Filtro de Búsqueda (Historial del Cliente - Punto 4)
  if (search) {
    filterArgs.OR = [
      { OrderAddress: { email: { contains: search, mode: 'insensitive' } } },
      { OrderAddress: { firstName: { contains: search, mode: 'insensitive' } } },
      { guestEmail: { contains: search, mode: 'insensitive' } }
    ];
  }

  try {
    const orders = await prisma.order.findMany({
      take: take,
      skip: (page - 1) * take,
      where: filterArgs,
      orderBy: { createdAt: 'desc' },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        user: { select: { email: true } }
      }
    });

    const totalCount = await prisma.order.count({ where: filterArgs });
    const totalPages = Math.ceil(totalCount / take);

    return {
      ok: true,
      orders: orders,
      totalPages: totalPages,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error al obtener las órdenes' };
  }
};