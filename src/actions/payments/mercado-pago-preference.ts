'use server';

import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export const createMercadoPagoPreference = async (orderId: string, total: number) => {
  try {
    const preference = new Preference(client);
    const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "").trim();
    console.log('Base URL usada para MP:', baseUrl);

    const response = await preference.create({
      body: {
        items: [{
          id: orderId,
          title: `Orden Vibra #${orderId.split("-").at(-1)}`,
          quantity: 1,
          unit_price: Number(total.toFixed(2)),
          currency_id: 'UYU', 
        }],
        // La clave es que external_reference sea SOLO el ID
        external_reference: orderId,
        notification_url: `${baseUrl}/api/webhook/mercadopago`,
        back_urls: {
          success: `${baseUrl}/api/payments/success`,
          failure: `${baseUrl}/orders/${orderId}`,
          pending: `${baseUrl}/orders/${orderId}`,
        },
        auto_return: 'approved',
      }
    });
    return { ok: true, preferenceId: response.id };
  } catch (error) {
    console.error('Error MP:', error);
    return { ok: false, preferenceId: null };
  }
};