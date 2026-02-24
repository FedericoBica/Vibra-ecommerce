import prisma from '@/lib/prisma';

export const getOrdersSummary = async () => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        total: true,
        isPaid: true,
      }
    });

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.isPaid).length;
    const pendingOrders = totalOrders - paidOrders;
    
    // Suma de ventas (solo las pagadas)
    const totalRevenue = orders
      .filter(o => o.isPaid)
      .reduce((acc, order) => acc + order.total, 0);

    // Ticket promedio
    const averageTicket = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    return {
      ok: true,
      summary: {
        totalOrders,
        paidOrders,
        pendingOrders,
        totalRevenue,
        averageTicket,
      }
    };
  } catch (error) {
    return { ok: false, message: 'Error al calcular métricas' };
  }
};