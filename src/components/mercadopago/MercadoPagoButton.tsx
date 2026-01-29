'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface Props {
  preferenceId: string;
}

// Inicializamos fuera para que no se re-ejecute innecesariamente
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

export const MercadoPagoButton = ({ preferenceId }: Props) => {
  
  return (
    <div id="relative z-0">
      <Wallet 
        initialization={{ preferenceId }} 
      />
    </div>
  );
};