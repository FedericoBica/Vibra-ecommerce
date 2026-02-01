"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useAddressStore } from '@/store';
import type { Address } from '@/interfaces';

const lockersByDepto = {
  Montevideo: ["Locker Punta Carretas", "Locker Tres Cruces", "Locker Montevideo Shopping", "Locker Nuevo Centro"],
  Canelones: ["Locker Costa Urbana", "Locker Las Piedras Shopping", "Locker Pando"],
  Maldonado: ["Locker Punta del Este", "Locker Maldonado Centro", "Locker La Barra"],
};

const departamentosUruguay = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", 
  "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", 
  "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
];

type FormInputs = Address;

interface Props {
  userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ userStoredAddress = {} }: Props) => {
  const router = useRouter();
  
  const { handleSubmit, register, formState: { isValid }, reset, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      deliveryMethod: 'STANDARD',
      departamento: 'Montevideo'
    }
  });

  const setAddress = useAddressStore( state => state.setAddress );
  const address = useAddressStore( state => state.address );

  // Observamos cambios en el método y el departamento
  const selectedMethod = watch('deliveryMethod');
  const selectedDepto = watch('departamento');

  // Limpiar locker si el usuario cambia de departamento mientras está en modo PICKUP
  useEffect(() => {
    if (selectedMethod === 'PICKUP') {
      setValue('lockerLocation', '');
    }
  }, [selectedDepto, selectedMethod, setValue]);

  useEffect(() => {
    if ( address.firstName ) {
      reset(address)
    }
  },[address, reset]);

  const onSubmit = async( data: FormInputs ) => {
    // PARCHE PARA LA BASE DE DATOS Y UX
    if (data.deliveryMethod === 'PICKUP') {
      data.address = `Retiro en: ${data.lockerLocation}`;
      data.city = data.departamento; // Usamos el depto como ciudad para evitar campos vacíos
      data.postalCode = '11000';    // Código postal genérico para que Prisma no falle
      data.address2 = '';           // No hay apartamento en un locker
    }
    
    setAddress(data);
    router.push('/checkout');
  }

  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      
      {/* SECCIÓN: MÉTODO DE ENVÍO */}
      <div className="col-span-1 sm:col-span-2 bg-gray-100 p-4 rounded-md mb-4 border border-gray-200">
        <h3 className="font-bold mb-3 text-gray-700 text-lg">¿Cómo quieres recibir tu pedido?</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card: Estándar */}
        <label className={clsx("flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
          selectedMethod === 'STANDARD' 
            ? "border-pink-600 bg-pink-600/10 shadow-[0_0_15px_rgba(219,39,119,0.2)]" 
            : "bg-zinc-800 border-transparent hover:border-zinc-700")}>
          <input type="radio" value="STANDARD" {...register('deliveryMethod')} className="hidden" />
          <span className={clsx("font-bold text-lg", selectedMethod === 'STANDARD' ? "text-pink-500" : "text-gray-300")}>Estándar ($220)</span>
          <span className="text-xs text-gray-500">24-72 hs hábiles</span>
        </label>

        {/* Card: Express */}
        <label className={clsx("flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
          selectedMethod === 'EXPRESS' 
            ? "border-pink-600 bg-pink-600/10 shadow-[0_0_15px_rgba(219,39,119,0.2)]" 
            : "bg-zinc-800 border-transparent hover:border-zinc-700")}>
          <input type="radio" value="EXPRESS" {...register('deliveryMethod')} className="hidden" />
          <span className={clsx("font-bold text-lg", selectedMethod === 'EXPRESS' ? "text-pink-500" : "text-gray-300")}>Express ($350)</span>
          <span className="text-xs text-gray-500">Mismo día (Solo MVD)</span>
        </label>

        {/* Card: PICKUP */}
        <label className={clsx("flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
          selectedMethod === 'PICKUP' 
            ? "border-pink-600 bg-pink-600/10 shadow-[0_0_15px_rgba(219,39,119,0.2)]" 
            : "bg-zinc-800 border-transparent hover:border-zinc-700")}>
          <input type="radio" value="PICKUP" {...register('deliveryMethod')} className="hidden" />
          <span className={clsx("font-bold text-lg", selectedMethod === 'PICKUP' ? "text-pink-500" : "text-gray-300")}>Locker ($100)</span>
          <span className="text-xs text-gray-500">Retiro en punto Pick-up</span>
        </label>

        </div>
      </div>

      {/* EMAIL */}
      <div className="flex flex-col mb-2 col-span-1 sm:col-span-2">
        <span className="font-semibold mb-1">Correo Electrónico</span>
        <input 
          type="email" 
          className="p-3 border rounded-zinc-700 rounded-lg bg-zinc-800 text-white  focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600" 
          { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } 
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input type="text" 
        className="p-3 border rounded-zinc-700 rounded-lg bg-zinc-800 text-white  focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600" 
        { ...register('firstName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input type="text" 
        className="p-3 border rounded-zinc-700 rounded-lg bg-zinc-800 text-white  focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600" { ...register('lastName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono de contacto</span>
        <input type="text" 
        className="p-3 border rounded-zinc-700 rounded-lg bg-zinc-800 text-white  focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600" { ...register('phone', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Departamento</span>
        <select className="p-3 border rounded-zinc-700 rounded-lg bg-zinc-800 text-white  focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600" { ...register('departamento', { required: true }) }>
          <option value="">[ Seleccione ]</option>
          { selectedMethod === 'PICKUP' 
            ? Object.keys(lockersByDepto).map( dep => <option key={ dep } value={ dep }>{ dep }</option>)
            : departamentosUruguay.map( dep => <option key={ dep } value={ dep }>{ dep }</option>)
          }
        </select>
      </div>

      {/* CAMPOS DINÁMICOS DEPENDIENDO DEL MÉTODO */}
      { selectedMethod !== 'PICKUP' ? (
        <>
          <div className="flex flex-col mb-2">
            <span className="text-gray-400 mb-1">Dirección</span>
            <input 
              type="text" 
              className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:border-pink-500 transition-all" 
              { ...register('address', { required: true  }) } 
              placeholder="Calle y número" 
            />
          </div>
          
          <div className="flex flex-col mb-2">
            <span className="text-gray-400 mb-1">Apartamento / Esquina (opcional)</span>
            <input 
              type="text" 
              className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:border-pink-500 transition-all" 
              { ...register('address2') } 
            />
          </div>
          
          <div className="flex flex-col mb-2">
            <span className="text-gray-400 mb-1">Ciudad</span>
            <input 
              type="text" 
              className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:border-pink-500 transition-all" 
              { ...register('city', { required: true  }) } 
            />
          </div>
          
          <div className="flex flex-col mb-2">
            <span className="text-gray-400 mb-1">Código Postal</span>
            <input 
              type="text" 
              className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:border-pink-500 transition-all" 
              { ...register('postalCode', { required: true  }) } 
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col mb-2 col-span-1 sm:col-span-2 bg-pink-950/10 p-5 rounded-xl border border-pink-900/30 animate-in fade-in duration-500">
          <span className="font-bold text-pink-500 mb-3 uppercase tracking-wider text-sm">Punto de Retiro Disponible</span>
          <select 
            className="p-4 border-2 rounded-lg bg-zinc-900 border-pink-600 text-white text-lg focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all" 
            {...register('lockerLocation', { required: selectedMethod === 'PICKUP' })}
          >
            <option value="" className="bg-zinc-900">-- Seleccione un Locker en {selectedDepto} --</option>
            {selectedDepto && lockersByDepto[selectedDepto as keyof typeof lockersByDepto]?.map(locker => (
              <option key={locker} value={locker} className="bg-zinc-900">{locker}</option>
            ))}
          </select>
          <p className="mt-3 text-xs text-gray-400 italic">
            * Te notificaremos por mail cuando el pedido esté listo para retirar en este punto.
          </p>
        </div>
      )}
      <div className="flex flex-col mb-2 sm:mt-10 col-span-1 sm:col-span-2">
        <button
          disabled={ !isValid }
          type="submit"
          className={ clsx(
            "py-4 transition-all font-bold rounded-xl uppercase tracking-widest text-lg shadow-lg",
            { 
              'bg-pink-600 text-white hover:bg-pink-500 shadow-pink-500/20': isValid, 
              'bg-zinc-800 text-gray-600 cursor-not-allowed': !isValid 
            }
          )}
        >
          Revisar Pedido
        </button>
      </div>    
    </form>
  );
};