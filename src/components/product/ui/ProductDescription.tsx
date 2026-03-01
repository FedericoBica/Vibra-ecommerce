'use client';
import { useState } from 'react';

export const ProductDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Dividimos el texto por saltos de línea para procesarlo
  const lines = text.split('\n');

  return (
    <div className="mt-4">
      <div className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[2000px]' : 'max-h-48'}`}>
        <div className="font-light text-zinc-300 leading-8 space-y-4">
          {lines.map((line, i) => (
            <p key={i} className={line.startsWith('•') || line.startsWith('-') ? 'ml-4 font-normal text-zinc-200' : ''}>
              {line}
            </p>
          ))}
        </div>
        
        {!isExpanded && text.length > 300 && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        )}
      </div>

      {text.length > 300 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-pink-500 text-[10px] font-black uppercase mt-4 hover:underline tracking-[0.2em]"
        >
          {isExpanded ? 'Ver menos' : 'Leer descripción completa'}
        </button>
      )}
    </div>
  );
};