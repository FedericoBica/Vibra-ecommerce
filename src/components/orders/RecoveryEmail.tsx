export const recoveryEmail = (order: any) => {
  const emailCliente = order.OrderAddress?.email || order.user?.email || '';
  const firstName = order.OrderAddress?.firstName || 'cliente';
  const orderId = order.id.split("-").at(-1);
  const checkoutUrl = `https://vibralover.com/orders/${order.id}`; // Cambiá por tu web real

  // AJUSTE DE CUENTA: Cambiá el "u/0" por el número que te aparezca a vos (u/0, u/1, etc.)
  const gmailBase = "https://mail.google.com/mail/u/1/?view=cm&fs=1"; 
  
  const subject = encodeURIComponent(`Tu pedido en Vibra #${orderId} te está esperando`);
  const message = `Hola ${firstName}, cómo estás?

Notamos que iniciaste una compra en nuestra tienda, pero el pedido quedó pendiente de pago.

Podés completar tu pedido acá: 

${checkoutUrl}

Queríamos saber si hubo algún inconveniente o si necesitás ayuda para finalizar la compra. Estamos disponibles para asesorarte y asegurarnos de que tengas la mejor experiencia posible.

🛍️ Tu pedido sigue reservado por tiempo limitado, para que puedas retomarlo cuando quieras con ese link.

Cualquier duda, respondé este mail.
Quedamos atentos.

Saludos, Equipo de Vibra.`;

  const body = encodeURIComponent(message);

  return `${gmailBase}&to=${emailCliente}&su=${subject}&body=${body}`;
};