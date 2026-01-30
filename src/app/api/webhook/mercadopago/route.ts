import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // 1. Detectar ID del pago (viene por URL o por Body)
    const topic = searchParams.get("topic") || searchParams.get("type");
    const id = searchParams.get("id") || searchParams.get("data.id");

    const body = await request.json();
    const paymentId = body?.data?.id || body?.id || id;
    const type = body?.type || topic;

    // Solo procesamos si es una notificación de pago
    if (type === "payment" && paymentId) {
      console.log(`🚀 Webhook recibido para pago: ${paymentId}`);

      // 2. Consultar a Mercado Pago para verificar estado real
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });

      if (response.ok) {
        const paymentData = await response.json();
        const rawRef = paymentData.external_reference;
        const status = paymentData.status;

        console.log(`🔎 Estado: ${status} | Referencia Bruta de MP: ${rawRef}`);

        if (status === "approved" || status === "completed") {
          
          // --- AQUÍ ESTÁ LA SOLUCIÓN ---
          // Esta Regex extrae SOLO el UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
          // e ignora el prefijo "3166395116-" que agrega Mercado Pago
          const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
          
          // Si rawRef es null, evitamos el crash
          const match = rawRef ? rawRef.match(uuidRegex) : null;
          const orderId = match ? match[0] : rawRef;

          console.log(`🎯 ID LIMPIO PARA DB: ${orderId}`);

          if (orderId) {
            try {
              const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { isPaid: true, paidAt: new Date() },
              });
              console.log(`✅✅ ÉXITO: Orden ${updatedOrder.id} PAGADA.`);
            } catch (error) {
              console.error(`❌ ERROR DB: No se encontró la orden ${orderId} o falló Prisma.`, error);
            }
          } else {
             console.error("❌ ERROR: No se pudo extraer un ID válido de la referencia.");
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR CRÍTICO WEBHOOK:", error);
    return NextResponse.json({ ok: true });
  }
}