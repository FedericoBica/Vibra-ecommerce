export interface MercadoPagoWebhookResponse {
  action: string;
  api_version: string;
  data: {
    id: string; // Este es el ID del pago
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string; // Aquí vendrá "payment"
  user_id: string;
}