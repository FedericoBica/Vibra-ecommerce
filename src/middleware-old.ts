import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // Agregamos /orders/:id a la lista de ignorados si es necesario, 
  // pero lo más seguro es excluir explícitamente las rutas que MP toca.
  matcher: ['/((?!api|_next/static|_next/image|orders|.*\\.png$).*)'],
};