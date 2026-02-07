"use client";

import { useForm } from "react-hook-form";
import { Category, Color, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/components';
import { deleteProduct } from "@/actions/product/delete-product";
import clsx from "clsx";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[], isPublished?: boolean, isPremiumUI?: boolean; premiumData?: any; };
  categories: Category[];
}

const availableColors: Color[] = ["Rosa", "Negro", "Violeta", "Rojo", "Azul", "Gris", "Blanco"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number; // Campo para descuento
  inStock: number;
  color: Color[];
  tags: string;
  categoryId: string;
  isPublished: boolean;
  images?: FileList;

  // --- CAMPOS PREMIUM ULTRA UI ---
  isPremiumUI: boolean;
  premiumHeadline?: string;

  // 1. Aspectos Destacados (Iconos)
  high_title_1?: string; high_desc_1?: string; high_icon_1?: string;
  high_title_2?: string; high_desc_2?: string; high_icon_2?: string;
  high_title_3?: string; high_desc_3?: string; high_icon_3?: string;
  high_title_4?: string; high_desc_4?: string; high_icon_4?: string;

  // 2. Cómo Utilizar (Pasos)
  step_title_1?: string; step_desc_1?: string;
  step_title_2?: string; step_desc_2?: string;
  step_title_3?: string; step_desc_3?: string;

  // 3. Características (Filas de impacto)
  feat_title_1?: string; feat_desc_1?: string;
  feat_title_2?: string; feat_desc_2?: string;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const premiumData = product.premiumData as any;
  const { ProductImage: imagesList, ...restProduct } = product;

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...restProduct as any,
      tags: product.tags?.join(", "),
      color: product.color ?? [],
      isPublished: product.isPublished ?? true,
      isPremiumUI: product.isPremiumUI ?? false,
      premiumHeadline: premiumData?.bannerHeadline ?? '',
      
      // Mapeo Highlights (Iconos)
      high_title_1: premiumData?.highlights?.[0]?.title ?? '',
      high_desc_1: premiumData?.highlights?.[0]?.desc ?? '',
      high_icon_1: premiumData?.highlights?.[0]?.icon ?? 'Zap',
      high_title_2: premiumData?.highlights?.[1]?.title ?? '',
      high_desc_2: premiumData?.highlights?.[1]?.desc ?? '',
      high_icon_2: premiumData?.highlights?.[1]?.icon ?? 'Shield',
      high_title_3: premiumData?.highlights?.[2]?.title ?? '',
      high_desc_3: premiumData?.highlights?.[2]?.desc ?? '',
      high_icon_3: premiumData?.highlights?.[3]?.icon ?? 'Smartphone',
      high_title_4: premiumData?.highlights?.[3]?.title ?? '',
      high_desc_4: premiumData?.highlights?.[3]?.desc ?? '',
      high_icon_4: premiumData?.highlights?.[3]?.icon ?? 'Wind',

      // Mapeo Usage (Pasos)
      step_title_1: premiumData?.usage?.[0]?.title ?? '',
      step_desc_1: premiumData?.usage?.[0]?.desc ?? '',
      step_title_2: premiumData?.usage?.[1]?.title ?? '',
      step_desc_2: premiumData?.usage?.[1]?.desc ?? '',
      step_title_3: premiumData?.usage?.[2]?.title ?? '',
      step_desc_3: premiumData?.usage?.[2]?.desc ?? '',

      // Mapeo Features (Filas)
      feat_title_1: premiumData?.features?.[0]?.title ?? '',
      feat_desc_1: premiumData?.features?.[0]?.desc ?? '',
      feat_title_2: premiumData?.features?.[1]?.title ?? '',
      feat_desc_2: premiumData?.features?.[1]?.desc ?? '',
    },
  });

  const isPremiumEnabled = watch("isPremiumUI");

  const onColorChanged = (color: Color) => {
    const currentColors = new Set(getValues("color"));
    currentColors.has(color) ? currentColors.delete(color) : currentColors.add(color);
    setValue("color", Array.from(currentColors));
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) formData.append("id", product.id);
    
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    if (productToSave.oldPrice) formData.append("oldPrice", productToSave.oldPrice.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("color", productToSave.color.join(','));
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("isPublished", productToSave.isPublished.toString());
    formData.append("isPremiumUI", productToSave.isPremiumUI.toString());
    
    if (productToSave.isPremiumUI) {
      const premiumJson = {
        bannerHeadline: data.premiumHeadline,
        highlights: [
          { icon: data.high_icon_1, title: data.high_title_1, desc: data.high_desc_1 },
          { icon: data.high_icon_2, title: data.high_title_2, desc: data.high_desc_2 },
          { icon: data.high_icon_3, title: data.high_title_3, desc: data.high_desc_3 },
          { icon: data.high_icon_4, title: data.high_title_4, desc: data.high_desc_4 },
        ],
        usage: [
          { title: data.step_title_1, desc: data.step_desc_1 },
          { title: data.step_title_2, desc: data.step_desc_2 },
          { title: data.step_title_3, desc: data.step_desc_3 },
        ],
        features: [
          { title: data.feat_title_1, desc: data.feat_desc_1 },
          { title: data.feat_title_2, desc: data.feat_desc_2 },
        ]
      };
      formData.append("premiumData", JSON.stringify(premiumJson));
    }

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData);
    if (!ok) {
      alert('Error al actualizar');
      return;
    }

    router.replace(`/admin/product/${updatedProduct?.slug}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Columna Izquierda */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200 text-black" {...register("title", { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200 text-black" {...register("slug", { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción General</span>
          <textarea rows={5} className="p-2 border rounded-md bg-gray-200 text-black" {...register("description", { required: true })} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex flex-col text-black">
              <span>Precio Actual (Oferta)</span>
              <input type="number" step="0.01" className="p-2 border rounded-md bg-gray-200" {...register("price", { required: true, min: 0 })} />
          </div>
          <div className="flex flex-col text-black">
              <span>Precio Original (Descuento)</span>
              <input type="number" step="0.01" className="p-2 border rounded-md bg-gray-200" {...register("oldPrice", { min: 0 })} />
          </div>
        </div>

        <div className="flex flex-col text-black mb-2">
            <span>Tags</span>
            <input type="text" className="p-2 border rounded-md bg-gray-200" {...register("tags", { required: true })} />
        </div>

        <div className="flex flex-col mb-4 text-black">
          <span>Categoría</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register("categoryId", { required: true })}>
            <option value="">[Seleccione]</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* MODO PREMIUM SWITCH */}
        <div className="flex flex-col mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('isPremiumUI')} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            <span className="ms-3 text-sm font-bold uppercase tracking-widest text-gray-300 italic">Activar Ultra UI (Lovense Style)</span>
          </label>
        </div>

        {/* CAMPOS PREMIUM DINÁMICOS */}
        {isPremiumEnabled && (
          <div className="mt-8 border-t border-zinc-800 pt-6 space-y-10">
            
            {/* 1. ASPECTOS DESTACADOS (ICONOS) */}
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                1. Aspectos Destacados (Iconos)
              </span>
              <input placeholder="Headline del Banner Premium" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm" {...register("premiumHeadline")} />
              
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="flex gap-2 items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                    <select className="bg-zinc-800 text-[10px] p-1 rounded border-none text-pink-500 font-bold" {...register(`high_icon_${n}` as any)}>
                      <option value="Zap">Zap (Rayo)</option>
                      <option value="Shield">Shield (Escudo)</option>
                      <option value="Smartphone">App (Celular)</option>
                      <option value="Wind">Wind (Aire)</option>
                    </select>
                    <input placeholder="Título" className="flex-1 bg-transparent border-b border-zinc-700 text-xs py-1 outline-none focus:border-pink-500" {...register(`high_title_${n}` as any)} />
                    <input placeholder="Desc. Breve" className="flex-1 bg-transparent border-b border-zinc-700 text-[10px] py-1 outline-none text-zinc-400" {...register(`high_desc_${n}` as any)} />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CÓMO UTILIZAR (PASOS) */}
            <div className="bg-black/20 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">2. Cómo Utilizar (3 Pasos)</span>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col gap-1 p-3 bg-zinc-900/30 rounded border border-zinc-800">
                    <input placeholder={`Paso ${n}: Título`} className="bg-transparent border-b border-zinc-700 text-sm font-bold outline-none" {...register(`step_title_${n}` as any)} />
                    <textarea placeholder="Descripción detallada del paso..." className="bg-transparent text-xs text-zinc-400 outline-none resize-none" rows={2} {...register(`step_desc_${n}` as any)} />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CARACTERÍSTICAS (FILAS DE IMPACTO) */}
            <div className="bg-pink-500/5 p-5 rounded-2xl border border-pink-500/20 space-y-4">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">3. Características de Impacto (2 Filas)</span>
              {[1, 2].map(n => (
                <div key={n} className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <input placeholder={`Título Largo Fila ${n}`} className="w-full bg-transparent border-b border-zinc-700 text-sm font-black uppercase italic mb-2 outline-none" {...register(`feat_title_${n}` as any)} />
                  <textarea placeholder="Descripción larga con detalles técnicos..." className="w-full bg-transparent text-xs text-zinc-300 outline-none" rows={3} {...register(`feat_desc_${n}` as any)} />
                </div>
              ))}
            </div>

          </div>
        )}

        <div className="flex flex-col my-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('isPublished')} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-bold uppercase tracking-widest text-gray-300">
              { watch('isPublished') ? 'Producto Publicado' : 'Producto Oculto' }
            </span>
          </label>
        </div>

        <button className="btn-primary w-full bg-pink-600 hover:bg-pink-700 border-none py-4 font-bold uppercase tracking-widest mb-4">
          Guardar Producto
        </button>

        {product.id && (
          <button
            type="button"
            onClick={async () => {
              if (confirm('¿ELIMINAR DEFINITIVAMENTE?')) {
                await deleteProduct(product.id!);
                router.replace('/admin/products');
              }
            }}
            className="w-full py-2 text-red-500 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-all text-[10px] font-bold uppercase"
          >
            Zona de Peligro: Eliminar
          </button>
        )}
      </div>

      {/* Columna Derecha */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Stock Disponible</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200 text-black" {...register("inStock", { required: true, min: 0 })} />
        </div>

        <div className="flex flex-col">
          <span>Variantes de Color</span>
          <div className="flex flex-wrap mt-2">
            {availableColors.map((color) => (
              <div 
                key={color} 
                onClick={() => onColorChanged(color)} 
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 min-w-[70px] transition-all text-center text-xs font-medium", 
                  { "bg-pink-500 text-white border-pink-600 shadow-lg": getValues("color").includes(color), "bg-white text-gray-700": !getValues("color").includes(color) }
                )}
              >
                {color}
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-4 mb-4">
            <span className="font-bold">Galería de Imágenes</span>
            <input type="file" {...register('images')} multiple className="p-2 border rounded-md bg-gray-200 text-black mt-2" accept="image/*" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg">
                <ProductImage alt={product.title ?? ""} src={image.url} width={300} height={300} className="object-cover aspect-square" />
                <button 
                  type="button" 
                  onClick={async () => { if (confirm('¿Borrar imagen?')) await deleteProductImage(image.id, image.url); }} 
                  className="absolute bottom-0 w-full bg-red-600 text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                >
                  ELIMINAR
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};