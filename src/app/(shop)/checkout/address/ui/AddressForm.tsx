"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';


import type { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';


const departamentosUruguay = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", 
  "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", 
  "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
];

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  departamento: string;
  phone: string;
}


interface Props {
  userStoredAddress?: Partial<Address>;
}


export const AddressForm = ({ userStoredAddress = {} }: Props) => {

  const router = useRouter();
  const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
    defaultValues: {
      ...(userStoredAddress as any),
      rememberAddress: false,
    }
  });

  const { data: session } = useSession({
    required: true,
  })

  const setAddress = useAddressStore( state => state.setAddress );
  const address = useAddressStore( state => state.address );



  useEffect(() => {
    if ( address.firstName ) {
      reset(address)
    }
  },[address, reset])
  




  const onSubmit = async( data: FormInputs ) => {
    
    setAddress(data);

    router.push('/checkout');

  }



  return (
    <form onSubmit={ handleSubmit( onSubmit ) }  className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('firstName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('lastName', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección 2 (opcional)</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('address2') } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Código postal</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('postalCode', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('city', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2">
        <span>Departamento (Uruguay)</span>
        <select 
          className="p-2 border rounded-md bg-gray-200" 
          { ...register('departamento', { required: true }) }
        >
          <option value="">[ Seleccione un departamento ]</option>
          {
            departamentosUruguay.map( dep => (
              <option key={ dep } value={ dep }>{ dep }</option>
            ))
          }
        </select>
      </div>
      <div className="flex flex-col mb-2">
        <span>Teléfono</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('phone', { required: true  }) } />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        

        <button
          disabled={ !isValid }
          // href="/checkout"
          type="submit"
          // className="btn-primary flex w-full sm:w-1/2 justify-center "
          className={ clsx({
            'btn-primary': isValid,
            'btn-disabled': !isValid,
          })}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
