import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, type } = body;

    if (type === 'payment') {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });

      if (response.ok) {
        const paymentData = await response.json();
        const rawRef = paymentData.external_reference;

        console.log("🚀🚀 ENTRANDO AL PROCESO DE ACTUALIZACIÓN 🚀🚀");
        console.log("REF DE MP:", rawRef);

        if (paymentData.status === 'approved' || paymentData.status === 'completed') {
          // Extraer UUID con Regex (Inmune a los prefijos de Mercado Pago)
          const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
          const match = rawRef?.match(uuidRegex);
          const orderId = match ? match[0] : rawRef;

          console.log("🆔 ID LIMPIO IDENTIFICADO:", orderId);

          try {
            const updated = await prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true, paidAt: new Date() }
            });
            console.log("✅✅ ORDEN ACTUALIZADA EN DB:", updated.id);
          } catch (dbError: any) {
            console.error("❌ ERROR BUSCANDO EN DB:", dbError.message);
          }
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("WEBHOOK ERROR:", error.message);
    return NextResponse.json({ ok: true });
  }
}