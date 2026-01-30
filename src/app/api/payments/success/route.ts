import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Obtenemos los datos de la URL que mandó MP
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('external_reference'); // Usamos el ID que mandamos a MP
  
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? '';

  // Si no tenemos ID, mandamos al inicio, si no, a la orden
  const destination = orderId ? `/orders/${orderId}` : '/';

  return NextResponse.redirect(`${baseUrl}${destination}`, 303);
}

// También aceptamos GET por si acaso
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('external_reference');
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? '';
  return NextResponse.redirect(`${baseUrl}/orders/${orderId}`, 303);
}