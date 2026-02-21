"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateStoreConfig } from "@/actions";
import { SaveButton } from "./SaveButton";
import { IoHomeOutline } from "react-icons/io5";
import Image from "next/image";

interface Props {
  initialConfig: {
    heroTitle: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    heroTagline: string;
    heroImageUrl?: string; // Agregado a la interfaz
  };
}

export const HomeSettingsForm = ({ initialConfig }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [imageUrl, setImageUrl] = useState(initialConfig.heroImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit } = useForm({
    defaultValues: initialConfig,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    // IMPORTANTE: Usa tu preset de Cloudinary aquí
    formData.append("upload_preset", "tu_preset_aqui"); 

    try {
      // Nota: En el cliente se usa NEXT_PUBLIC_ para las env vars
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await resp.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error subiendo imagen", error);
      setFeedback({ ok: false, msg: "Error al subir la imagen" });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setFeedback(null);

    // Unificamos los textos con la URL de la imagen de Cloudinary
    const configToSave = { ...data, heroImageUrl: imageUrl };
    
    const { ok } = await updateStoreConfig("home", configToSave);

    if (ok) {
      setFeedback({ ok: true, msg: "¡Home actualizada con éxito!" });
    } else {
      setFeedback({ ok: false, msg: "Error al guardar" });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-500">
      <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 shadow-2xl">
        
        {/* SECCIÓN DE IMAGEN */}
        <div className="mb-10 p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.1em] block mb-4">
            Imagen de Fondo del Hero
          </label>
          
          <div className="flex items-center gap-6">
            {imageUrl && (
                <div className="relative h-24 w-40 rounded-lg overflow-hidden border border-zinc-700 bg-black">
                    <Image 
                    src={imageUrl} 
                    alt="Preview Hero" 
                    fill // Usa fill para que se adapte al contenedor
                    className="object-cover opacity-70" 
                    />
                </div>
                )}
            
            <div className="flex-1">
              <input 
                type="file" 
                onChange={handleImageUpload}
                className="hidden" 
                id="hero-upload"
                accept="image/*"
              />
              <label 
                htmlFor="hero-upload"
                className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer transition-all border border-zinc-700"
              >
                {isUploading ? "Subiendo..." : "Cambiar Imagen"}
              </label>
              <p className="text-[9px] text-zinc-600 mt-2 uppercase tracking-tighter">
                Sugerencia: Imagen oscura o con poco contraste para resaltar el texto.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-pink-500/10 p-2 rounded-lg text-pink-500">
            <IoHomeOutline size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Textos del Hero</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Mensajes principales de la Home</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">Tagline (Texto superior)</label>
            <input
              type="text"
              {...register("heroTagline")}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">Título Principal</label>
            <input
              type="text"
              {...register("heroTitle")}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">Título Resaltado (Rosa)</label>
            <input
              type="text"
              {...register("heroTitleAccent")}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-pink-500 font-bold focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">Subtítulo / Descripción</label>
            <textarea
              {...register("heroSubtitle")}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all h-28 resize-none"
            />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex justify-end">
          <SaveButton 
            saving={isSaving || isUploading} 
            feedback={feedback} 
            label="Guardar Cambios Home" 
          />
        </div>
      </div>
    </form>
  );
};