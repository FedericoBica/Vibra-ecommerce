import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) { 
  try {
    const body = await request.json();
    const { data, type } = body;

    // 1. Responder rápido a las pruebas de MP
    if (data?.id === "123456") return NextResponse.json({ ok: true });

    if (type === 'payment') {
      const paymentId = data.id;

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });

      if (response.ok) {
        const paymentData = await response.json();

        if (paymentData.status === 'approved') {
          let orderId = paymentData.external_reference;

          // LIMPIEZA DINÁMICA :
          // Si el ID tiene más de 5 guiones, significa que MP le pegó un ID al principio.
          if (orderId && orderId.includes('-')) {
            const parts = orderId.split('-');
            if (parts.length > 5) {
              // Nos quedamos con los últimos 5 bloques (que forman el UUID estándar)
              orderId = parts.slice(-5).join('-');
            }
          }

          console.log("Intentando actualizar orden limpia:", orderId);

          await prisma.order.update({
            where: { id: orderId },
            data: { 
              isPaid: true,
              paidAt: new Date(),
            }
          });
          console.log("¡Orden actualizada con éxito!");
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}