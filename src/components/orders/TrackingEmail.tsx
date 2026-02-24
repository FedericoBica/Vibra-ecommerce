export const trackingEmail = (order: any) => {
  const emailCliente = order.OrderAddress?.email || order.user?.email || '';
  const firstName = order.OrderAddress?.firstName || 'cliente';
  const orderId = order.id.split("-").at(-1);
  const trackingUrl = 'https://www.correo.com.uy/seguimientodeenvios'
  const checkoutUrl = `https://vibralover.com/orders/${order.id}`; // Cambiá por tu web real

  // AJUSTE DE CUENTA: Cambiá el "u/0" por el número que te aparezca a vos (u/0, u/1, etc.)
  const gmailBase = "https://mail.google.com/mail/u/1/?view=cm&fs=1"; 
  
  const subject = encodeURIComponent(`Tu pedido de Vibra #${orderId} esta en camino`);
  const message = `

¡Hola ${firstName}! ✨ Te pasamos el código de seguimiento de tu pedido en Vibra: 
 
Podés rastrearlo acá: ${trackingUrl};

Saludos, Equipo de Vibra.`;

  const body = encodeURIComponent(message);

  return `${gmailBase}&to=${emailCliente}&su=${subject}&body=${body}`;
};