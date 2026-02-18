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
  oldPrice?: number;
  inStock: number;
  sortOrder: number;
  color: Color[];
  tags: string;
  categoryId: string;
  isPublished: boolean;
  images?: FileList;
  isPremiumUI: boolean;
  premiumHeadline?: string;
  isBestSeller?: boolean,
  high_title_1?: string; high_desc_1?: string; high_icon_1?: string;
  high_title_2?: string; high_desc_2?: string; high_icon_2?: string;
  high_title_3?: string; high_desc_3?: string; high_icon_3?: string;
  high_title_4?: string; high_desc_4?: string; high_icon_4?: string;
  step_title_1?: string; step_desc_1?: string;
  step_title_2?: string; step_desc_2?: string;
  step_title_3?: string; step_desc_3?: string;
  feat_title_1?: string; feat_desc_1?: string;
  feat_title_2?: string; feat_desc_2?: string;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const premiumData = product.premiumData as any;
  const { ProductImage: imagesList, ...restProduct } = product;

  const { handleSubmit, register, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      ...restProduct as any,
      tags: product.tags?.join(", ") || "",
      color: product.color ?? [],
      sortOrder: product.sortOrder ?? 0,
      isPublished: product.isPublished ?? true,
      isPremiumUI: product.isPremiumUI ?? false,
      premiumHeadline: premiumData?.bannerHeadline ?? '',
      isBestSeller: product.isBestSeller ?? false,
      high_title_1: premiumData?.highlights?.[0]?.title ?? '',
      high_desc_1: premiumData?.highlights?.[0]?.desc ?? '',
      high_icon_1: premiumData?.highlights?.[0]?.icon ?? 'Zap',
      high_title_2: premiumData?.highlights?.[1]?.title ?? '',
      high_desc_2: premiumData?.highlights?.[1]?.desc ?? '',
      high_icon_2: premiumData?.highlights?.[1]?.icon ?? 'Shield',
      high_title_3: premiumData?.highlights?.[2]?.title ?? '',
      high_desc_3: premiumData?.highlights?.[2]?.desc ?? '',
      high_icon_3: premiumData?.highlights?.[2]?.icon ?? 'Smartphone',
      high_title_4: premiumData?.highlights?.[3]?.title ?? '',
      high_desc_4: premiumData?.highlights?.[3]?.desc ?? '',
      high_icon_4: premiumData?.highlights?.[4]?.icon ?? 'Wind',
      step_title_1: premiumData?.usage?.[0]?.title ?? '',
      step_desc_1: premiumData?.usage?.[0]?.desc ?? '',
      step_title_2: premiumData?.usage?.[1]?.title ?? '',
      step_desc_2: premiumData?.usage?.[1]?.desc ?? '',
      step_title_3: premiumData?.usage?.[2]?.title ?? '',
      step_desc_3: premiumData?.usage?.[2]?.desc ?? '',
      feat_title_1: premiumData?.features?.[0]?.title ?? '',
      feat_desc_1: premiumData?.features?.[0]?.desc ?? '',
      feat_title_2: premiumData?.features?.[1]?.title ?? '',
      feat_desc_2: premiumData?.features?.[1]?.desc ?? '',
    },
  });

  const isPremiumEnabled = watch("isPremiumUI");
  const selectedColors = watch("color") || [];

  const onColorChanged = (color: Color) => {
    const currentColors = new Set(selectedColors);
    currentColors.has(color) ? currentColors.delete(color) : currentColors.add(color);
    setValue("color", Array.from(currentColors), { shouldValidate: true });
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) formData.append("id", product.id);
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("sortOrder", productToSave.sortOrder.toString());
    if (productToSave.oldPrice) formData.append("oldPrice", productToSave.oldPrice.toString());
    formData.append("isBestSeller", productToSave.isBestSeller?.toString() || "false");    formData.append("inStock", productToSave.inStock.toString());
    formData.append("color", (productToSave.color || []).join(','));
    formData.append("tags", productToSave.tags || "");
    formData.append("categoryId", productToSave.categoryId);
    formData.append("isPublished", productToSave.isPublished.toString());
    formData.append("isPremiumUI", productToSave.isPremiumUI.toString());
    
    [1, 2, 3].forEach(n => {
      const file = (data as any)[`file_step_${n}`]?.[0];
      if (file) formData.append(`file_step_${n}`, file);
    });

    [1, 2].forEach(n => {
      const file = (data as any)[`file_feat_${n}`]?.[0];
      if (file) formData.append(`file_feat_${n}`, file);
    });

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

    if (images) Array.from(images).forEach(file => formData.append('images', file));
    
    const resp = await createUpdateProduct(formData);
    if (!resp?.ok) {
      alert('Error al actualizar');
      return;
    }
    router.replace(`/admin/product/${resp.product?.slug}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Columna Izquierda */}
      <div className="w-full space-y-4">
        
        {/* SECCIÓN INFORMACIÓN BÁSICA (Restaurada) */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-col mb-2 text-black">
            <span className="font-bold text-sm">Título</span>
            <input type="text" className="p-2 border rounded-md bg-white" {...register("title", { required: true })} />
          </div>

          <div className="flex flex-col mb-2 text-black">
            <span className="font-bold text-sm">Slug (URL)</span>
            <input type="text" className="p-2 border rounded-md bg-white" {...register("slug", { required: true })} />
          </div>

          <div className="flex flex-col mb-2 text-black">
            <span className="font-bold text-sm">Descripción General</span>
            <textarea rows={5} className="p-2 border rounded-md bg-white" {...register("description", { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2 text-black">
            <div className="flex flex-col">
                <span className="font-bold text-sm">Precio Oferta</span>
                <input type="number" step="0.01" className="p-2 border rounded-md bg-white" {...register("price", { required: true, min: 0 })} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Precio Original</span>
                <input type="number" step="0.01" className="p-2 border rounded-md bg-white" {...register("oldPrice", { min: 0 })} />
            </div>
          </div>

          <div className="flex items-center p-3 bg-pink-50 rounded-xl border border-pink-100 transition-all">
            <input
              type="checkbox"
              id="isBestSeller"
              {...register('isBestSeller')}
              className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500 cursor-pointer"
            />
            <label htmlFor="isBestSeller" className="ml-3 text-sm font-bold text-pink-700 cursor-pointer uppercase tracking-tight">
              Marcar como Best Seller 
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 text-black">
            <div className="flex flex-col">
                <span className="font-bold text-sm">Posición Web</span>
                <input type="number" className="p-2 border rounded-md bg-white" {...register("sortOrder", { required: true })} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Categoría</span>
              <select className="p-2 border rounded-md bg-white" {...register("categoryId", { required: true })}>
                <option value="">[Seleccione]</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col mt-3 text-black">
            <span className="font-bold text-sm">Tags</span>
            <input type="text" className="p-2 border rounded-md bg-white" {...register("tags", { required: true })} />
          </div>
        </div>

        {/* SWITCH PREMIUM */}
        <div className="flex flex-col p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('isPremiumUI')} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            <span className="ms-3 text-sm font-bold uppercase tracking-widest text-gray-300 italic">Activar Ultra UI</span>
          </label>
        </div>

        {isPremiumEnabled && (
          <div className="space-y-6">
            {/* 1. HIGHLIGHTS (Restaurados) */}
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800 space-y-4 text-black">
              <span className="text-xs font-bold text-pink-500 uppercase flex items-center gap-2">1. Iconos Destacados</span>
              <input placeholder="Headline del Banner" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm" {...register("premiumHeadline")} />
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="flex gap-2 items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                  <select className="bg-zinc-800 text-[10px] p-1 rounded text-pink-500" {...register(`high_icon_${n}` as any)}>
                    <option value="Zap">Zap</option>
                    <option value="Shield">Shield</option>
                    <option value="Smartphone">App</option>
                    <option value="Wind">Wind</option>
                  </select>
                  <input placeholder="Título" className="flex-1 bg-transparent border-b border-zinc-700 text-xs text-white" {...register(`high_title_${n}` as any)} />
                </div>
              ))}
            </div>

            {/* 2. PASOS INDIVIDUALES */}
            <div className="bg-black/20 p-5 rounded-2xl border border-zinc-800 space-y-4 text-black">
              <span className="text-xs font-bold text-blue-400 uppercase">2. Guía de Uso (Fotos Individuales)</span>
              {[1, 2, 3].map((n, i) => (
                <div key={n} className="flex flex-col gap-2 p-3 bg-zinc-900/30 rounded border border-zinc-800">
                  <div className="flex justify-between items-center gap-2">
                    <input placeholder={`Título Paso ${n}`} className="bg-transparent border-b border-zinc-700 text-sm font-bold text-white flex-1 outline-none" {...register(`step_title_${n}` as any)} />
                    { premiumData?.usage?.[i]?.img && <div className="w-10 h-10 relative"><ProductImage src={premiumData.usage[i].img} width={40} height={40} className="rounded object-cover" alt="prev" /></div> }
                  </div>
                  <input type="file" {...register(`file_step_${n}` as any)} className="text-[10px] text-zinc-500" accept="image/*" />
                  <textarea placeholder="Descripción..." className="bg-transparent text-xs text-zinc-400" rows={2} {...register(`step_desc_${n}` as any)} />
                </div>
              ))}
            </div>

            {/* 3. CARACTERÍSTICAS INDIVIDUALES */}
            <div className="bg-pink-500/5 p-5 rounded-2xl border border-pink-500/20 space-y-4 text-black">
              <span className="text-xs font-bold text-pink-500 uppercase">3. Características de Impacto</span>
              {[1, 2].map((n, i) => (
                <div key={n} className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <input placeholder={`Título Fila ${n}`} className="flex-1 bg-transparent border-b border-zinc-700 text-sm font-black text-white" {...register(`feat_title_${n}` as any)} />
                    { premiumData?.features?.[i]?.img && <div className="w-12 h-12 relative"><ProductImage src={premiumData.features[i].img} width={48} height={48} className="rounded object-cover" alt="prev" /></div> }
                  </div>
                  <input type="file" {...register(`file_feat_${n}` as any)} className="text-[10px] text-zinc-500" accept="image/*" />
                  <textarea placeholder="Descripción técnica..." className="w-full bg-transparent text-xs text-zinc-300" rows={3} {...register(`feat_desc_${n}` as any)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BOTONES DE ACCIÓN Y CHECKBOX PUBLICACIÓN (Restaurado) --- */}
        <div className="flex items-center mb-6 p-2 bg-gray-50 border rounded-lg">
          <input
            type="checkbox"
            id="isPublished"
            className="w-5 h-5 border-gray-300 rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
            {...register('isPublished')}
          />
          <label 
            htmlFor="isPublished" 
            className="ms-3 text-sm font-semibold text-gray-700 cursor-pointer select-none"
          >
            { watch('isPublished') ? 'Producto Publicado (Visible en la web)' : 'Borrador (Oculto en la web)' }
          </label>
        </div>

        <button className="btn-primary w-full bg-pink-600 hover:bg-pink-700 py-4 font-bold uppercase tracking-widest text-white rounded-xl">
          Guardar Cambios
        </button>

        {product.id && (
          <button type="button" onClick={async () => { if (confirm('¿ELIMINAR?')) { await deleteProduct(product.id!); router.replace('/admin/products'); } }} className="w-full py-2 text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase border border-red-500 rounded">
            Eliminar Producto
          </button>
        )}
      </div>

      {/* Columna Derecha: Stock, Colores y Galería */}
      <div className="w-full space-y-4">
        <div className="flex flex-col p-4 bg-gray-50 border rounded-lg text-black">
          <span className="font-bold text-sm mb-2">Stock Disponible</span>
          <input type="number" className="p-2 border rounded-md bg-white" {...register("inStock", { required: true, min: 0 })} />
        </div>

        <div className="flex flex-col p-4 bg-gray-50 border rounded-lg text-black">
          <span className="font-bold text-sm mb-2">Variantes de Color</span>
          <div className="flex flex-wrap">
            {availableColors.map((color) => (
              <div key={color} onClick={() => onColorChanged(color)} className={clsx("p-2 border cursor-pointer rounded-md mr-2 mb-2 min-w-[70px] transition-all text-center text-xs", { "bg-pink-500 text-white shadow-md": selectedColors.includes(color), "bg-white text-gray-700": !selectedColors.includes(color) })}>
                {color}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col p-4 bg-gray-50 border rounded-lg text-black">
          <span className="font-bold text-sm">Galería General</span>
          <input type="file" {...register('images')} multiple className="p-2 border rounded-md bg-white mt-2" accept="image/*" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg">
                <ProductImage alt={product.title ?? ""} src={image.url} width={300} height={300} className="object-cover aspect-square" />
                <button type="button" onClick={async () => { if (confirm('¿Borrar?')) await deleteProductImage(image.id, image.url); }} className="absolute bottom-0 w-full bg-red-600 text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
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