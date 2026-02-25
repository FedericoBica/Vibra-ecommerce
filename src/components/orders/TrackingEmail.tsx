export const trackingEmail = (order: any) => {
  const emailCliente = order.OrderAddress?.email || order.user?.email || '';
  const firstName = order.OrderAddress?.firstName || 'cliente';
  const orderId = order.id.split("-").at(-1);
  const trackingUrl = 'https://www.correo.com.uy/seguimientodeenvios'
  const checkoutUrl = `https://vibralover.com/orders/${order.id}`; // Cambiá por tu web real

// LA CLAVE: Usamos authuser con el mail de la empresa
  const cuentaVibra = "vibralovershop@gmail.com"; // <-- Poné acá el mail real de Vibra
  const gmailBase = `https://mail.google.com/mail/?view=cm&fs=1&authuser=${cuentaVibra}`;
  
  const subject = encodeURIComponent(`Tu pedido de Vibra #${orderId} esta en camino`);
  const message = `

¡Hola ${firstName}! ✨ Te pasamos el código de seguimiento de tu pedido: 
 
Podés rastrearlo acá: ${trackingUrl};

Saludos, Equipo de Vibra Lover.`;

  const body = encodeURIComponent(message);

  return `${gmailBase}&to=${emailCliente}&su=${subject}&body=${body}`;
};