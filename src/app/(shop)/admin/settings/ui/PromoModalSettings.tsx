"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateStoreConfig } from "@/actions";
import { SaveButton } from "./SaveButton";
import { IoGiftOutline, IoEyeOutline } from "react-icons/io5";

interface Props {
  initialConfig: any;
  availableCoupons: { id: string, code: string, discount:number }[];
}

export const PromoModalSettingsForm = ({ initialConfig, availableCoupons }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const { register, handleSubmit } = useForm({
    defaultValues: initialConfig,
  });

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setFeedback(null);

    // Convertimos el valor del checkbox a booleano real
    const configToSave = {
      ...data,
      isActive: !!data.isActive,
    };

    const { ok } = await updateStoreConfig("promoModal", configToSave);

    if (ok) {
      setFeedback({ ok: true, msg: "¡Promo actualizada!" });
    } else {
      setFeedback({ ok: false, msg: "Error al guardar configuración" });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 shadow-2xl">
        
        {/* Encabezado con Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500/10 p-2 rounded-lg text-pink-500">
              <IoGiftOutline size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Configuración del Pop-up</h4>
              <p className="text-[10px] text-zinc-500 uppercase">Gestiona el modal de bienvenida</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            <span className="ml-3 text-xs font-bold text-zinc-400 uppercase">Activar Modal</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Selector de Cupón */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Vincular Cupón</label>
            <select
              {...register("couponId")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500 outline-none transition-all appearance-none"
            >
              <option value="">Ninguno</option>
              {availableCoupons.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.code} ({coupon.discount}%)
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Título del Modal</label>
            <input
              type="text"
              {...register("title")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500 outline-none transition-all"
              placeholder="Ej: ¡Especial San Valentín!"
            />
          </div>
        </div>

        {/* Subtítulo */}
        <div className="flex flex-col gap-3 mt-8">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Mensaje principal</label>
          <textarea
            {...register("subtitle")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500 outline-none transition-all h-28 resize-none"
            placeholder="Escribe el mensaje persuasivo aquí..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Texto de pié (Vencimiento)</label>
                <input
                    type="text"
                    {...register("footerText")}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500 outline-none"
                />
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 flex items-center gap-2">
                    ID de versión <IoEyeOutline className="text-pink-500" />
                </label>
                <input
                    type="text"
                    {...register("storageKey")}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-pink-500 outline-none"
                    placeholder="ej: promo-marzo-v1"
                />
                <p className="text-[9px] text-zinc-600 px-1 italic">Cambia esto para que el modal le vuelva a aparecer a quienes ya lo cerraron.</p>
            </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex justify-end">
          <SaveButton saving={isSaving} feedback={feedback} label="Actualizar Promoción" />
        </div>
      </div>
    </form>
  );
};