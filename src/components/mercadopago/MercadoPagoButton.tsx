'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface Props {
  preferenceId: string;
}

export const MercadoPagoButton = ({ preferenceId }: Props) => {
  console.log("BO, EL ID QUE LLEGÓ ES:", preferenceId);
  // Inicializa con tu PUBLIC KEY
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

  return (
    <div className="relative z-0">
      <Wallet 
        initialization={{ preferenceId }} 
        customization={{ texts: { valueProp: 'smart_option' } }}
      />
    </div>
  );
};