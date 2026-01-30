import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Intentamos obtener el ID desde external_reference (el más seguro)
  // o desde preference_id si MP decide usar ese.
  const orderId = searchParams.get('external_reference');
  
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://tu-dominio.vercel.app';

  console.log('--- MP REDIRECT DATA ---');
  console.log('Order ID encontrado:', orderId);
  console.log('Todos los parámetros:', Object.fromEntries(searchParams));

  // Si no hay ID, mandamos al home para evitar el error de página rota
  if (!orderId) {
    return NextResponse.redirect(new URL('/', baseUrl));
  }

  // Redirigimos a la orden con un 303 (See Other) para limpiar el método
  return NextResponse.redirect(new URL(`/orders/${orderId}`, baseUrl), 303);
}

export async function POST(request: Request) {
  // Si MP manda un POST, lo convertimos a GET usando la misma lógica
  return GET(request);
}