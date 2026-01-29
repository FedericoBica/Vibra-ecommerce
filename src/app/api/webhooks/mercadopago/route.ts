import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Tu instancia de Prisma

export async function POST(request: Request) {
  const body = await request.json();
  const { data, type } = body;

  // Solo nos interesan las notificaciones de pago
  if (type === 'payment') {
    const paymentId = data.id;
    
    // 1. Consultar el estado del pago a Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });

    const paymentData = await response.json();

    // 2. Si el pago está aprobado, actualizamos Prisma
    if (paymentData.status === 'approved') {
      const orderId = paymentData.external_reference; // El ID que mandamos al crear la preferencia

      await prisma.order.update({
        where: { id: orderId },
        data: { 
          isPaid: true,
          paidAt: new Date(),
        }
      });
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}