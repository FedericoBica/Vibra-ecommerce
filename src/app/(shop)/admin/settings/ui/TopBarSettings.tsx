"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateStoreConfig } from "@/actions";
import { IoMegaphoneOutline } from "react-icons/io5";
import { SaveButton } from "./SaveButton";

interface Props {
  initialConfig: {
    message1: string;
    message2: string;
  };
}

export const TopBarSettingsForm = ({ initialConfig }: Props) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  // Ajustamos el estado para que coincida con lo que espera SaveButton { ok, msg }
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: initialConfig,
  });

  const onSubmit = async (data: {message1: string; message2: string}) => {
    setIsSaving(true);
    
    const configToSave = {
      messages: [data.message1, data.message2],
      backgroundColor: '#db2777', // Mantenemos el color por defecto
      isActive: true,
    };
    
    const { ok } = await updateStoreConfig("topbar", configToSave);
    
    if (ok) {
      setFeedback({ ok: true, msg: "¡Cambios aplicados con éxito!" });
      router.refresh();
    } else {
      setFeedback({ ok: false, msg: "Error al intentar guardar" });
    }
    
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-500">
      <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-pink-500/10 p-2 rounded-lg text-pink-500">
            <IoMegaphoneOutline size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Mensajes de la Marquesina</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Personaliza los anuncios globales de la tienda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">
              Anuncio Principal <span className="text-pink-500/50">(Usa {"{price}"} para el monto de envío)</span>
            </label>
            <input
              type="text"
              {...register("message1", { required: true })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 outline-none transition-all"
              placeholder="🔥 Envíos GRATIS en compras mayores a {price}"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-[0.1em]">Anuncio Secundario</label>
            <input
              type="text"
              {...register("message2", { required: true })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 outline-none transition-all"
              placeholder="🤫 Discreción absoluta en todos tus pedidos"
            />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex justify-end">
          <div className="w-full sm:w-auto">
            <SaveButton 
              saving={isSaving} 
              feedback={feedback} 
              label="Guardar Anuncios" 
            />
          </div>
        </div>
      </div>
    </form>
  );
};