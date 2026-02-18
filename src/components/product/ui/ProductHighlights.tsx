import { Zap, Shield, Smartphone, Wind, HelpCircle } from 'lucide-react';

const iconMap: Record<string, any> = { Zap, Shield, Smartphone, Wind };

export const ProductHighlights = ({ items, headline }: { items: any[], headline?: string }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-zinc-900/50 to-transparent border border-zinc-800/50 text-white py-16 px-6 rounded-[2.5rem] mt-10 italic">
      {headline && (
        <h2 className="text-center text-xl md:text-3xl font-black uppercase mb-16 tracking-tighter italic">
          {headline}
        </h2>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
        {items.map((item, i) => {
          const IconComponent = iconMap[item.icon] || HelpCircle;
          return (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="text-pink-500 mb-5 p-4 bg-pink-500/5 rounded-full border border-pink-500/10 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
                <IconComponent size={28} strokeWidth={1.2} />
              </div>
              <h3 className="font-bold text-xs uppercase mb-2 tracking-widest text-zinc-200">{item.title}</h3>
              <p className="text-zinc-500 text-[10px] leading-relaxed max-w-[150px] font-medium">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};