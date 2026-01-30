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
          
          <label className={clsx("flex flex-col p-3 border-2 rounded-xl cursor-pointer transition-all shadow-sm", 
            selectedMethod === 'STANDARD' ? "border-blue-600 bg-blue-50" : "bg-white border-transparent")}>
            <input type="radio" value="STANDARD" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold text-blue-900">Estándar ($220)</span>
            <span className="text-xs text-gray-500">24-72 hs hábiles</span>
          </label>

          <label className={clsx("flex flex-col p-3 border-2 rounded-xl cursor-pointer transition-all shadow-sm", 
            selectedMethod === 'EXPRESS' ? "border-blue-600 bg-blue-50" : "bg-white border-transparent")}>
            <input type="radio" value="EXPRESS" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold text-blue-900">Express ($350)</span>
            <span className="text-xs text-gray-500">Mismo día (Solo MVD)</span>
          </label>

          <label className={clsx("flex flex-col p-3 border-2 rounded-xl cursor-pointer transition-all shadow-sm", 
            selectedMethod === 'PICKUP' ? "border-blue-600 bg-blue-50" : "bg-white border-transparent")}>
            <input type="radio" value="PICKUP" {...register('deliveryMethod')} className="hidden" />
            <span className="font-bold text-blue-900">Locker ($100)</span>
            <span className="text-xs text-gray-500">Retiro en punto Pick-up</span>
          </label>

        </div>
      </div>

      {/* EMAIL */}
      <div className="flex flex-col mb-2 col-span-1 sm:col-span-2">
        <span className="font-semibold mb-1">Correo Electrónico</span>
        <input 
          type="email" 
          className="p-2 border rounded-md bg-white border-gray-300 focus:border-blue-500 outline-none" 
          { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } 
          placeholder="Para enviarte el recibo"
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('firstName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('lastName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono de contacto</span>
        <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('phone', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Departamento</span>
        <select className="p-2 border rounded-md bg-white border-gray-300" { ...register('departamento', { required: true }) }>
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
            <span>Dirección</span>
            <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('address', { required: true  }) } placeholder="Calle y número" />
          </div>
          <div className="flex flex-col mb-2">
            <span>Apartamento / Esquina (opcional)</span>
            <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('address2') } />
          </div>
          <div className="flex flex-col mb-2">
            <span>Ciudad</span>
            <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('city', { required: true  }) } />
          </div>
          <div className="flex flex-col mb-2">
            <span>Código Postal</span>
            <input type="text" className="p-2 border rounded-md bg-white border-gray-300" { ...register('postalCode', { required: true  }) } />
          </div>
        </>
      ) : (
        <div className="flex flex-col mb-2 col-span-1 sm:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <span className="font-bold text-blue-800 mb-2">Punto de Retiro Disponible</span>
          <select 
            className="p-3 border-2 rounded-md bg-white border-blue-500 text-lg" 
            {...register('lockerLocation', { required: selectedMethod === 'PICKUP' })}
          >
            <option value="">-- Seleccione un Locker en {selectedDepto} --</option>
            {selectedDepto && lockersByDepto[selectedDepto as keyof typeof lockersByDepto]?.map(locker => (
              <option key={locker} value={locker}>{locker}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-blue-600 italic">
            * Te notificaremos por mail cuando el pedido esté listo para retirar en este punto.
          </p>
        </div>
      )}

      <div className="flex flex-col mb-2 sm:mt-10 col-span-1 sm:col-span-2">
        <button
          disabled={ !isValid }
          type="submit"
          className={ clsx(
            "py-3 transition-all font-bold rounded-md",
            { 'btn-primary': isValid, 'btn-disabled': !isValid }
          )}
        >
          Revisar Pedido
        </button>
      </div>
    </form>
  );
};