import prisma from '@/lib/prisma';
import { getAllPacks } from '@/actions/packs/pack-actions';
import { PacksAdminClient } from './[slug]/ui/PacksAdminClient';

export const revalidate = 0;

export default async function AdminPacksPage() {
  const { packs } = await getAllPacks();

  const products = await prisma.product.findMany({
    where: { inStock: { gt: 0 } },
    select: {
      id:    true,
      title: true,
      price: true,
      slug:  true,
    },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="px-4 sm:px-8 pb-24 max-w-5xl mx-auto">
      <div className="py-8 mb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full" />
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
            Packs promocionales
          </h1>
        </div>
        <p className="text-zinc-600 text-xs ml-4">
          Combinaciones de productos a precio especial
        </p>
      </div>

      <PacksAdminClient initialPacks={packs as any} allProducts={products} />
    </div>
  );
}