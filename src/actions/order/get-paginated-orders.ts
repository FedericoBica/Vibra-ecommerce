'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
  status?: string; // Aquí recibimos 'paid', 'not-paid' o undefined
}

export const getPaginatedOrders = async({
  page = 1,
  take = 10,
  status
}: PaginationOptions) => {

  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado'
    }
  }

  // 1. Construir el filtro dinámico
  // Si status es 'paid' -> isPaid: true
  // Si status es 'not-paid' -> isPaid: false
  // Si no hay status -> {} (trae todo)
  const filterArgs = status === 'paid' 
    ? { isPaid: true } 
    : status === 'not-paid' 
      ? { isPaid: false } 
      : {};

  try {
    const orders = await prisma.order.findMany({
      take: take,
      skip: (page - 1) * take,
      where: filterArgs, // <--- Filtro aplicado
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
            email:true,
          }
        }
      }
    });

    // También necesitamos el total para la paginación
    const totalCount = await prisma.order.count({ where: filterArgs });
    const totalPages = Math.ceil(totalCount / take);

    return {
      ok: true,
      orders: orders,
      totalPages: totalPages,
    }
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al obtener las órdenes'
    }
  }
}