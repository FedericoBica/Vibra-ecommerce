'use client';

export const TopBar = () => {
  const messages = [
    "🔥 Envíos GRATIS en compras mayores a $2.500",
    "🤫 Discreción absoluta en todos tus pedidos",
  ];

  // Duplicamos los mensajes para que el efecto sea infinito
  const scrollingContent = [...messages, ...messages];

  return (
    <div className="bg-pink-600 text-white py-1.5 overflow-hidden border-b border-pink-500 shadow-sm relative z-[60]">
      <div className="flex animate-marquee whitespace-nowrap">
        {scrollingContent.map((msg, i) => (
          <span 
            key={i} 
            className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-10 flex items-center"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};