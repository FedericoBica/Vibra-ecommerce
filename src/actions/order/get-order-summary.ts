// src/actions/order/get-order-summary.ts

import prisma from "@/lib/prisma";

export const getOrdersSummary = async () => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        total: true,
        isPaid: true,
        isDelivered: true,
      }
    });

    // Filtramos lo que realmente importa ahora:
    const paidOrders = orders.filter(o => o.isPaid);
    
    // LO URGENTE: Pagado pero NO entregado
    const pendingDelivery = paidOrders.filter(o => !o.isDelivered).length;
    
    // LO LISTO: Pagado y Entregado
    const completedOrders = paidOrders.filter(o => o.isDelivered).length;

    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

    return {
      ok: true,
      summary: {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingDelivery, // <--- Nueva métrica estrella
        completedOrders,
        totalRevenue,
      }
    };
  } catch (error) {
    return { ok: false, message: 'Error' };
  }
};