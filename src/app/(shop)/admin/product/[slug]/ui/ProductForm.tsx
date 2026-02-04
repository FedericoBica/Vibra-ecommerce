"use client";

import { useForm } from "react-hook-form";
import { Category, Color, Product, ProductImage as ProductWithImage } from "@/interfaces";
import Image from "next/image";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/components';
import { deleteProduct } from "@/actions/product/delete-product";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[],isPublished?: boolean };
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
}

export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      color: product.color ?? [],
      isPublished: product.isPublished ?? true,
      images: undefined,
    },
  });

  watch("color");

  const onColorChanged = (color: Color) => {
    const currentColors = new Set(getValues("color"));
    currentColors.has(color) ? currentColors.delete(color) : currentColors.add(color);
    setValue("color", Array.from(currentColors));
  };
  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { images, ...productToSave } = data;

    if ( product.id ){
      formData.append("id", product.id ?? "");
    }
    
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("color", productToSave.color.join(','));
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("isPublished", productToSave.isPublished.toString());
    
    if ( images ) {
      for ( let i = 0; i < images.length; i++  ) {
        formData.append('images', images[i]);
      }
    }



    const { ok, product:updatedProduct } = await createUpdateProduct(formData);

    if ( !ok ) {
      alert('Producto no se pudo actualizar');
      return;
    }

    router.replace(`/admin/product/${ updatedProduct?.slug }`)


  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mb-4"> {/* Aumenté el margen inferior */}
          <span className="font-bold mb-1">Estado de Publicación</span>
          <select 
            {...register("isPublished")} 
            className="p-2 border rounded-md bg-gray-200 text-black"
          >
            <option value="true">Publicado (Visible)</option>
            <option value="false">Oculto (Borrador)</option>
          </select>
        </div>
        <button className="btn-primary w-full bg-pink-600 border-pink-700">Guardar</button>
        {/* Botón de borrar producto (solo si no es nuevo) */}
          {product.id && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('¿Estás seguro de borrar TODO el producto? Esta acción no se puede deshacer.')) {
                  const { ok, message } = await deleteProduct(product.id!);
                  if (ok) window.location.replace('/admin/products');
                  else alert(message);
                }
              }}
              className="btn-danger mt-10 w-full p-2 text-center"
            >
              Eliminar Producto Definitivamente
            </button>
          )}
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200 text-black"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

      <div className="flex flex-col">
          <span>Colores Disponibles</span>
          <div className="flex flex-wrap mt-2">
            {availableColors.map((color) => (
              <div
                key={color}
                onClick={() => onColorChanged(color)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 min-w-[70px] transition-all text-center text-sm",
                  {
                    "bg-pink-500 text-white border-pink-600": getValues("color").includes(color),
                    "bg-white text-gray-700": !getValues("color").includes(color),
                  }
                )}
              >
                <span>{color}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              { ...register('images') }
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  alt={product.title ?? ""}
                  src={ image.url }
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={async () => {
                      if (!image.id) {
                        alert("No se pudo encontrar el ID de la imagen");
                        return;
                      } // Seguridad extra
                      
                      if (confirm('¿Deseas eliminar esta imagen?')) {
                        const { ok, message } = await deleteProductImage(image.id, image.url);
                        
                        if (!ok) {
                          alert(message || "Error al eliminar");
                        } 
                      }
                    }}                  
                    className="btn-danger w-full rounded-b-xl"
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
