// 1. Definimos qué es una Feature
interface Feature {
  icon: string;
  title: string;
  description: string;
}

// 2. Actualizamos las Props para incluir el headline
interface Props {
  features: Feature[];
  headline?: string; // <-- Agregamos esto como opcional
}

export const PremiumFeatures = ({ features, headline }: Props) => {
  return (
    <section className="bg-black text-white py-16 px-4 rounded-3xl mt-10">
      {/* Si hay headline, lo mostramos */}
      {headline && (
        <h2 className="text-center text-2xl md:text-4xl font-black uppercase mb-12 tracking-tighter italic">
          {headline}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors">
            {/* Aquí luego podemos mapear los iconos dinámicamente */}
            <div className="text-pink-500 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">
                {feature.icon}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 uppercase">{feature.title}</h3>
            <p className="text-zinc-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};