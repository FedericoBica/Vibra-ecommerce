import Image from "next/image";

interface Props {
  title: string;
  desc: string;
  image: string;
  reverse?: boolean;
}

export const ProductDetailedFeature = ({ title, desc, image, reverse = false }: Props) => {
  if (!title) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto italic">
      {/* Título con acento rosa */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-8 w-1.5 bg-pink-600 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
          {title}
        </h2>
      </div>
      
      <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch gap-8`}>
        
        {/* Contenedor de Imagen con Glow Rosa al Hover */}
        <div className="w-full md:w-5/12 group relative">
          <div className="absolute -inset-1 bg-pink-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
            <Image 
              src={image} 
              alt={title} 
              fill 
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
          </div>
        </div>

        {/* Bloque de Texto con gradiente sutil y borde rosa */}
      <div className="w-full md:w-7/12 relative group">
        <div className="h-full p-8 md:p-14 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800 group-hover:border-pink-500/20 transition-all duration-700 flex items-center">
          <div className="space-y-6">
            <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed italic">
              {desc}
            </p>
            <div className="h-[2px] w-8 bg-pink-600/30 group-hover:w-16 group-hover:bg-pink-600 transition-all duration-700"></div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};