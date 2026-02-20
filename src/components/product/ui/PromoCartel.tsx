'use client';

import { useEffect, useState } from 'react';
import { X, Heart } from 'lucide-react';
import { PromoModalConfig } from '@/actions/config/store-config'; // Importa la interfaz

interface Props {
  config: PromoModalConfig;
  couponCode: string;
}

export const PromoModal = ({ config, couponCode }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!config.isActive) return;

    // Usamos el storageKey dinámico
    const hasSeenModal = localStorage.getItem(config.storageKey);
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [config.isActive, config.storageKey]);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem(config.storageKey, 'true');
  };

  if (!isOpen || !config.isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-zinc-900 border border-pink-500/30 w-full max-w-md p-8 rounded-[2rem] shadow-2xl text-center">
        
        <button onClick={closeModal} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-pink-500/20 p-4 rounded-full animate-pulse">
            <Heart size={40} className="text-pink-500 fill-pink-500" />
          </div>
        </div>

        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
          {config.title} {/* Dinámico */}
        </h2>
        
        <p className="text-zinc-400 mb-6 font-light">
          {config.subtitle} {/* Dinámico */}
        </p>

        <div className="bg-pink-600/10 border-2 border-dashed border-pink-500/50 p-4 rounded-xl mb-6">
          <span className="text-pink-500 font-black text-2xl tracking-widest uppercase">
            {couponCode} {/* El código que viene de la DB */}
          </span>
        </div>

        <button onClick={closeModal} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full transition-all uppercase tracking-widest text-sm">
          ¡Quiero mi descuento!
        </button>

        <p className="text-[10px] text-zinc-600 mt-4 uppercase">
          {config.footerText} {/* Dinámico */}
        </p>
      </div>
    </div>
  );
};