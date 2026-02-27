import { getActivePacks } from '@/actions/packs/pack-actions';
import { PackCard } from './PackCard';

export const PacksSection = async () => {
  const packs = await getActivePacks();
  if (packs.length === 0) return null;

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packs.map((pack: any) => (
          <PackCard key={pack.id} pack={pack as any} variant="card" />
        ))}
      </div>
    </section>
  );
};