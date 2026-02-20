// src/app/(shop)/checkout/address/page.tsx
import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getUserAddress } from "@/actions";
import { auth } from '@/auth.config';
import { getStoreConfig } from '@/actions/config/store-config'; // <--- Nuevo

export default async function AddressPage() {
  
  const session = await auth();
  
  // Traemos la dirección y la configuración de la DB
  const [userAddress, shippingConfig] = await Promise.all([
    session?.user ? getUserAddress(session.user.id) : undefined,
    getStoreConfig('shipping') // <--- Obtenemos precios y threshold
  ]);
  
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        {/* Pasamos la dirección y la configuración */}
        <AddressForm 
          userStoredAddress={ userAddress ?? undefined } 
          shippingConfig={shippingConfig} 
        />
      </div>
    </div>
  );
}