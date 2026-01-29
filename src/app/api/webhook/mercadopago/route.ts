import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, type } = body;

    if (type === 'payment') {
      const paymentId = data.id;

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });

      if (response.ok) {
        const paymentData = await response.json();

        if (paymentData.status === 'approved') {
          // AQUÍ ESTÁ EL TRUCO:
          // Si el external_reference trae el ID largo, lo separamos para quedarnos solo con el UUID de la orden
          let orderId = paymentData.external_reference;

          if (orderId.includes('-')) {
             // Si mandaste el ID combinado, lo limpiamos. 
             // Si mandaste solo el UUID, esto no lo rompe.
             const parts = orderId.split('-');
             if (parts.length > 5) {
                // Esto es por si MP concatenó el ID de pago al principio
                orderId = parts.slice(1).join('-'); 
             }
          }

          console.log("Intentando actualizar orden:", orderId);

          await prisma.order.update({
            where: { id: orderId },
            data: { 
              isPaid: true,
              paidAt: new Date(),
            }
          });
          
          return NextResponse.json({ ok: true });
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}