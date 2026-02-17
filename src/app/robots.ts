import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',    // Bloqueamos el panel de admin
        '/auth/',     // Bloqueamos login/registro
        '/profile/',  // Bloqueamos perfiles de usuario
        '/checkout/', // Bloqueamos pasarela de pago
        '/orders/',   // Bloqueamos órdenes privadas
      ],
    },
    sitemap: 'https://vibralover.com/sitemap.xml',
  };
}