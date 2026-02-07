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
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      
      {/* 1. SECCIÓN DE CABECERA (Slideshow y Compra) */}
      <div className="col-span-1 md:col-span-2 ">
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />
        <div className="hidden md:block max-h-[600px] overflow-hidden"> 
          <ProductSlideshow
            title={product.title}
            images={product.images}
          />
        </div>
      </div>

      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-xl uppercase tracking-tight`}>
          {product.title}
        </h1>
        <p className="text-2xl mb-5 font-light">${product.price}</p>

        <AddToCart 
          product={{
            ...product,
            category: product.category as any,
            color: product.color as any,
          }} 
          category={product.category as any}
        />        

        <h3 className="font-bold text-sm mt-10 uppercase tracking-widest">Descripción</h3>
        <p className="font-light text-zinc-300 leading-relaxed">{product.description}</p>
      </div>

      {/* 2. SECCIÓN ULTRA UI (LOVENSE STYLE) */}
      {product.isPremiumUI && (
        <div className="col-span-1 md:col-span-3 mt-10 fade-in space-y-20">
          
          {/* PARTE 1: Aspectos Destacados (Iconos en fondo negro) */}
          <ProductHighlights 
            headline={premiumData?.bannerHeadline}
            items={premiumData?.highlights ?? []}
          />

          {/* PARTE 2: Guía de Uso (Pasos con imágenes en B&N) */}
          <div className="bg-white">
             <ProductSteps
                steps={premiumData?.usage ?? []} 
                images={product.images} 
             />
          </div>

          {/* PARTE 3: Características de Impacto (Fotos grandes + Títulos gigantes) */}
          <div className="bg-black py-10">
            {premiumData?.features?.map((feat: any, index: number) => (
              <ProductDetailedFeature 
                key={index}
                title={feat.title}
                desc={feat.desc}
                // Mapeamos a partir de la 4ta imagen para no repetir las del inicio
                image={product.images[index + 3] || product.images[0]} 
              />
            ))}
          </div>

        </div>
        
      )}
    </div>
  );
}