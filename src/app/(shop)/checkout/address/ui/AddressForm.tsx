"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useAddressStore, useCartStore } from '@/store';
import type { Address } from '@/interfaces';

// --- CONFIGURACIÓN DE LOCKERS ---
const lockersByDepto = {
  Montevideo: [
    "Parking Euskadi", "Disa Buceo", "Red Pagos RedRodó (Pque. Rodó)",
    "Parking Catedral (Ciudad Vieja)", "Mercado Williman", "Ancap Brito del Pino",
    "Ancap Servicentro Sayago", "Ancap Barra de Carrasco", "Disa Malvín",
    "Galeria Paso Molino", "Ancap Parque Posadas", "Ancap Libertador (Centro)",
    "MOM (Buceo)", "Farmacia Pigalle (Cordon)", "Farmacia Pigalle - 3 (Pocitos)",
    "UAM (Unidad Agroalimentaria)", "Parking Española (Tres Cruces)",
    "Parking Independencia(Ciudad Vieja)", "Ancap Punto Clinicas",
    "RedPagos - Del Parque (Parque Rodo)", "Districad - Oficina Central"
  ],
  Canelones: ["Ancap Shangrilá", "Ancap El Pinar", "Ancap Las Piedras"],
  Maldonado: ["Punta Shopping"],
};

const departamentosUruguay = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", 
  "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", 
  "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
];

// Extendemos el tipo para incluir el campo de la cédula
type FormInputs = Address & {
  dni?: string;
};

interface Props {
  userStoredAddress?: Partial<Address>;
  shippingConfig: {
    prices: { EXPRESS: number; STANDARD: number; PICKUP: number };
    freeShippingThreshold: number;
  };
}

export const AddressForm = ({ userStoredAddress = {}, shippingConfig }: Props) => {
  const router = useRouter();
  
  const { subTotal } = useCartStore(state => 
    state.getSummaryInformation(shippingConfig.freeShippingThreshold)
  );
  const isFreeShipping = subTotal >= shippingConfig.freeShippingThreshold;

  const { handleSubmit, register, formState: { isValid, errors }, reset, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      deliveryMethod: 'STANDARD',
      departamento: 'Montevideo',
      dni: ''
    }
  });

  const setAddress = useAddressStore( state => state.setAddress );
  const address = useAddressStore( state => state.address );

  const selectedMethod = watch('deliveryMethod');
  const selectedDepto = watch('departamento');

  // Limpiar locker si cambia de depto o método
  useEffect(() => {
    if (selectedMethod === 'PICKUP') {
        setValue('lockerLocation', '');
        setValue('dni', '');
    }
  }, [selectedDepto, selectedMethod, setValue]);

  useEffect(() => {
    if ( address.firstName ) reset(address);
  },[address, reset]);

