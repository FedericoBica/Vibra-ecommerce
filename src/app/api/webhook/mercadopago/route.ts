import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");
    const type = url.searchParams.get("type") || url.searchParams.get("topic");

    // Solo procesamos si hay un ID de pago
    if (type === "payment" && paymentId) {
      
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });

      if (response.ok) {
        const data = await response.json();
        const rawRef = data.external_reference; 

        // Si el pago está aprobado, buscamos la orden
        if ((data.status === "approved" || data.status === "authorized") && rawRef) {
          
          // REGLA DE ORO: Extraemos el ID real (UUID) ignorando cualquier prefijo de MP
          const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
          const match = rawRef.match(uuidRegex);
          const cleanOrderId = match ? match[0] : rawRef;

          // Actualizamos la base de datos
          await prisma.order.update({
            where: { id: cleanOrderId },
            data: { 
              isPaid: true, 
              paidAt: new Date(),
              // Guardamos el ID de transacción de MP por si acaso
              transactionId: paymentId.toString() 
            },
          });
          
          console.log(`✅ ORDEN PAGADA: ${cleanOrderId}`);
        }
      }
    }

    // Mercado Pago exige un 200 siempre
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error Webhook:", error);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}