import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getUserAddress } from "@/actions";
import { auth } from '@/auth.config';

export default async function AddressPage() {
  
  const session = await auth();

  // NO USAR redirect NI BLOQUEAR AQUÍ. 
  // Si no hay sesión, simplemente pasamos undefined.
  const userAddress = session?.user 
    ? await getUserAddress(session.user.id) 
    : undefined;
  
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        {/* Pasamos la dirección si existe, si no, el form estará vacío para el invitado */}
        <AddressForm userStoredAddress={ userAddress ?? undefined } />
      </div>
    </div>
  );
}