const onSubmit = async( data: FormInputs ) => {
    if (data.deliveryMethod === 'PICKUP') {
      // Dejamos el DNI intacto en el objeto 'data'
      data.address = data.lockerLocation || ''; 
      data.city = data.departamento;
      data.postalCode = '11000';
      data.address2 = '';
    }    
    setAddress({
      ...data,
      dni: data.dni || '',
    });
    router.push('/checkout');
  };

  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      
      {/* SECCIÓN MÉTODOS DE ENVÍO */}
      <div className="col-span-1 sm:col-span-2 bg-zinc-900/50 p-6 rounded-2xl mb-4 border border-zinc-800 shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-200 text-lg uppercase tracking-tight">Método de entrega</h3>
          {isFreeShipping && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold animate-pulse">
              ✨ ENVÍO GRATIS ACTIVADO
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Estándar */}
          <label className={clsx(
            "flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
            selectedMethod === 'STANDARD' ? "border-pink-600 bg-pink-600/10" : "bg-zinc-800/40 border-zinc-800 hover:border-zinc-700"
          )}>
            <input type="radio" value="STANDARD" {...register('deliveryMethod')} className="hidden" />
            <span className={clsx("font-bold", selectedMethod === 'STANDARD' ? "text-pink-500" : "text-gray-300")}>
              {isFreeShipping ? 'Envío Gratis' : `Estándar ($${shippingConfig.prices.STANDARD})`}
            </span>
            <span className="text-xs text-gray-400">24-72 hs hábiles</span>
          </label>

          {/* Express */}
          {!isFreeShipping && (
            <label className={clsx(
              "flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
              selectedMethod === 'EXPRESS' ? "border-pink-600 bg-pink-600/10" : "bg-zinc-800/40 border-zinc-800 hover:border-zinc-700"
            )}>
              <input type="radio" value="EXPRESS" {...register('deliveryMethod')} className="hidden" />
              <span className={clsx("font-bold", selectedMethod === 'EXPRESS' ? "text-pink-500" : "text-gray-300")}>
                Express (${shippingConfig.prices.EXPRESS})
              </span>
              <span className="text-xs text-gray-400">Mismo día (Solo MVD)</span>
            </label>
          )}

          {/* Locker */}
          <label className={clsx(
            "flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300", 
            selectedMethod === 'PICKUP' ? "border-pink-600 bg-pink-600/10" : "bg-zinc-800/40 border-zinc-800 hover:border-zinc-700"
          )}>
            <input type="radio" value="PICKUP" {...register('deliveryMethod')} className="hidden" />
            <span className={clsx("font-bold", selectedMethod === 'PICKUP' ? "text-pink-500" : "text-gray-300")}>
              Locker ({isFreeShipping ? 'Gratis' : `$${shippingConfig.prices.PICKUP}`})
            </span>
            <span className="text-xs text-gray-400">Puntos Pick-up</span>
          </label>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="flex flex-col mb-2 col-span-1 sm:col-span-2">
        <span className="text-sm font-semibold mb-1 text-gray-400">Correo Electrónico</span>
        <input type="email" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none focus:border-pink-500" { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm font-semibold mb-1 text-gray-400">Nombres</span>
        <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none focus:border-pink-500" { ...register('firstName', { required: true }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm font-semibold mb-1 text-gray-400">Apellidos</span>
        <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none focus:border-pink-500" { ...register('lastName', { required: true }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm font-semibold mb-1 text-gray-400">Teléfono</span>
        <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none focus:border-pink-500" { ...register('phone', { required: true }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm font-semibold mb-1 text-gray-400">Departamento</span>
        <select className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none focus:border-pink-500" { ...register('departamento', { required: true }) }>
          <option value="">[ Seleccione ]</option>
          { selectedMethod === 'PICKUP' 
            ? Object.keys(lockersByDepto).map( dep => <option key={ dep } value={ dep }>{ dep }</option>)
            : departamentosUruguay.map( dep => <option key={ dep } value={ dep }>{ dep }</option>)
          }
        </select>
      </div>

      {/* DIRECCIÓN TRADICIONAL */}
      { selectedMethod !== 'PICKUP' ? (
        <>
          <div className="flex flex-col mb-2">
            <span className="text-sm font-semibold mb-1 text-gray-400">Dirección</span>
            <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none" { ...register('address', { required: true }) } />
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm font-semibold mb-1 text-gray-400">Apto / Esquina</span>
            <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none" { ...register('address2') } />
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm font-semibold mb-1 text-gray-400">Ciudad</span>
            <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none" { ...register('city', { required: true }) } />
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-sm font-semibold mb-1 text-gray-400">Código Postal</span>
            <input type="text" className="p-3 border rounded-lg bg-zinc-800 border-zinc-700 text-white focus:outline-none" { ...register('postalCode', { required: true }) } />
          </div>
        </>
      ) : (
        // SECCIÓN DE LOCKER DINÁMICA
        <div className="col-span-1 sm:col-span-2 bg-pink-900/10 p-6 rounded-xl border border-pink-600/30 animate-in fade-in zoom-in duration-300">
          <h4 className="text-pink-500 font-bold uppercase text-sm mb-4 tracking-widest">Información del Punto de Retiro</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 mb-2 uppercase">Seleccionar Punto</span>
              <select 
                className="p-3 border-2 rounded-lg bg-zinc-900 border-pink-600 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all" 
                {...register('lockerLocation', { required: selectedMethod === 'PICKUP' })}
              >
                <option value="">-- ¿Dónde retiras? --</option>
                {selectedDepto && (lockersByDepto as any)[selectedDepto]?.map((locker: string) => (
                  <option key={locker} value={locker}>{locker}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 mb-2 uppercase">Últimos 4 dígitos CI</span>
              <input 
                type="text"
                placeholder="0000"
                maxLength={4}
                className={clsx(
                    "p-3 border-2 rounded-lg bg-zinc-900 text-white focus:outline-none transition-all placeholder:text-zinc-700",
                    errors.dni ? "border-red-500" : "border-pink-600"
                )}
                {...register('dni', { 
                  required: selectedMethod === 'PICKUP',
                  minLength: 4,
                  pattern: /^[0-9]*$/ 
                })}
              />
              <span className="text-[10px] text-zinc-500 mt-1 italic">Necesario para abrir el locker</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col mb-2 sm:mt-10 col-span-1 sm:col-span-2">
        <button 
          disabled={ !isValid } 
          type="submit" 
          className={ clsx(
            "py-4 font-bold rounded-xl uppercase transition-all tracking-widest", 
            { 
              'bg-pink-600 text-white hover:bg-pink-500 shadow-lg shadow-pink-600/20': isValid, 
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