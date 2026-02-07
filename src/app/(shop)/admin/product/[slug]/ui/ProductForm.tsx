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
  inStock: number;
  color: Color[];
  tags: string;
  categoryId: string;
  isPublished: boolean;
  images?: FileList;

  // Campos Premium
  isPremiumUI: boolean;
  premiumHeadline?: string;
  feature_title_1?: string;
  feature_desc_1?: string;
  feature_title_2?: string;
  feature_desc_2?: string;
  feature_title_3?: string;
  feature_desc_3?: string;
  feature_title_4?: string;
  feature_desc_4?: string;

  // Agregados a la interfaz para evitar errores de TS
  step_title_1?: string;
  step_desc_1?: string;
  step_title_2?: string;
  step_desc_2?: string;
  step_title_3?: string;
  step_desc_3?: string;
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
      images: undefined,
      
      // Features Mapping
      feature_title_1: premiumData?.features?.[0]?.title ?? '',
      feature_desc_1: premiumData?.features?.[0]?.description ?? '',
      feature_title_2: premiumData?.features?.[1]?.title ?? '',
      feature_desc_2: premiumData?.features?.[1]?.description ?? '',
      feature_title_3: premiumData?.features?.[2]?.title ?? '',
      feature_desc_3: premiumData?.features?.[2]?.description ?? '',
      feature_title_4: premiumData?.features?.[3]?.title ?? '',
      feature_desc_4: premiumData?.features?.[3]?.description ?? '',
      
      // Mapping de Pasos sin el token "?"
      step_title_1: premiumData?.steps?.[0]?.title ?? '',
      step_desc_1: premiumData?.steps?.[0]?.description ?? '',
      step_title_2: premiumData?.steps?.[1]?.title ?? '',
      step_desc_2: premiumData?.steps?.[1]?.description ?? '',
      step_title_3: premiumData?.steps?.[2]?.title ?? '',
      step_desc_3: premiumData?.steps?.[2]?.description ?? '',   
    },
  });

  const isPremiumEnabled = watch("isPremiumUI");
  watch("color");

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
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("color", productToSave.color.join(','));
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("isPublished", productToSave.isPublished.toString());
    formData.append("isPremiumUI", productToSave.isPremiumUI.toString());
    
    if (productToSave.isPremiumUI) {
      const premiumJson = {
        bannerHeadline: productToSave.premiumHeadline,
        features: [
          { icon: 'Zap', title: data.feature_title_1, description: data.feature_desc_1 },
          { icon: 'Shield', title: data.feature_title_2, description: data.feature_desc_2 },
          { icon: 'Smartphone', title: data.feature_title_3, description: data.feature_desc_3 },
          { icon: 'Wind', title: data.feature_title_4, description: data.feature_desc_4 },
        ],
        steps: [
          { title: data.step_title_1, description: data.step_desc_1 },
          { title: data.step_title_2, description: data.step_desc_2 },
          { title: data.step_title_3, description: data.step_desc_3 },
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
          <span>Descripción</span>
          <textarea rows={5} className="p-2 border rounded-md bg-gray-200 text-black" {...register("description", { required: true })} />
        </div>

        <div className="flex flex-col mb-2 text-black">
          <span>Precio</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register("price", { required: true, min: 0 })} />
        </div>

        <div className="flex flex-col mb-2 text-black">
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
            <span className="ms-3 text-sm font-bold uppercase tracking-widest text-gray-300">Activar Ultra UI (Lovense)</span>
          </label>
        </div>

        {/* CAMPOS PREMIUM DINÁMICOS */}
        {isPremiumEnabled && (
          <div className="mt-8 border-t border-zinc-800 pt-6 space-y-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-pink-500 mb-2 uppercase">Headline del Banner</span>
              <input 
                placeholder="Ej: Siente el poder de la App" 
                className="p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                {...register("premiumHeadline")} 
              />
            </div>

            <span className="text-xs font-bold text-pink-500 uppercase tracking-widest block">Guía de Uso (Pasos)</span>
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col gap-2 p-3 bg-black/20 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Paso {num}</span>
                  <input 
                    placeholder="Título del paso" 
                    className="bg-transparent border-b border-zinc-700 text-sm outline-none focus:border-pink-500 py-1"
                    {...register(`step_title_${num}` as any)} 
                  />
                  <textarea 
                    placeholder="Descripción" 
                    className="bg-transparent text-xs text-zinc-400 outline-none resize-none"
                    rows={2}
                    {...register(`step_desc_${num}` as any)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLICAR / OCULTAR */}
        <div className="flex flex-col mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              {...register('isPublished')} 
              className="sr-only peer" 
            />
            <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-bold uppercase tracking-widest text-gray-300">
              { watch('isPublished') ? 'Producto Publicado' : 'Producto Oculto' }
            </span>
          </label>
        </div>

        <button className="btn-primary w-full mt-7 bg-pink-600 hover:bg-pink-700 border-none py-3 mb-5">
          Guardar Cambios
        </button>

        {/* BOTÓN ELIMINAR DEFINITIVAMENTE (Solo si el producto ya existe) */}
        {product.id && (
          <button
            type="button"
            onClick={async () => {
              if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
                await deleteProduct(product.id!);
                router.replace('/admin/products');
              }
            }}
            className="w-full mb-4 mt-2 py-2 text-red-500 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-all text-sm font-bold uppercase tracking-widest"
          >
            Eliminar Producto Definitivamente
          </button>
        )}
      </div>

      {/* Columna Derecha */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200 text-black" {...register("inStock", { required: true, min: 0 })} />
        </div>

        <div className="flex flex-col">
          <span>Colores</span>
          <div className="flex flex-wrap mt-2">
            {availableColors.map((color) => (
              <div 
                key={color} 
                onClick={() => onColorChanged(color)} 
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 min-w-[70px] transition-all text-center text-sm", 
                  { "bg-pink-500 text-white border-pink-600": getValues("color").includes(color), "bg-white text-gray-700": !getValues("color").includes(color) }
                )}
              >
                {color}
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-4 mb-4">
            <span>Subir Fotos</span>
            <input type="file" {...register('images')} multiple className="p-2 border rounded-md bg-gray-200 text-black" accept="image/*" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="relative group">
                <ProductImage alt={product.title ?? ""} src={image.url} width={300} height={300} className="rounded shadow-md" />
                <button 
                  type="button" 
                  onClick={async () => { if (confirm('¿Eliminar imagen?')) await deleteProductImage(image.id, image.url); }} 
                  className="btn-danger w-full mt-1 py-1 rounded-md text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};