'use server';

import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export const createMercadoPagoPreference = async (orderId: string, total: number) => {
  try {
    const preference = new Preference(client);

    // 1. Validamos la URL base. Si no existe en el .env, usamos localhost por defecto.
    const baseUrl = /*process.env.NEXT_PUBLIC_URL || */'http://localhost:3000';

    const response = await preference.create({
      body: {
        items: [{
          id: orderId,
          title: `Orden #${orderId.split("-").at(-1)}`,
          quantity: 1,
          unit_price: total,
          currency_id: 'UYU', // O tu moneda local
        }],
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' },  // Esto excluye Abitab y RedPagos (pagos offline)
            { id: 'atm' }     // Por si acaso, excluye cajeros
          ],
          installments: 1, // Opcional: Máximo de cuotas permitidas
        },
        back_urls: {
          success: `${baseUrl}/orders/${orderId}`,
          failure: `${baseUrl}/orders/${orderId}`,
          pending: `${baseUrl}/orders/${orderId}`,
        },
        auto_return: 'approved',
        external_reference: orderId,
      }
    });
  // 3. Verificamos que tengamos un ID antes de retornar
    if (!response.id) {
      throw new Error('No se obtuvo un ID de preferencia');
    }
    return { ok: true, preferenceId: response.id };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};