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
        console.log("ESTADO RECIBIDO DE MP:", paymentData.status); // <--- AGREGÁ ESTO
        console.log("REFERENCIA RECIBIDA:", paymentData.external_reference); // <--- Y ESTO

        if (paymentData.status === 'approved' || paymentData.status === 'completed') {
          let orderId = paymentData.external_reference;

      // LÓGICA DE LIMPIEZA DE UUID:
          // Un UUID estándar tiene este formato: 8-4-4-4-12 caracteres (5 bloques unidos por guiones)
          if (orderId && orderId.includes('-')) {
            const parts = orderId.split('-');
            
            // Si tiene más de 5 partes, Mercado Pago le pegó un ID de cuenta al principio
            if (parts.length > 5) {
              // Tomamos solo las últimas 5 partes para reconstruir el ID original de tu DB
              orderId = parts.slice(-5).join('-');
            }
          }

          console.log("Intentando actualizar orden limpia:", orderId);

          try {
            const updatedOrder = await prisma.order.update({
              where: { id: orderId },
              data: { 
                isPaid: true,
                paidAt: new Date(),
              }
            });
            console.log("✅ ÉXITO: Orden", updatedOrder.id, "marcada como pagada.");
          } catch (prismaError) {
            console.error("❌ ERROR PRISMA:", prismaError.message);
            // Si la orden no existe, igual respondemos 200 para que MP no reintente infinitamente
          }
        }
      }
    }

    // Siempre responder 200 a Mercado Pago para evitar reintentos innecesarios
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("--- Webhook Error Grave ---", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}