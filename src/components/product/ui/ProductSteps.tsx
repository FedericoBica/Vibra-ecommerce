import Image from "next/image";

export const ProductSteps = ({ steps, images }: { steps: any[], images: string[] }) => {
  if (!steps || steps.length === 0 || !steps[0].title) return null;

  return (
    <section className="py-20 bg-white text-black px-6">
      <h2 className="text-3xl md:text-5xl font-black uppercase mb-12 italic tracking-tighter text-center md:text-left">
        ¿Cómo utilizar?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center md:items-start gap-5 group">
            {/* Imagen B&N */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200">
              <Image 
                src={images[i + 1] || images[0]} 
                alt={step.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Texto del paso */}
            <div className="flex flex-col">
              <span className="text-pink-600 font-black text-[10px] uppercase mb-1">Paso 0{i+1}</span>
              <h4 className="font-bold uppercase text-sm mb-2 leading-none tracking-tight">{step.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};