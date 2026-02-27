import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { AddPackToCart } from './ui/AddPackToCart';
import { ProductImage } from '@/components';

interface Props {
  params: { slug: string };
}

interface PackProductItem {
  product: {
    id: string;
    title: string;
    ProductImage: { url: string }[];
    price: number;
    description: string;
    slug: string;
  };
}

async function getPackBySlug(slug: string) {
  return prisma.pack.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        include: {
          product: {
            select: { 
              id: true,
              title: true,
              ProductImage: {
                select: { url: true },
                take: 1,
              },
              price: true, 
              description: true, 
              slug: true 
            }
          }
        }
      }
    }
  });
}

export default async function PackDetailPage({ params }: Props) {
  const pack = await getPackBySlug(params.slug);
  if (!pack) notFound();

  const saving = pack.comparePrice ? pack.comparePrice - pack.price : 0;
  const pct    = pack.comparePrice ? Math.round(saving / pack.comparePrice * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mb-20">

      {/* Header */}
      <div className="text-center mb-12">
        {pct > 0 && (
          <span className="inline-block bg-pink-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            -{pct}% OFF al comprar el pack
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">
          {pack.title}
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">{pack.description}</p>
      </div>

      {/* Productos del pack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {(pack.products as unknown as PackProductItem[]).map(({ product }, i: number) => (
          <div key={product.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="relative h-48 bg-zinc-950">
              <ProductImage
                src={product.ProductImage[0]?.url ?? ''}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-black">
                {i + 1}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-white text-base">{product.title}</h3>
              <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-zinc-600 text-sm line-through">${product.price.toLocaleString('es-UY')} solo</span>
                <Link href={`/product/${product.slug}`} className="text-[10px] text-zinc-500 hover:text-pink-400 transition-colors uppercase font-bold tracking-wider">
                  Ver producto →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA principal */}
      <div className="bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/20 rounded-3xl p-8 text-center">
        <div className="flex items-baseline justify-center gap-4 mb-2">
          <span className="text-5xl font-black text-white">${pack.price.toLocaleString('es-UY')}</span>
          {pack.comparePrice && (
            <span className="text-2xl text-zinc-600 line-through">${pack.comparePrice.toLocaleString('es-UY')}</span>
          )}
        </div>
        {saving > 0 && (
          <p className="text-emerald-400 font-bold mb-6">
            ✅ Ahorrás ${saving.toLocaleString('es-UY')} comprando los {pack.products.length} productos juntos
          </p>
        )}

        {/* El botón de agregar al carrito necesita un Client Component */}
        <AddPackToCart pack={pack as any} />
      </div>
    </div>
  );
}

