export const recoveryEmail = (order: any) => {
  const emailCliente = order.OrderAddress?.email || order.user?.email || '';
  const firstName = order.OrderAddress?.firstName || 'cliente';
  const orderId = order.id.split("-").at(-1);
  const checkoutUrl = `https://vibralover.com/orders/${order.id}`; // Cambiá por tu web real

// LA CLAVE: Usamos authuser con el mail de la empresa
  const cuentaVibra = "vibralovershop@gmail.com"; // <-- Poné acá el mail real de Vibra
  const gmailBase = `https://mail.google.com/mail/?view=cm&fs=1&authuser=${cuentaVibra}`;
  
  const subject = encodeURIComponent(`Tu pedido en Vibra #${orderId} te está esperando`);
  const message = `Hola ${firstName}, cómo estás?

Notamos que iniciaste una compra en nuestra tienda, pero el pedido quedó pendiente de pago.

Podés completar tu pedido acá: 

${checkoutUrl}

Queríamos saber si hubo algún inconveniente o si necesitás ayuda para finalizar la compra. Estamos disponibles para asesorarte y asegurarnos de que tengas la mejor experiencia posible.

🛍️ Tu pedido sigue reservado por tiempo limitado, para que puedas retomarlo cuando quieras con ese link.

Cualquier duda, respondé este mail.
Quedamos atentos.

Saludos.`;

  const body = encodeURIComponent(message);

  return `${gmailBase}&to=${emailCliente}&su=${subject}&body=${body}`;
};