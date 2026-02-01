'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
  quantity: number;

  onQuantityChanged: ( value: number ) => void; 
}



export const QuantitySelector = ( { quantity, onQuantityChanged }: Props ) => {


  const onValueChanged = ( value: number ) => {
    
    if ( quantity + value < 1 ) return;

    onQuantityChanged( quantity + value );
  };


  return (
    <div className="flex items-center bg-zinc-900 rounded-lg w-fit p-1 border border-zinc-800">
      <button 
        onClick={ () => onValueChanged( -1 ) }
        className="p-2 hover:text-pink-500 text-gray-400 transition-colors"
      >
        <IoRemoveCircleOutline size={ 25 } />
      </button>

      <span className="w-12 text-center font-bold text-gray-100">
        { quantity }
      </span>

      <button 
        onClick={ () => onValueChanged( +1 ) }
        className="p-2 hover:text-pink-500 text-gray-400 transition-colors"
      >
        <IoAddCircleOutline size={ 25 } />
      </button>
    </div>
  );
};