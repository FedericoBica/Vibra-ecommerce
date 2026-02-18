import Image from "next/image";

export const ProductSteps = ({ steps }: { steps: any[] }) => {
  if (!steps || steps.length === 0 || !steps[0].title) return null;

  return (
    <section className="py-16 bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] px-8 md:px-12 my-10 italic">
      <h2 className="text-2xl md:text-4xl font-black uppercase mb-12 italic tracking-tighter text-center md:text-left text-white">
        ¿Cómo utilizar? <span className="text-pink-600"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 ">
        {steps.map((step, i) => (
        <div key={i} className="relative p-6 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 hover:border-pink-500/30 transition-all duration-500 group overflow-hidden">
          
          {/* Número gigante decorativo de fondo */}
          <span className="absolute -right-4 -bottom-8 text-9xl font-black text-white/[0.03] italic group-hover:text-pink-500/[0.07] transition-colors select-none">
            {i + 1}
          </span>
          
          <div className="flex flex-col gap-6 relative z-10">
            
            {/* Contenedor de Imagen con Efecto */}
            <div className="relative w-full aspect-video bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-800">
              <Image 
                src={step.img || '/imgs/placeholder.jpg'} 
                alt={step.title}
                fill
                className="object-contain opacity-70 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 group-hover:opacity-100"
              />
              {/* Badge del número sobre la imagen */}
              <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="text-pink-500 font-black italic text-xs">0{i+1}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-black uppercase text-xl text-white tracking-tighter italic group-hover:text-pink-500 transition-colors">
                {step.title}
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors">
                {step.desc}
              </p>
            </div>
          </div>
        </div>        
      ))}
      </div>
    </section>
  );
};