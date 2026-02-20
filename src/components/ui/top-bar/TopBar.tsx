'use client';

import { currencyFormat } from "@/utils";

interface Props {
  freeShippingThreshold: number;
  dbMessages?: {
    messages: string[];
  }
}

export const TopBar = ({ freeShippingThreshold, dbMessages }: Props) => {
  
  // 1. Definimos los mensajes base (prioriza DB, si no, usa los de siempre)
// Usamos los mensajes de la DB o los defaults si no hay nada
  const rawMessages = dbMessages?.messages || [
    "🔥 Envíos GRATIS en compras mayores a {price}",
    "🤫 Discreción absoluta en todos tus pedidos"
  ];

  const messages = rawMessages.map(msg => 
    msg.replace('{price}', currencyFormat(freeShippingThreshold))
  );
  // Duplicamos los mensajes para que el efecto sea infinito
  const scrollingContent = [...messages, ...messages,...messages];

return (
    <div className="bg-pink-600 text-white py-1.5 overflow-hidden border-b border-pink-500 shadow-sm relative z-[60]">
      <div className="flex animate-marquee whitespace-nowrap">
        {scrollingContent.map((msg, i) => (
          <span key={i} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-10 flex items-center">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};