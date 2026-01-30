"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';


import type { Address} from '@/interfaces';
import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';


const departamentosUruguay = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", 
  "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", 
  "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
];

const lockersMontevideo = [
  "Locker Tres Cruces Shopping",
  "Locker Nuevo Centro Shopping",
  "Locker Montevideo Shopping",
  "Locker Punta Carretas",
  "Locker Estación Ancap Pocitos",
  "Locker Centro - 18 de Julio",
  "Locker Maldonado - Punta del Este Centro"
];

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  departamento: string;
  phone: string;
  deliveryMethod: 'EXPRESS' | 'STANDARD' | 'PICKUP';
  lockerLocation?: string;
}

interface Props {
  userStoredAddress?: Partial<Address>;
}


export const AddressForm = ({ userStoredAddress = {} }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const { handleSubmit, register, formState: { isValid }, reset, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      deliveryMethod: 'STANDARD',
      departamento: 'Montevideo'
    }
  });

  // Observamos el método de envío para cambiar el diseño
  const selectedMethod = watch('deliveryMethod');

  const setAddress = useAddressStore( state => state.setAddress );
  const address = useAddressStore( state => state.address );

  useEffect(() => {
    if ( address.firstName ) {
      reset(address)
    }
  },[address, reset]);

  const onSubmit = async( data: FormInputs ) => {
    // Si es PickUp, limpiamos la dirección manual para no confundir
    if (data.deliveryMethod === 'PICKUP') {
      data.address = `Retiro en: ${data.lockerLocation}`;
    }
    
    setAddress(data);
    router.push('/checkout');
  }

  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      
      {/* SECCIÓN: MÉTODO DE ENVÍO */}
      <div className="col-span-1 sm:col-span-2 bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="font-bold mb-3">¿Cómo quieres recibir tu pedido?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <label className={clsx("flex flex-col p-3 border rounded cursor-pointer transition-all", 
            selectedMethod === 'STANDARD' ? "border-blue-500 bg-blue-50" : "bg-white")}>
            <input type="radio" value="STANDARD" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold">Estándar ($220)</span>
            <span className="text-xs text-gray-500">24-72 hs hábiles</span>
          </label>

          <label className={clsx("flex flex-col p-3 border rounded cursor-pointer transition-all", 
            selectedMethod === 'EXPRESS' ? "border-blue-500 bg-blue-50" : "bg-white")}>
            <input type="radio" value="EXPRESS" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold">Express ($350)</span>
            <span className="text-xs text-gray-500">Mismo día (Solo MVD)</span>
          </label>

          <label className={clsx("flex flex-col p-3 border rounded cursor-pointer transition-all", 
            selectedMethod === 'PICKUP' ? "border-blue-500 bg-blue-50" : "bg-white")}>
            <input type="radio" value="PICKUP" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold">Locker ($100)</span>
            <span className="text-xs text-gray-500">Retiro en punto</span>
          </label>

        </div>
      </div>

      {/* EMAIL (Para Guest Checkout) */}
      <div className="flex flex-col mb-2 col-span-1 sm:col-span-2">
        <span>Correo Electrónico</span>
        <input 
          type="email" 
          className="p-2 border rounded-md bg-gray-200" 
          { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } 
          placeholder="Para enviarte el recibo"
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('firstName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('lastName', { required: true  }) } />
      </div>

      {/* CAMPOS CONDICIONALES */}
      { selectedMethod !== 'PICKUP' ? (
        <>
          <div className="flex flex-col mb-2">
            <span>Dirección</span>
            <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address', { required: true  }) } placeholder="Calle y número" />
          </div>
          <div className="flex flex-col mb-2">
            <span>Apartamento / Esquina (opcional)</span>
            <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address2') } />
          </div>
        </>
      ) : (
        <div className="flex flex-col mb-2 col-span-1 sm:col-span-2">
          <span>Seleccionar Punto de Retiro (Locker)</span>
          <select className="p-2 border rounded-md bg-white border-blue-500" {...register('lockerLocation', { required: selectedMethod === 'PICKUP' })}>
            <option value="">-- Seleccione un Locker --</option>
            {lockersMontevideo.map(locker => (
              <option key={locker} value={locker}>{locker}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('city', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Departamento</span>
        <select className="p-2 border rounded-md bg-gray-200" { ...register('departamento', { required: true }) }>
          <option value="">[ Seleccione ]</option>
          {departamentosUruguay.map( dep => (
            <option key={ dep } value={ dep }>{ dep }</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono de contacto</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('phone', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2 sm:mt-10">
        <button
          disabled={ !isValid }
          type="submit"
          className={ clsx({ 'btn-primary': isValid, 'btn-disabled': !isValid })}
        >
          Revisar Pedido
        </button>
      </div>
    </form>
  );
};