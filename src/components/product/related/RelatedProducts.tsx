import { ProductGridItem } from "../../products/product-grid/ProductGridItem";
import prisma from "@/lib/prisma";

interface Props {
  categoryId: string;
  currentProductId: string;
}

export const RelatedProducts = async ({ categoryId, currentProductId }: Props) => {
  
  // 1. Buscamos productos con stock, que no sean el actual.
const dbProducts = await prisma.product.findMany({
  where: { 
    id: { not: currentProductId }, 
    inStock: { gt: 0 },
    isPublished: true 
  },
  take: 10,
  include: { ProductImage: true }
});

  if (dbProducts.length === 0) return null;

  // 2. Mapeamos los productos para que el formato de imagen sea compatible con ProductGridItem
const relatedProducts = dbProducts
  .sort(() => 0.5 - Math.random()) // Mezcla simple
  .slice(0, 4) // Toma 4
  .map(p => ({ ...p, images: p.ProductImage.map(i => i.url) }));

  return (
    <div className="mt-20 pb-20 border-t border-zinc-800 pt-10 px-5 sm:px-0">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-8 italic">
        También te puede gustar <span className="text-pink-500"></span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductGridItem 
            key={product.id} 
            product={product as any} 
          />
        ))}
      </div>
    </div>
  );
};