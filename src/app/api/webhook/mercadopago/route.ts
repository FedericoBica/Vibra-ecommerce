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
        
        // --- LOGS DE CONTROL ---
        console.log("1. ESTADO:", paymentData.status);
        const rawRef = paymentData.external_reference;
        console.log("2. REF BRUTA:", rawRef);

        if (paymentData.status === 'approved' || paymentData.status === 'completed') {
          
          // LIMPIEZA TOTAL: Buscamos el UUID dentro del string
          // Esta regex busca el patrón xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
          const match = rawRef.match(uuidRegex);
          const orderId = match ? match[0] : rawRef;

          console.log("3. ID FINAL A BUSCAR:", orderId);

          try {
            const updated = await prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true, paidAt: new Date() }
            });
            console.log("4. ✅ ACTUALIZADO EN DB:", updated.id);
          } catch (dbError: any) {
            console.error("4. ❌ ERROR PRISMA:", dbError.message);
          }
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("ERROR WEBHOOK:", error.message);
    return NextResponse.json({ ok: true }); // Siempre 200 para MP
  }
}