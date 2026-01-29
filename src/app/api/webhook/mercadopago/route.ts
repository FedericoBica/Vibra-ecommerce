import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("WEBHOOK RECIBIDO:", body);

    const { data, type } = body;

    // Solo procesamos notificaciones de pago
    if (type === 'payment') {
      const paymentId = data.id;

      // 1. Consultar el estado real a Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      });

      if (!response.ok) throw new Error('Error al consultar pago en MP');
      
      const paymentData = await response.json();

      // 2. Si el pago está aprobado, actualizamos Prisma
      if (paymentData.status === 'approved') {
        const orderId = paymentData.external_reference;

        await prisma.order.update({
          where: { id: orderId },
          data: { 
            isPaid: true,
            paidAt: new Date(),
          }
        });
        console.log(`Orden ${orderId} marcada como pagada con éxito`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ERROR EN WEBHOOK:", error);
    // Respondemos 200 igual para que MP no siga reintentando
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}