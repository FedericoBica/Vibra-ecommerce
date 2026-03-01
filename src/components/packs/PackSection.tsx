import { getActivePacks } from '@/actions/packs/pack-actions';
import { PackCard } from './PackCard';

export const PacksSection = async () => {
  const packs = await getActivePacks();
  if (packs.length === 0) return null;

  return (
    <section className="py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-6">
        <div>
          <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-2">
            Ofertas especiales
          </p>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            Packs <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">exclusivos</span>
          </h2>
        </div>
        <p className="text-xs text-zinc-600 italic hidden sm:block">
          Combinaciones pensadas para vos
        </p>
      </div>

      {/* Carrusel mobile / grilla desktop */}
      <div className="relative">
        {/* Fade derecha en mobile para hint de scroll */}
        <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none sm:hidden" />

        <div
          className="
            flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory px-4
            scrollbar-none
            sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0
            lg:grid-cols-3 sm:px-0
          "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {packs.map((pack: any) => (
            <div
              key={pack.id}
              className="
                flex-none w-[82vw] max-w-xs snap-start
                sm:w-auto sm:max-w-none
              "
            >
              <PackCard pack={pack as any} variant="card" />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicadores — solo mobile */}
      {packs.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
          {packs.map((_: any, i: number) => (
            <span
              key={i}
              className={`block rounded-full bg-zinc-700 transition-all ${i === 0 ? 'w-4 h-1.5 bg-pink-500' : 'w-1.5 h-1.5'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};