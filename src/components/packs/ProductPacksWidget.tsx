import { getPacksByProduct } from '@/actions/packs/pack-actions';
import { PackCard } from './PackCard';

interface Props {
  productId: string;
}

export const ProductPacksWidget = async ({ productId }: Props) => {
  const packs = await getPacksByProduct(productId);
  if (packs.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full" />
        <div>
          <h3 className="font-black text-white uppercase tracking-tight text-lg">
            Completá tu experiencia
          </h3>
          <p className="text-zinc-500 text-xs">Este producto forma parte de estos packs especiales</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {packs.map((pack: any) => (
          <PackCard key={pack.id} pack={pack as any} variant="compact" />
        ))}
      </div>
    </section>
  );
};