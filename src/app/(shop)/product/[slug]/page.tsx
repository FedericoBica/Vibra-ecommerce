export const revalidate = 604800; //7 días

import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { titleFont } from "@/config/fonts";
import {
  ProductMobileSlideshow,
  ProductSlideshow,
} from "@/components";
import { getProductBySlug } from "@/actions";
import { AddToCart } from './ui/AddToCart';

// NUEVOS COMPONENTES PREMIUM
import { ProductHighlights } from "@/components/product/ui/ProductHighlights";
import { ProductDetailedFeature } from "@/components/product/ui/PremiumFeatures";
import { ProductSteps } from "@/components/product/ui/ProductSteps";
import { RelatedProducts } from "@/components/product/related/RelatedProducts";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      images: [ `/products/${ product?.images[1] }`],
    },
  };
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const premiumData = product.premiumData as any;

  return (
    <div className="mt-5 mb-20 flex flex-col">
      
      {/* 1. SECCIÓN DE CABECERA (Slideshow y Compra) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 md:col-span-2">
          <ProductMobileSlideshow
            title={product.title}
            images={product.images}
            className="block md:hidden"
          />
          <div className="hidden md:block max-h-[600px] overflow-hidden rounded-xl"> 
            <ProductSlideshow
              title={product.title}
              images={product.images}
            />
          </div>
        </div>

        <div className="col-span-1 px-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-pink-500">
              {[1, 2, 3, 4, 5].map((index) => (
                <span key={index}>
                  {product.rating >= index ? (
                    <IoStar size={14} className="fill-current" />
                  ) : product.rating >= index - 0.5 ? (
                    <IoStarHalf size={14} className="fill-current" />
                  ) : (
                    <IoStarOutline size={14} className="text-zinc-700" />
                  )}
                </span>
              ))}
            </div>            
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
              {product.reviewCount || 0} Ratings
            </span>
          </div>
          <h1 className={`${titleFont.className} antialiased font-bold text-2xl uppercase tracking-tight italic`}>
            {product.title}
          </h1>
          
          {/* PRECIO CON DESCUENTO DINÁMICO */}
          <div className="flex flex-col gap-1 mt-4 mb-6">
            <div className="flex flex-wrap items-baseline gap-3">
              {/* Precio Vigente */}
              <span className="text-4xl font-black text-white italic tracking-tighter">
                ${product.price.toLocaleString('es-UY')}
              </span>

              {/* Contenedor de Precio Viejo y Badge - Ahora más compacto */}
              {product.oldPrice && product.oldPrice > product.price && (
                <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 py-1 px-2 rounded-lg">
                  <span className="text-sm text-zinc-500 line-through decoration-white/30">
                    ${product.oldPrice.toLocaleString('es-UY')}
                  </span>
                  
                  <span className="text-pink-500 text-[10px] font-black uppercase tracking-tighter">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>
          <AddToCart 
            product={{
              ...product,
              category: product.category as any,
              color: product.color as any,
            }} 
            category={product.category as any}
          />        

          <h3 className="font-black text-xs mt-10 uppercase tracking-[0.2em] text-zinc-500">Descripción</h3>
          <p className="font-light text-zinc-300 leading-relaxed mt-2">{product.description}</p>
        </div>
      </div>

      {/* 2. SECCIÓN ULTRA UI (Solo si es Premium) */}
      {product.isPremiumUI && (
        <div className="mt-16 space-y-24"> {/* Espaciado grande entre secciones para que respiren */}
          
          {/* Los fondos los manejamos dentro de cada componente ahora */}
          <ProductHighlights 
            headline={premiumData?.bannerHeadline}
            items={premiumData?.highlights ?? []}
          />

          <ProductSteps steps={premiumData?.usage ?? []} />

          <div className="space-y-10">
            {premiumData?.features?.map((feat: any, index: number) => (
              <ProductDetailedFeature 
                key={index}
                title={feat.title}
                desc={feat.desc}
                image={feat.img || product.images[0]} 
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      )}
      {/* 3. PRODUCTOS RELACIONADOS (Siempre visible al final) */}
      <div className="mt-20">
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>
      
    </div>
  );
}