'use server';

import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export const createMercadoPagoPreference = async (orderId: string, total: number) => {
  try {
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_URL;

    const response = await preference.create({
      body: {
        items: [{
          id: orderId,
          title: `Orden #${orderId.split("-").at(-1)}`,
          quantity: 1,
          unit_price: total,
          currency_id: 'UYU', 
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
    return { ok: true, preferenceId: response.id };
  } catch (error) {
    console.log(error);
    return { ok: false, preferenceId: null };
  }
};