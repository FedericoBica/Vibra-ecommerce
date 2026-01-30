import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Mercado Pago nos manda el ID en 'external_reference'
  const orderId = searchParams.get('external_reference');
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://tu-dominio.vercel.app';

  console.log({ orderId, mensaje: "Redirecting from MP success" });

  if (!orderId) {
    return NextResponse.redirect(new URL('/', baseUrl));
  }

  // Redirigimos a la página de la orden
  return NextResponse.redirect(new URL(`/orders/${orderId}`, baseUrl));
}

// Algunos flujos de MP requieren POST
export async function POST(request: Request) {
  return GET(request); 
}