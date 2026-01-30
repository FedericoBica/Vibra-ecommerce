import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Limpiamos el ID por si viene con basura
  const cleanId = id.split('?')[0];
  
  // Obtenemos la URL base de tus variables de entorno
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://tu-dominio.com';

  // El código 303 es clave: le dice al navegador "Recibí tu POST, pero ahora ve a esta URL usando GET"
  return NextResponse.redirect(`${baseUrl}/orders/${cleanId}`, 303);
}