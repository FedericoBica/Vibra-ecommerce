// src/app/admin/posts/[slug]/ui/PostForm.tsx
"use client";

import { useEffect } from "react"; // <--- Agregamos useEffect
import { useForm } from "react-hook-form";
import { createUpdatePost } from "@/actions/blog/create-update-post";
import { useRouter } from "next/navigation";

export const PostForm = ({ post }: any) => {
  const router = useRouter();
  
  // Agregamos 'watch' y 'setValue'
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ...post,
      tags: post.tags?.join(", ") || "",
    }
  });

  // Observamos el campo 'title'
  const titleValue = watch("title");

  useEffect(() => {
    // Si estamos editando un post que YA tiene slug, no lo sobreescribimos automáticamente
    // para no romper enlaces viejos, a menos que sea un post nuevo ("new").
    if ( !post.id && titleValue ) {
      const slug = titleValue
        .toLowerCase()
        .trim()
        .normalize('NFD') // Quita acentos
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9 -]/g, "") // Quita caracteres especiales
        .replace(/\s+/g, "-") // Cambia espacios por guiones
        .replace(/-+/g, "-"); // Quita guiones dobles

      setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, setValue, post.id]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if (post.id) formData.append("id", post.id);
    
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    
    const { ok } = await createUpdatePost(formData);
    if (ok) router.replace("/admin/posts");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
      <div className="flex flex-col gap-4">
        <span>Título</span>
        <input 
          type="text" 
          {...register("title", { required: true })} 
          placeholder="Ej: Mi primer artículo"
          className="p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:border-pink-500 outline-none transition-all" 
        />
        
        <span>Slug (URL)</span>
        <input 
          type="text" 
          {...register("slug", { required: true })} 
          placeholder="mi-primer-articulo"
          className="p-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm font-mono" 
        />

        <span>Resumen (Excerpt)</span>
        <textarea 
            rows={3} 
            {...register("excerpt", { required: true })} 
            placeholder="Un resumen corto para atraer lectores..."
            className="p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-pink-500" 
        />
      </div>

      {/* ... Resto del formulario (Imagen, Tags, IsPublished, Content) ... */}
      {/* Mantené el resto del código que ya tenías abajo */}
      
      <div className="flex flex-col gap-4">
        <span>Imagen (URL)</span>
        <input type="text" {...register("image", { required: true })} className="p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" />

        <span>Tags (separados por coma)</span>
        <input type="text" {...register("tags")} placeholder="ej: salud, bienestar, consejos" className="p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" />

        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" {...register("isPublished")} id="isPublished" className="w-5 h-5 accent-pink-500" />
          <label htmlFor="isPublished">Publicar artículo</label>
        </div>
      </div>

      <div className="sm:col-span-2 flex flex-col gap-4">
        <span>Contenido del Post (HTML soportado)</span>
        <textarea rows={10} {...register("content", { required: true })} className="p-4 rounded-md bg-zinc-800 border border-zinc-700 text-white font-mono text-sm" />
        
        <button className="btn-primary w-full py-3 mt-4 font-bold uppercase tracking-widest bg-pink-600 hover:bg-pink-500 transition-colors rounded-xl">
          Guardar Artículo
        </button>
      </div>
    </form>
  );
};