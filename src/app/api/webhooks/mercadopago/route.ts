import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Payment } from 'mercadopago';
import { client } from '@/lib/mercadopago';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');
  const { searchParams } = new URL(request.url);
  const dataId = searchParams.get('data.id');

  // Si no hay firma o ID, ignoramos
  if (!xSignature || !dataId) return new Response('Bad Request', { status: 400 });

  // VALIDACIÓN DE SEGURIDAD
  const secret = process.env.MP_WEBHOOK_SECRET;
  const parts = xSignature.split(',');
  let ts = '', v1 = '';
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key.trim() === 'ts') ts = value.trim();
    if (key.trim() === 'v1') v1 = value.trim();
  });

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac('sha256', secret!).update(manifest).digest('hex');

  if (hmac !== v1) {
    return new Response('Invalid Signature', { status: 401 });
  }

  // SI LA FIRMA ES VÁLIDA, PROCESAMOS EL PAGO
  try {
    const payment = await new Payment(client).get({ id: dataId });

    if (payment.status === 'approved') {
      await prisma.order.update({
        where: { id: payment.external_reference }, // El ID de orden que enviamos
        data: {
          isPaid: true,
          paidAt: new Date(),
          transactionId: dataId
        }
      });
      console.log('✅ Orden actualizada correctamente');
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}