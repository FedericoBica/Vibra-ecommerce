import { CheckCircle2 } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export const ProductSteps = ({ steps }: Props) => {
  return (
    <section className="py-20 bg-white text-black px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic italic">
            ¿Cómo empezar?
          </h2>
          <div className="h-1 w-20 bg-pink-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Línea decorativa en Desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-zinc-100 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              {/* Número / Icono */}
              <div className="w-24 h-24 rounded-full bg-white border-4 border-zinc-50 flex items-center justify-center mb-6 shadow-xl group-hover:border-pink-500 transition-colors duration-500">
                <span className="text-4xl font-black text-zinc-200 group-hover:text-pink-500 transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Texto */}
              <h3 className="text-xl font-bold uppercase mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-100 rounded-full text-green-600">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <p className="font-bold text-sm">Privacidad Garantizada</p>
                <p className="text-xs text-zinc-500">Empaque 100% discreto sin logos externos.</p>
             </div>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-pink-600 transition-all">
            Descargar App Manual
          </button>
        </div>
      </div>
    </section>
  );
};