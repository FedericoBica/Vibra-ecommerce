import { Zap, Shield, Smartphone, Wind, HelpCircle } from 'lucide-react';

const iconMap: Record<string, any> = { Zap, Shield, Smartphone, Wind };

export const ProductHighlights = ({ items, headline }: { items: any[], headline?: string }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-black text-white py-16 px-4 rounded-3xl mt-10 italic">
      {headline && (
        <h2 className="text-center text-2xl md:text-4xl font-black uppercase mb-12 tracking-tighter italic">
          {headline}
        </h2>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {items.map((item, i) => {
          const IconComponent = iconMap[item.icon] || HelpCircle;
          return (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="text-pink-500 mb-4 p-4 bg-pink-500/10 rounded-full group-hover:scale-110 transition-transform">
                <IconComponent size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-sm uppercase mb-1 tracking-widest">{item.title}</h3>
              <p className="text-zinc-500 text-[11px] leading-tight max-w-[160px]">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};